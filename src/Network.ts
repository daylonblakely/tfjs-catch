import * as tf from '@tensorflow/tfjs';
import { Model } from './Model';
import { ReplayMemory } from './ReplayMemory';

// The IndexedDB path where the model of the policy network will be saved.
const MODEL_SAVE_PATH = 'indexeddb://tfjs-catch-v0';

type NetworkParams = ({ model: Model } | { hiddenLayerSizes: number[] }) & {
  inputSize: number;
  numActions: number;
};

export class Network {
  private model: Model;
  private memory: ReplayMemory = new ReplayMemory(1000);
  private numActions: number;
  private batchSize = 128;
  private discountRate = 0.95;
  private learningRate = 0.001;

  constructor(params: NetworkParams) {
    this.numActions = params.numActions;

    if ('model' in params) {
      this.model = params.model;
    } else if ('hiddenLayerSizes' in params) {
      this.model = new Model(
        params.inputSize,
        params.numActions,
        params.hiddenLayerSizes
      );
    } else {
      throw new Error(
        'Invalid parameters: either model or hiddenLayerSizes must be provided.'
      );
    }
  }

  setMemory(memoryLength: number) {
    this.memory = new ReplayMemory(memoryLength);
    return this;
  }

  setBatchSize(batchSize: number) {
    this.batchSize = batchSize;
    return this;
  }

  setDiscountRate(discountRate: number) {
    this.discountRate = discountRate;
    return this;
  }

  setLearningRate(learningRate: number) {
    this.learningRate = learningRate;
    return this;
  }

  // epsilon-greedy policy
  // With probability `eps` we act randomly, otherwise we act greedily.
  chooseAction(state: number[], eps: number): number {
    // explore
    if (Math.random() < eps) {
      return Math.floor(Math.random() * this.numActions);
    } else {
      // exploit
      return tf.tidy(() => {
        // console.log(this.predict(state));
        // return this.predict(state).argMax(1).dataSync()[0];
        // // get raw output values
        const stateTensor = tf.tensor2d([state]);
        const logits = this.model.predict(stateTensor) as tf.Tensor;
        // console.log(state.dataSync());
        // console.log(logits.dataSync());
        return logits.argMax(1).dataSync()[0];
        // turn into probability distribution 0-1
        const sigmoid = tf.sigmoid(logits);
        // normalize to sum to 1
        const probs = tf.div(sigmoid, tf.sum(sigmoid)) as tf.Tensor1D;
        console.log(probs.dataSync());
        // randomly sample from dist
        console.log(tf.multinomial(probs, 1).dataSync());
        const action = tf.multinomial(probs, 1).dataSync()[0];
        // // clean up tensors
        // logits.dispose();
        // sigmoid.dispose();
        // probs.dispose();

        return action;
      });
    }
  }

  // add sample to memory
  remember(
    state: number[],
    action: number,
    reward: number,
    nextState: number[]
  ) {
    this.memory.addSample([
      tf.tensor2d([state]),
      action,
      reward,
      tf.tensor2d([nextState]),
    ]);
  }

  predict(state: tf.Tensor): tf.Tensor {
    return tf.tidy(() => {
      const prediction = this.model.predict(state) as tf.Tensor;
      return prediction;
    });
  }

  // learn from memory
  async train() {
    const batch = this.memory.sample(this.batchSize);

    const [x, y] = tf.tidy(() => {
      // Extract states and nextStates
      const [states, nextStates] = batch.reduce(
        ([states, nextStates], [state, , , nextState]) => {
          states.push(state);
          nextStates.push(
            nextState ? nextState : tf.zeros([this.model.inputSize])
          );
          return [states, nextStates];
        },
        [[], []] as [tf.Tensor[], tf.Tensor[]]
      );

      // Predict Q-values
      const [qsa, qsad] = states.reduce(
        ([qsa, qsad], state, i) => {
          qsa.push(this.predict(state));
          qsad.push(this.predict(nextStates[i]));
          return [qsa, qsad];
        },
        [[], []] as [tf.Tensor[], tf.Tensor[]]
      );

      const x: number[][] = [];
      const y: number[][] = [];

      // Update rewards and prepare training data
      batch.forEach(([state, action, reward, nextState], index) => {
        const currentQ = qsa[index].dataSync(); // No need to dispose here as it's wrapped in tidy
        const targetQ = [...currentQ]; // Copy current Q-values to modify

        if (nextState) {
          const maxNextQ = qsad[index].max().dataSync()[0];
          targetQ[action] =
            targetQ[action] +
            this.learningRate *
              (reward + this.discountRate * maxNextQ - targetQ[action]);
        } else {
          targetQ[action] = reward;
        }

        x.push(Array.from(state.dataSync()));
        y.push(Array.from(targetQ));
      });

      // Dispose tensors from predictions
      qsa.forEach((tensor) => tensor.dispose());
      qsad.forEach((tensor) => tensor.dispose());

      return [x, y];
    });

    // Convert x and y into tensors
    const xBatch = tf.tensor2d(x, [x.length, this.model.inputSize]);
    const yBatch = tf.tensor2d(y, [y.length, this.numActions]);

    // Train the model
    await this.model.fit(xBatch, yBatch, { batchSize: this.batchSize });

    // Dispose batches after training
    xBatch.dispose();
    yBatch.dispose();
  }

  // save the model
  async saveModel() {
    const modelsInfo = await tf.io.listModels();
    if (MODEL_SAVE_PATH in modelsInfo) {
      console.log(`Removing existing model at ${MODEL_SAVE_PATH}...`);
      await tf.io.removeModel(MODEL_SAVE_PATH);
      console.log(`Existing model removed.`);
    }
    console.log(`Saving new model...`);
    return await this.model.save(MODEL_SAVE_PATH);
  }

  // load the model
  static async loadModel(inputSize: number, numActions: number) {
    const modelsInfo = await tf.io.listModels();
    if (MODEL_SAVE_PATH in modelsInfo) {
      console.log(`Loading existing model...`);
      const model = await tf.loadLayersModel(MODEL_SAVE_PATH);
      console.log(`Loaded model from ${MODEL_SAVE_PATH}`);
      return new Network({
        model: model as Model,
        inputSize,
        numActions,
      });
    } else {
      throw new Error(`Cannot find model at ${MODEL_SAVE_PATH}.`);
    }
  }

  static async checkStoredModelStatus() {
    const modelsInfo = await tf.io.listModels();
    return modelsInfo[MODEL_SAVE_PATH];
  }

  /**
   * Remove the locally saved model from IndexedDB.
   */
  async removeModel() {
    return await tf.io.removeModel(MODEL_SAVE_PATH);
  }
}
