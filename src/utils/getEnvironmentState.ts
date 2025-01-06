import * as tf from '@tensorflow/tfjs';
import { Ball } from '../state/balls-slice';
import { HORIZONTAL_SECTIONS } from '../constants';

const ballOffsets = new Map<string, number>();

export const getEnvironmentState = (
  basketPosition: number,
  balls: Ball[],
  inputSize: number
): tf.Tensor2D => {
  const state = new Array(inputSize).fill(0);

  // Set basket position
  state[0] = basketPosition / HORIZONTAL_SECTIONS;

  // Set ball positions
  balls.forEach((ball) => {
    if (!ball.isActive) {
      // Remove the offset if the ball becomes inactive
      ballOffsets.delete(ball.id);
      return;
    }

    // Get or assign a position offset for the ball
    let positionOffset = ballOffsets.get(ball.id);
    if (positionOffset === undefined) {
      positionOffset = 1 + ballOffsets.size * 2;
      ballOffsets.set(ball.id, positionOffset);
    }

    // Set x position (normalized)
    state[positionOffset] = ball.x / HORIZONTAL_SECTIONS;
    // Set y position (normalized)
    state[positionOffset + 1] = ball.y / window.innerHeight;
  });

  return tf.tensor2d([state]);
};
