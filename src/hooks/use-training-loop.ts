import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';

import { Basket, moveLeft, moveRight } from '../state/basket-slice';
import { Ball, resetBallState, updateAllBallY } from '../state/balls-slice';

import { Network } from '../Network';
import { getEnvironmentState } from '../utils/getEnvironmentState';
import { calculateReward } from '../utils/calculateReward';
import { checkIfBallHitRim, checkIfBallWentIn } from '../utils/ballUtils';
import { BASKET_Y, HORIZONTAL_SECTIONS, MAX_BALLS } from '../constants';

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

  const inputSize = 2 + gameSettings.maxBalls * 2;

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
    let eps = gameSettings.epsilonStart;

    for (let i = 0; i < gameSettings.numGames; i++) {
      await dispatch(resetBallStateThunk());
      console.log('Starting Game: ', i);

      let previousBasketX = basketRef.current.x;
      for (let j = 0; j < gameSettings.numEpisodes; j++) {
        await dispatch(
          updateAllBallYThunk({
            basketX: basketRef.current.x,
            movedSincedLastRimHit: false,
            plusY: 20,
          })
        );

        const state = getEnvironmentState(
          basketRef.current.x,
          previousBasketX,
          Object.values(ballsRef.current),
          inputSize
        );

        previousBasketX = basketRef.current.x;
        const action = modelRef.current?.chooseAction(state, eps) ?? 1;
        await dispatch(actions[action]());

        const reward = calculateReward(
          Object.values(ballsRef.current),
          basketRef.current.x,
          previousBasketX
        );

        const nextState = getEnvironmentState(
          basketRef.current.x,
          previousBasketX,
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

  const updateMockBalls = (
    mockBalls: Ball[],
    basketX: number,
    movedSincedLastRimHit: boolean
  ): Ball[] => {
    const lastAddedBall = mockBalls[mockBalls.length - 1];
    if (
      !mockBalls.length ||
      (lastAddedBall.y > 100 && mockBalls.length < MAX_BALLS)
    ) {
      mockBalls.push({
        id: mockBalls.length.toString(),
        x: Math.floor(Math.random() * HORIZONTAL_SECTIONS),
        y: -100,
        fallSpeed: Math.random() * 0.5 + 0.5,
        hitRim: false,
        missed: false,
        wentIn: false,
        isActive: true,
      });
    }

    return mockBalls.reduce((acc, ball) => {
      if (!ball.isActive && ball.y > BASKET_Y + 100) {
        return acc;
      }

      const newY = ball.y + 20;
      const newBall = { ...ball, y: newY };

      if (!ball.hitRim && checkIfBallHitRim(ball, basketX)) {
        newBall.hitRim = true;
      }

      const ballStatus = checkIfBallWentIn(
        newBall,
        basketX,
        movedSincedLastRimHit
      );

      if (ballStatus === 'wentIn') {
        newBall.wentIn = true;
        newBall.isActive = false;
      } else if (ballStatus === 'missed') {
        newBall.missed = true;
        newBall.isActive = false;
      }

      return [...acc, newBall];
    }, [] as Ball[]);
  };

  const updateMockBasket = (mockBasket: Basket, action: number): Basket => {
    if (action === 0) {
      return {
        x: Math.max(0, mockBasket.x - 1),
        velocity: -1,
      };
    } else if (action === 2) {
      return {
        x: Math.min(HORIZONTAL_SECTIONS - 1, mockBasket.x + 1),
        velocity: 1,
      };
    } else {
      return {
        x: mockBasket.x,
        velocity: 0,
      };
    }
  };

  const trainWithoutState = async () => {
    let eps = gameSettings.epsilonStart;

    for (let i = 0; i < gameSettings.numGames; i++) {
      console.log('Starting Game: ', i);
      let mockBalls: Ball[] = [];
      let mockBasket: Basket = {
        x: Math.floor(HORIZONTAL_SECTIONS / 2),
        velocity: 1,
      };
      for (let j = 0; j < gameSettings.numEpisodes; j++) {
        mockBalls = updateMockBalls(
          mockBalls,
          mockBasket.x,
          mockBasket.velocity !== 0
        );
        // get state
        const state = getEnvironmentState(
          mockBasket.x,
          mockBasket.x + mockBasket.velocity,
          mockBalls,
          inputSize
        );
        // choose action
        const action = modelRef.current?.chooseAction(state, eps) ?? 1;
        // update basket
        mockBasket = updateMockBasket(mockBasket, action);

        // get reward
        const reward = calculateReward(
          mockBalls,
          mockBasket.x,
          mockBasket.x + mockBasket.velocity
        );

        // get next state
        const nextState = getEnvironmentState(
          mockBasket.x,
          mockBasket.x + mockBasket.velocity,
          mockBalls,
          inputSize
        );

        // remember
        modelRef.current?.remember(state, action, reward, nextState);

        // update epsilon
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

  return { train, trainWithoutState };
};
