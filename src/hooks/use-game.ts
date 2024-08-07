import { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useAppSelector, useAppDispatch } from '../state/hooks';

import { moveLeft, moveRight } from '../state/basket-slice';
import { Ball } from '../state/balls-slice';

import { Network } from '../Network';

import {
  INPUT_SIZE,
  HORIZONTAL_SECTIONS,
  VERTICAL_SECTIONS,
} from '../constants';

const MIN_EPSILON = 0.01;
const MAX_EPSILON = 0.2;
const LAMBDA = 0.01;

const NUM_EPISODES = 1000;

// reward window for the basket
const ballYRewardMin =
  ((VERTICAL_SECTIONS - 1) / VERTICAL_SECTIONS) * window.innerHeight - 40;
const ballYRewardMax = ballYRewardMin + 24;

const getEnvironmentState = (
  basketPosition: number,
  balls: Ball[]
): tf.Tensor2D => {
  const state = new Array(INPUT_SIZE).fill(0);

  //   set basket position
  state[basketPosition] = 1;

  //   set ball positions
  let ballIndex = 0;
  balls.forEach((ball) => {
    const positionOffset =
      HORIZONTAL_SECTIONS + ballIndex * (HORIZONTAL_SECTIONS + 1 + 1);

    //   set x position
    state[positionOffset + ball.x] = 1;
    //  set y position
    state[positionOffset + HORIZONTAL_SECTIONS] = ball.y;
    //  set duration
    state[positionOffset + HORIZONTAL_SECTIONS + 1] = ball.duration;

    ballIndex++;
  });

  return tf.tensor2d([state]);
};

const calculateReward = (basketPosition: number, balls: Ball[]) => {
  let reward = 0;

  balls.forEach((ball) => {
    const ballPosition = ball.x;
    if (
      ball.y >= ballYRewardMin &&
      ball.y <= ballYRewardMax &&
      ballPosition === basketPosition
    ) {
      reward += 1;
    }
  });
  return reward;
};

export const useGame = () => {
  const balls = useAppSelector((state) => state.balls.balls);
  const basket = useAppSelector((state) => state.basket);
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

  if (!modelRef.current) {
    modelRef.current = new Network({
      hiddenLayerSizes: [128, 128],
      inputSize: INPUT_SIZE,
      numActions: 3,
    });
  }

  const learnToPlay = async (eps: number = MAX_EPSILON) => {
    if (!modelRef.current) return;

    let episode = 0;

    const runEpisode = async (model: Network) => {
      if (episode >= NUM_EPISODES) {
        return;
      }

      let state = getEnvironmentState(
        basketRef.current.x,
        Object.values(ballsRef.current)
      );

      const action = model.chooseAction(state, eps);
      actions[action]();
      //   setTimeout(() => {
      const reward = calculateReward(
        basketRef.current.x,
        Object.values(ballsRef.current)
      );
      console.log('Reward: ', reward);
      const nextState = getEnvironmentState(
        basketRef.current.x,
        Object.values(ballsRef.current)
      );

      model.remember(state, action, reward, nextState);

      // await model.train();

      //   state = nextState;

      // if (reward > 0) {
      //   done = true;
      // }

      eps = Math.max(MIN_EPSILON, eps * Math.exp(-LAMBDA * episode));
      episode++;

      // Use requestAnimationFrame to ensure the UI remains responsive
      requestAnimationFrame(() => runEpisode(model));
      //   }, 1000);
    };

    // Start the first episode
    requestAnimationFrame(() => runEpisode(modelRef.current as Network));
    await modelRef.current.train();
  };

  return { learnToPlay };
};
