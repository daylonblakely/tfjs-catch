import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';

import { Basket } from '../state/basket-slice';
import { Ball } from '../state/balls-slice';
import { setIsTraining } from '../state/game-settings-slice';

import { Network } from '../Network';
import { getEnvironmentState } from '../utils/getEnvironmentState';
import { calculateReward } from '../utils/calculateReward';
import { updateBalls } from '../utils/ballUtils';
import { HORIZONTAL_SECTIONS } from '../constants';

const BALL_FALL_DISTANCE = 40;

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

  const inputSize = 2 + gameSettings.maxBalls * 3;

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

  const updateMockBasket = (mockBasket: Basket, action: number): Basket => {
    const previousPosition = mockBasket.x;

    if (action === 0) {
      return {
        x: Math.max(0, mockBasket.x - 1),
        velocity: previousPosition === 0 ? 0 : -1,
      };
    } else if (action === 2) {
      return {
        x: Math.min(HORIZONTAL_SECTIONS - 1, mockBasket.x + 1),
        velocity: previousPosition === HORIZONTAL_SECTIONS - 1 ? 0 : 1,
      };
    } else {
      return {
        x: mockBasket.x,
        velocity: 0,
      };
    }
  };

  const trainWithoutState = async () => {
    dispatch(setIsTraining(true));
    let eps = gameSettings.epsilonStart;
    let mockBasket: Basket = {
      x: Math.floor(HORIZONTAL_SECTIONS / 2),
      velocity: 0,
    };

    for (let i = 0; i < gameSettings.numEpisodes; i++) {
      console.log('Starting Game: ', i);
      let gameReward = 0;
      let mockBalls: Ball[] = [];

      let state = getEnvironmentState(mockBasket, mockBalls, inputSize);
      for (let j = 0; j < gameSettings.stepsPerEpisode; j++) {
        // step
        const { updatedBalls } = updateBalls(
          mockBalls,
          mockBasket.x,
          mockBasket.velocity !== 0,
          BALL_FALL_DISTANCE,
          0
        );

        mockBalls = updatedBalls;

        // choose action
        const action = modelRef.current!.chooseAction(state, eps);
        // update basket
        mockBasket = updateMockBasket(mockBasket, action);
        // get reward
        const reward = calculateReward(
          mockBalls,
          mockBasket,
          action,
          BALL_FALL_DISTANCE
        );
        gameReward += reward;

        // get next state
        const nextState = getEnvironmentState(mockBasket, mockBalls, inputSize);
        // remember
        modelRef.current?.remember(state, action, reward, nextState);
        // update state
        state = [...nextState];
      }

      // update epsilon
      eps = Math.max(gameSettings.minEpsilon, eps * gameSettings.epsilonDecay);

      console.log('total reward: ', gameReward);

      await modelRef.current?.train();
    }

    console.log('Training done');
    await modelRef.current?.saveModel();
    dispatch(setIsTraining(false));
  };

  return { trainWithoutState };
};
