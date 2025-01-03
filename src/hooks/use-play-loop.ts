import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';

import { moveLeft, moveRight } from '../state/basket-slice';

import { Network } from '../Network';
import { getEnvironmentState } from '../utils/getEnvironmentState';

import { HORIZONTAL_SECTIONS } from '../constants';

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
