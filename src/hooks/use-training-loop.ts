import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';

import { moveLeft, moveRight } from '../state/basket-slice';
import { resetBallState, updateAllBallY } from '../state/balls-slice';

import { Network } from '../Network';
import { getEnvironmentState } from '../utils/getEnvironmentState';
import { calculateReward } from '../utils/calculateReward';

export const useTrainingLoop = () => {
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

  const moveLeftThunk = () => {
    return async (dispatch: any) => {
      return new Promise<void>((resolve) => {
        dispatch(moveLeft());
        resolve();
      });
    };
  };

  const moveRightThunk = () => {
    return async (dispatch: any) => {
      return new Promise<void>((resolve) => {
        dispatch(moveRight());
        resolve();
      });
    };
  };

  const actions = [
    moveLeftThunk,
    () => async (dispatch: any) => new Promise<void>((resolve) => resolve()),
    moveRightThunk,
  ];

  const inputSize = 1 + gameSettings.maxBalls * 2;

  if (!modelRef.current) {
    modelRef.current = new Network({
      hiddenLayerSizes: gameSettings.hiddenLayerSizes,
      inputSize,
      numActions: 3,
    });

    modelRef.current
      .setBatchSize(gameSettings.batchSize)
      .setDiscountRate(gameSettings.discountRate)
      .setMemory(gameSettings.memoryLength)
      .setLearningRate(gameSettings.learningRate);
  }

  const updateAllBallYThunk = (payload: {
    basketX: number;
    movedSincedLastRimHit: boolean;
    plusY: number;
  }) => {
    return async (dispatch: any) => {
      return new Promise<void>((resolve) => {
        dispatch(updateAllBallY(payload));
        resolve();
      });
    };
  };

  const resetBallStateThunk = () => {
    return async (dispatch: any) => {
      return new Promise<void>((resolve) => {
        dispatch(resetBallState());
        resolve();
      });
    };
  };

  const train = async () => {
    let eps = gameSettings.epsilonDecay;

    for (let i = 0; i < gameSettings.numGames; i++) {
      await dispatch(resetBallStateThunk());
      console.log('Starting Game: ', i);

      for (let j = 0; j < gameSettings.numEpisodes; j++) {
        await dispatch(
          updateAllBallYThunk({
            basketX: basketRef.current.x,
            movedSincedLastRimHit: false,
            plusY: 2,
          })
        );

        const state = getEnvironmentState(
          basketRef.current.x,
          Object.values(ballsRef.current),
          inputSize
        );

        const previousBasketX = basketRef.current.x;
        const action = modelRef.current?.chooseAction(state, eps) ?? 1;
        await dispatch(actions[action]());

        const reward = calculateReward(
          Object.values(ballsRef.current),
          basketRef.current.x,
          previousBasketX
        );

        const nextState = getEnvironmentState(
          basketRef.current.x,
          Object.values(ballsRef.current),
          inputSize
        );

        modelRef.current?.remember(state, action, reward, nextState);

        eps = Math.max(
          gameSettings.minEpsilon,
          eps * gameSettings.epsilonDecay
        );
      }

      await modelRef.current?.train();
    }

    console.log('Training done');
    await modelRef.current?.saveModel();
  };

  return { train };
};
