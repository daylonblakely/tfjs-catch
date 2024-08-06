import * as tf from '@tensorflow/tfjs';
import { useAppSelector } from '../state/hooks';

import {
  INPUT_SIZE,
  HORIZONTAL_SECTIONS,
  VERTICAL_SECTIONS,
} from '../constants';

export const useEnvironmentState = () => {
  const balls = useAppSelector((state) => state.balls);
  const basket = useAppSelector((state) => state.basket);

  const getEnvironmentState = (): tf.Tensor2D => {
    const state = new Array(INPUT_SIZE).fill(0);

    //   set basket position
    state[basket.x] = 1;

    //   set ball positions
    let ballIndex = 0;
    balls.forEach((ball) => {
      // skip if ball is done
      if (!ball.isDone) {
        const positionOffset =
          HORIZONTAL_SECTIONS +
          ballIndex * (HORIZONTAL_SECTIONS + VERTICAL_SECTIONS + 1);

        //   set x position
        state[positionOffset + ball.x] = 1;
        //  set y position
        state[positionOffset + HORIZONTAL_SECTIONS + ball.y] = 1;
        //  set duration
        state[positionOffset + HORIZONTAL_SECTIONS + VERTICAL_SECTIONS] =
          ball.duration;

        ballIndex++;
      }
    });

    return tf.tensor2d([state]);
    // return state;
  };

  return { getEnvironmentState };
};
