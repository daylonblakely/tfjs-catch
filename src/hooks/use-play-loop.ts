import { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useAppSelector, useAppDispatch } from '../state/hooks';

import { moveLeft, moveRight } from '../state/basket-slice';
import { Ball } from '../state/balls-slice';

import { Network } from '../Network';

import { HORIZONTAL_SECTIONS } from '../constants';

const getEnvironmentState = (
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
    state[positionOffset + HORIZONTAL_SECTIONS] = ball.y;

    ballIndex++;
  });

  return tf.tensor2d([state]);
};

export const usePlayLoop = () => {
  const balls = useAppSelector((state) => state.balls.balls);
  const basket = useAppSelector((state) => state.basket);
  const gameSettings = useAppSelector((state) => state.gameSettings);
  const dispatch = useAppDispatch();

  const modelRef = useRef<Network | null>(null);
  const basketRef = useRef(basket);
  const ballsRef = useRef(balls);

  useEffect(() => {
    basketRef.current = basket;
  }, [basket]);

  useEffect(() => {
    ballsRef.current = balls;
  }, [balls]);

  const actions = [
    () => dispatch(moveLeft()),
    () => {},
    () => dispatch(moveRight()),
  ];

  const inputSize =
    HORIZONTAL_SECTIONS + gameSettings.maxBalls * (HORIZONTAL_SECTIONS + 1);

  const play = async () => {
    modelRef.current = await Network.loadModel(inputSize, actions.length);

    const moveBasket = async () => {
      const state = getEnvironmentState(
        basketRef.current.x,
        Object.values(ballsRef.current),
        inputSize
      );

      const action = modelRef.current!.chooseAction(state, 0);
      actions[action]();
      await new Promise((resolve) => setTimeout(resolve, 200));

      requestAnimationFrame(moveBasket);
    };

    requestAnimationFrame(moveBasket);
  };

  return { play };
};
