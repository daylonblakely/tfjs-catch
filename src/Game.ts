import * as tf from '@tensorflow/tfjs';
import { Network } from './Network';
import { Ball } from './state/balls-slice';
import { Basket } from './state/basket-slice';

import { VERTICAL_SECTIONS } from './constants';

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

  async play(
    getState: () => tf.Tensor2D,
    getReward: () => number,
    shouldCheckForModel: boolean
  ) {
    // let model: Network;
    // Check if the model exists in IndexedDB.
    // If it does, load the model.
    // Otherwise, create a new model.
    // const modelExists = await Network.checkStoredModelStatus();

    // if (shouldCheckForModel && modelExists) {
    //   model = await Network.loadModel();
    // } else {
    //   model = new Network({
    //     hiddenLayerSizes: [128, 128],
    //     inputSize: this.getState().shape[1],
    //     numActions: this.actions.length,
    //   });
    // }
    // while (true) {
    console.log(getState().dataSync());
    console.log(getReward());
    //   let reward = this.calculateReward(this.balls, this.basket);
    //   if (reward > 0) {
    //     console.log('Reward: ', reward);
    //   }
    // }

    // TODO - put this in a loop
    // const action = model.chooseAction(this.getState(), this.eps);
    // this.runAction(action);
  }
}
