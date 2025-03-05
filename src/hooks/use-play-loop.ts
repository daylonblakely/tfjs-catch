import { useEffect, useMemo, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';

import { moveLeft, moveRight, stay } from '../state/basket-slice';
import { updateAllBalls } from '../state/balls-slice';

import { Network } from '../Network';
import { getEnvironmentState } from '../utils/getEnvironmentState';
import { updateBalls } from '../utils/ballUtils';

export const usePlayLoop = () => {
  const balls = useAppSelector((state) => state.balls.balls);
  const basket = useAppSelector((state) => state.basket);
  const gameSettings = useAppSelector((state) => state.gameSettings);
  const dispatch = useAppDispatch();

  const modelRef = useRef<Network | null>(null);

  const actions = useMemo(
    () => [
      () => dispatch(moveLeft()),
      () => dispatch(stay()),
      () => dispatch(moveRight()),
    ],
    [dispatch]
  );

  const inputSize = 2 + gameSettings.maxBalls * 3;

  const basketRef = useRef(basket);
  const ballsRef = useRef(balls);

  useEffect(() => {
    basketRef.current = basket;
  }, [basket]);

  useEffect(() => {
    ballsRef.current = balls;
  }, [balls]);

  const animationFrameId = useRef<number | null>(null);

  const update = () => {
    count.current++;
    console.log(count.current);
    // Update y for all balls
    const newBalls = updateBalls(
      [...ballsRef.current],
      basketRef.current.x,
      basketRef.current.velocity !== 0,
      10
    );

    const state = getEnvironmentState(basketRef.current, newBalls, inputSize);

    if (modelRef.current) {
      try {
        const action = modelRef.current.chooseAction(state, 0);
        actions[action]();
      } catch (error) {
        alert(error);
        return;
      }
    }
    dispatch(updateAllBalls(newBalls));

    animationFrameId.current = requestAnimationFrame(update);
  };

  const count = useRef(0);
  const play = async () => {
    const loadedModel = await Network.loadModel(inputSize, actions.length);
    modelRef.current = loadedModel;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    animationFrameId.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return { play };
};
