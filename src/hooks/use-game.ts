import { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useAppSelector, useAppDispatch } from '../state/hooks';

import { moveLeft, moveRight } from '../state/basket-slice';
import { Ball, addBall, resetBallState } from '../state/balls-slice';

import { Network } from '../Network';

import { INPUT_SIZE, HORIZONTAL_SECTIONS } from '../constants';

const MIN_EPSILON = 0.01;
const MAX_EPSILON = 0.2;
const LAMBDA = 0.01;

const NUM_EPISODES = 1000;

type BallTracker = { [key in string]: boolean };

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
    if (!ball.isActive) return;

    const positionOffset =
      HORIZONTAL_SECTIONS + ballIndex * (HORIZONTAL_SECTIONS + 1);

    //   set x position
    state[positionOffset + ball.x] = 1;
    // set fall speed
    state[positionOffset + HORIZONTAL_SECTIONS] = ball.fallSpeed;

    ballIndex++;
  });

  // console.log('State: ', state);
  return tf.tensor2d([state]);
};

const calculateReward = (
  balls: Ball[],
  ballsThatHitRim: BallTracker,
  ballsWentIn: BallTracker
) => {
  let reward = 0;

  balls.forEach((ball) => {
    if (ball.hitRim && ball.missed && !ballsThatHitRim[ball.id]) {
      reward += 1;
      ballsThatHitRim[ball.id] = true;
    }

    if (ball.wentIn && !ballsWentIn[ball.id]) {
      reward += 100;
      ballsWentIn[ball.id] = true;
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

  const runGames = async (numGames: number) => {
    for (let game = 0; game < numGames; game++) {
      await new Promise<void>((resolve) => {
        console.log('------- NEW GAME ---------');
        // delay one second before starting new game
        setTimeout(() => {
          dispatch(resetBallState());
        }, 1000);
        const ballsThatHitRim: BallTracker = {};
        const ballsWentIn: BallTracker = {};

        const interval = setInterval(() => {
          dispatch(addBall());
        }, 1000);

        const runEpisode = async (model: Network, eps: number) => {
          let episode = 0;

          const runSingleEpisode = async () => {
            if (episode >= NUM_EPISODES) {
              await model.train();
              clearInterval(interval);
              resolve();
              return;
            }

            let state = getEnvironmentState(
              basketRef.current.x,
              Object.values(ballsRef.current)
            );

            const action = model.chooseAction(state, eps);
            actions[action]();
            const reward = calculateReward(
              Object.values(ballsRef.current),
              ballsThatHitRim,
              ballsWentIn
            );
            console.log('Reward: ', reward);
            const nextState = getEnvironmentState(
              basketRef.current.x,
              Object.values(ballsRef.current)
            );

            model.remember(state, action, reward, nextState);

            eps = Math.max(MIN_EPSILON, eps * Math.exp(-LAMBDA * episode));
            episode++;

            requestAnimationFrame(runSingleEpisode);
          };

          requestAnimationFrame(runSingleEpisode);
        };

        runEpisode(modelRef.current as Network, MAX_EPSILON);
      });
    }

    await modelRef.current?.saveModel();
    console.log('Training done');
  };

  return { runGames };
};
