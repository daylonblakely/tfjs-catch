import * as tf from '@tensorflow/tfjs';
import { Network } from './Network';

const MIN_EPSILON = 0.01;
const MAX_EPSILON = 0.2;
const LAMBDA = 0.01;

interface GameParams {
  actions: Function[];
}

export class Game {
  private actions: Function[];
  private eps: number;

  constructor(params: GameParams) {
    this.actions = params.actions;

    // The exploration parameter
    this.eps = MAX_EPSILON;
  }

  runAction(action: number) {
    this.actions[action]();
  }

  async learnToPlay(getState: () => tf.Tensor2D, getReward: () => number) {
    const model = new Network({
      hiddenLayerSizes: [128, 128],
      inputSize: getState().shape[1],
      numActions: this.actions.length,
    });

    const BATCH_SIZE = 32;
    const MAX_BUFFER_SIZE = 1000;
    const NUM_EPISODES = 1000;

    let episode = 0;

    const runEpisode = async () => {
      if (episode >= NUM_EPISODES) {
        return;
      }

      let state = getState();
      let done = false;

      while (!done) {
        const action = model.chooseAction(state, this.eps);
        console.log('Action: ', action);
        this.runAction(action);
        const reward = getReward();
        const nextState = getState();

        model.remember(state, action, reward, nextState);

        await model.train();

        state = nextState;

        // if (reward > 0) {
        //   done = true;
        // }
      }

      this.eps = Math.max(MIN_EPSILON, this.eps * Math.exp(-LAMBDA * episode));
      episode++;

      // Use requestAnimationFrame to ensure the UI remains responsive
      requestAnimationFrame(runEpisode);
    };

    // Start the first episode
    requestAnimationFrame(runEpisode);
  }
}
