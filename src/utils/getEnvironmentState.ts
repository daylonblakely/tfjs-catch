import * as tf from '@tensorflow/tfjs';
import { Ball } from '../state/balls-slice';
import { Basket } from '../state/basket-slice';
import { HORIZONTAL_SECTIONS } from '../constants';

const ballOffsets: { [key in string]: number } = {};

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

  // Set ball positions
  // balls.forEach((ball) => {
  //   if (!ball.isActive) {
  //     // Remove the offset if the ball becomes inactive
  //     // ballOffsets.delete(ball.id);
  //     delete ballOffsets[ball.id];
  //     return;
  //   }

  //   // Get or assign a position offset for the ball
  //   let positionOffset = ballOffsets[ball.id];
  //   if (positionOffset === undefined) {
  //     // get next available positionOffset starting at 2
  //     for (let i = 2; i < inputSize; i += 2) {
  //       if (!Object.values(ballOffsets).includes(i)) {
  //         positionOffset = i;
  //         ballOffsets[ball.id] = positionOffset;
  //         break;
  //       }
  //     }
  //   }
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
