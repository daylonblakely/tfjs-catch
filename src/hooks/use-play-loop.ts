import { useEffect, useMemo, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';

import { moveLeft, moveRight } from '../state/basket-slice';
import { updateAllBallY } from '../state/balls-slice';

import { Network } from '../Network';
import { getEnvironmentState } from '../utils/getEnvironmentState';

export const usePlayLoop = () => {
  const balls = useAppSelector((state) => state.balls.balls);
  const lastRimHitX = useAppSelector((state) => state.balls.lastRimHitX);
  const basket = useAppSelector((state) => state.basket);
  const gameSettings = useAppSelector((state) => state.gameSettings);
  const dispatch = useAppDispatch();

  const modelRef = useRef<Network | null>(null);

  const actions = useMemo(
    () => [() => dispatch(moveLeft()), () => {}, () => dispatch(moveRight())],
    [dispatch]
  );

  const inputSize = 2 + gameSettings.maxBalls * 2;

  const basketX = useRef(basket.x);
  const lastRimHitXRef = useRef(lastRimHitX);

  useEffect(() => {
    basketX.current = basket.x;
  }, [basket.x]);

  useEffect(() => {
    lastRimHitXRef.current = lastRimHitX;
  }, [lastRimHitX]);

  const animationFrameId = useRef<number | null>(null);
  const previousBasketX = useRef(basket.x);

  const update = () => {
    // Update y for all balls
    dispatch(
      updateAllBallY({
        basketX: basketX.current,
        movedSincedLastRimHit: basketX.current !== lastRimHitXRef.current,
        plusY: 2,
      })
    );

    const state = getEnvironmentState(
      basket.x,
      previousBasketX.current,
      Object.values(balls),
      inputSize
    );

    previousBasketX.current = basket.x;
    if (modelRef.current) {
      const action = modelRef.current.chooseAction(state, 0);
      actions[action]();
    }

    animationFrameId.current = requestAnimationFrame(update);
  };

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
