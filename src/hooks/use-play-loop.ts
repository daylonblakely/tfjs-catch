import { useEffect, useMemo, useRef, useState } from 'react';
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

  const [model, setModel] = useState<Network | null>(null);
  // const modelRef = useRef<Network | null>(null);
  // const basketRef = useRef(basket);
  // const ballsRef = useRef(balls);

  // useEffect(() => {
  //   basketRef.current = basket;
  // }, [basket]);

  // useEffect(() => {
  //   ballsRef.current = balls;
  // }, [balls]);

  const actions = useMemo(
    () => [() => dispatch(moveLeft()), () => {}, () => dispatch(moveRight())],
    [dispatch]
  );

  const inputSize = 1 + gameSettings.maxBalls * 2;

  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const update = async () => {
      // Update y for all balls
      dispatch(
        updateAllBallY({
          basketX: basket.x,
          movedSincedLastRimHit: basket.x !== lastRimHitX,
          plusY: 2,
        })
      );

      const state = getEnvironmentState(
        basket.x,
        Object.values(balls),
        inputSize
      );

      const action = model!.chooseAction(state, 0);
      actions[action]();
      // await new Promise((resolve) => setTimeout(resolve, 50));

      animationFrameId.current = requestAnimationFrame(update);
    };

    if (model) {
      animationFrameId.current = requestAnimationFrame(update);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [actions, basket.x, balls, dispatch, inputSize, lastRimHitX, model]);

  const play = async () => {
    // modelRef.current = await Network.loadModel(inputSize, actions.length);
    const model = await Network.loadModel(inputSize, actions.length);
    setModel(model);

    // const moveBasket = async () => {
    //   const state = getEnvironmentState(
    //     basketRef.current.x,
    //     Object.values(ballsRef.current),
    //     inputSize
    //   );

    //   const action = modelRef.current!.chooseAction(state, 0);
    //   actions[action]();
    //   // await new Promise((resolve) => setTimeout(resolve, 0));

    //   requestAnimationFrame(moveBasket);
    // };

    // requestAnimationFrame(moveBasket);
  };

  return { play };
};
