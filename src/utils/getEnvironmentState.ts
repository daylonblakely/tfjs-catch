import * as tf from '@tensorflow/tfjs';
import { Ball } from '../state/balls-slice';
import { HORIZONTAL_SECTIONS } from '../constants';

export const getEnvironmentState = (
  basketPosition: number,
  balls: Ball[],
  inputSize: number
): tf.Tensor2D => {
  const state = new Array(inputSize).fill(0);

  //   set basket position
  state[basketPosition] = 1;

  //   set ball positions
  let ballIndex = 0;
  balls.forEach((ball) => {
    if (!ball.isActive) return;

    const positionOffset =
      HORIZONTAL_SECTIONS + ballIndex * (HORIZONTAL_SECTIONS + 1);

    //   set x position
    state[positionOffset + ball.x] = 1;
    // set y position
    // normalize y position
    state[positionOffset + HORIZONTAL_SECTIONS] = ball.y / window.innerHeight;

    ballIndex++;
  });

  return tf.tensor2d([state]);
};
