import * as tf from '@tensorflow/tfjs';
import { Ball } from '../state/balls-slice';
import { Basket } from '../state/basket-slice';
import { HORIZONTAL_SECTIONS } from '../constants';

export const getEnvironmentState = (
  basket: Basket,
  balls: Ball[],
  inputSize: number
): tf.Tensor2D => {
  const state = new Array(inputSize).fill(0);

  // Set basket position
  state[0] = basket.x / HORIZONTAL_SECTIONS;
  // set velocity
  state[1] = basket.velocity / HORIZONTAL_SECTIONS;

  balls
    .filter((ball) => ball.isActive)
    .forEach((ball, i) => {
      const positionOffset = 2 + i * 2;

      // Set x position (normalized)
      state[positionOffset] = ball.x / HORIZONTAL_SECTIONS;
      // Set y position (normalized)
      state[positionOffset + 1] = ball.y / window.innerHeight;
    });

  return tf.tensor2d([state]);
};
