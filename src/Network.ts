import * as tf from '@tensorflow/tfjs';
import { Model } from './Model';
import { ReplayMemory } from './ReplayMemory';
import { INPUT_SIZE, NUMBER_OF_ACTIONS } from './constants';

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
  private batchSize = 32;
  private discountRate = 0.99;

  constructor(params: NetworkParams) {
    this.numActions = params.numActions;

    if ('model' in params && params.model instanceof Model) {
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

  // epsilon-greedy policy
  // With probability `eps` we act randomly, otherwise we act greedily.
  chooseAction(state: tf.Tensor, eps: number): number {
    // explore
    if (Math.random() < eps) {
      return Math.floor(Math.random() * this.numActions);
    } else {
      // exploit
      return tf.tidy(() => {
        // get raw output values
        const logits = this.model.predict(state) as tf.Tensor;
        // turn into probability distribution 0-1
        const sigmoid = tf.sigmoid(logits);
        // normalize to sum to 1
        const probs = tf.div(sigmoid, tf.sum(sigmoid)) as tf.Tensor1D;
        // randomly sample from dist
        return tf.multinomial(probs, 1).dataSync()[0];
      });
    }
  }

  // add sample to memory
  remember(
    state: tf.Tensor,
    action: number,
    reward: number,
    nextState: tf.Tensor
  ) {
    this.memory.addSample([state, action, reward, nextState]);
  }

  // learn from memory
  async train() {
    // Sample from memory
    const batch = this.memory.sample(this.batchSize);
    const states = batch.map(([state, , ,]) => state);
    const nextStates = batch.map(([, , , nextState]) =>
      nextState ? nextState : tf.zeros([this.model.inputSize])
    );

    // Predict the values of each action at each state
    const qsa = states.map((state) => this.model.predict(state)) as tf.Tensor[];
    // Predict the values of each action at each next state
    const qsad = nextStates.map((nextState) =>
      this.model.predict(nextState)
    ) as tf.Tensor[];

    const x: number[][] = [];
    const y: number[][] = [];

    // Update the states rewards with the discounted next states rewards
    batch.forEach(([state, action, reward, nextState], index) => {
      const currentQ = qsa[index].clone();
      currentQ.dataSync()[action] = nextState
        ? reward + this.discountRate * qsad[index].max().dataSync()[0]
        : reward;

      x.push(Array.from(state.dataSync()));
      y.push(Array.from(currentQ.dataSync()));
      currentQ.dispose();
    });

    // Clean unused tensors
    qsa.forEach((state) => state.dispose());
    qsad.forEach((state) => state.dispose());

    // Reshape the batches to be fed to the network
    const xBatch = tf.tensor2d(x, [x.length, this.model.inputSize]);
    const yBatch = tf.tensor2d(y, [y.length, this.numActions]);

    // Learn the Q(s, a) values given associated discounted rewards
    await this.model.fit(xBatch, yBatch, { batchSize: this.batchSize });

    xBatch.dispose();
    yBatch.dispose();
  }

  // save the model
  async saveModel() {
    return await this.model.save(MODEL_SAVE_PATH);
  }

  // load the model
  static async loadModel() {
    const modelsInfo = await tf.io.listModels();
    if (MODEL_SAVE_PATH in modelsInfo) {
      console.log(`Loading existing model...`);
      const model = await tf.loadLayersModel(MODEL_SAVE_PATH);
      console.log(`Loaded model from ${MODEL_SAVE_PATH}`);
      return new Network({
        model: model as Model,
        inputSize: INPUT_SIZE,
        numActions: NUMBER_OF_ACTIONS,
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
