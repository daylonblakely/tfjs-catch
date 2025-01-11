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

  const basketRef = useRef(basket);
  const lastRimHitXRef = useRef(lastRimHitX);
  const ballsRef = useRef(balls);

  useEffect(() => {
    basketRef.current = basket;
  }, [basket]);

  useEffect(() => {
    lastRimHitXRef.current = lastRimHitX;
  }, [lastRimHitX]);

  useEffect(() => {
    ballsRef.current = balls;
  }, [balls]);

  const animationFrameId = useRef<number | null>(null);
  const previousBasketX = useRef(basket.x);

  const update = () => {
    // Update y for all balls
    dispatch(
      updateAllBallY({
        basketX: basketRef.current.x,
        movedSincedLastRimHit: basketRef.current.x !== lastRimHitXRef.current,
        plusY: 2,
      })
    );

    const state = getEnvironmentState(
      basketRef.current,
      Object.values(ballsRef.current),
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
