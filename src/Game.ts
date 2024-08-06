import * as tf from '@tensorflow/tfjs';
import { Network } from './Network';
import { Ball } from './state/balls-slice';
import { Basket } from './state/basket-slice';

import { VERTICAL_SECTIONS } from './constants';

const MIN_EPSILON = 0.01;
const MAX_EPSILON = 0.2;
const LAMBDA = 0.01;

interface GameParams {
  getState: () => tf.Tensor2D;
  actions: Function[];
}

export class Game {
  private getState: () => tf.Tensor2D;
  private actions: Function[];
  private eps: number;

  constructor(params: GameParams) {
    this.getState = params.getState;
    this.actions = params.actions;

    // The exploration parameter
    this.eps = MAX_EPSILON;
  }

  calculateReward(balls: Ball[], basket: Basket): number {
    let reward = 0;
    balls.forEach((ball) => {
      if (!ball.isDone) {
        const ballPosition = ball.x;
        const basketPosition = basket.x;
        // TODO this might need to check the distance
        if (
          ball.y === VERTICAL_SECTIONS - 1 &&
          ballPosition === basketPosition
        ) {
          reward += 1;
        }
      }
    });
    return reward;
  }

  runAction(action: number) {
    this.actions[action]();
  }

  async play(shouldCheckForModel: boolean) {
    let model: Network;
    // Check if the model exists in IndexedDB.
    // If it does, load the model.
    // Otherwise, create a new model.
    const modelExists = await Network.checkStoredModelStatus();

    if (shouldCheckForModel && modelExists) {
      model = await Network.loadModel();
    } else {
      model = new Network({
        hiddenLayerSizes: [128, 128],
        inputSize: this.getState().shape[1],
        numActions: this.actions.length,
      });
    }

    // TODO - put this in a loop
    const action = model.chooseAction(this.getState(), this.eps);
    this.runAction(action);
  }
}
