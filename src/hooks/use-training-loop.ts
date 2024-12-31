import { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useAppSelector, useAppDispatch } from '../state/hooks';

import { moveLeft, moveRight } from '../state/basket-slice';
import { Ball, resetBallState } from '../state/balls-slice';

import { Network } from '../Network';

import { HORIZONTAL_SECTIONS } from '../constants';

type BallTracker = { [key in string]: boolean };

const getEnvironmentState = (
  basketPosition: number,
  balls: Ball[],
  inputSize: number
): tf.Tensor2D => {
  const state = new Array(inputSize).fill(0);

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
    // set y position
    state[positionOffset + HORIZONTAL_SECTIONS] = ball.y;

    ballIndex++;
  });

  return tf.tensor2d([state]);
};

const calculateReward = (
  balls: Ball[],
  basketX: number,
  ballsThatHitRim: BallTracker,
  ballsWentIn: BallTracker,
  ballsThatMissed: BallTracker
) => {
  let reward = 0;

  balls.forEach((ball) => {
    // reward for hitting rim
    if (ball.hitRim && ball.missed && !ballsThatHitRim[ball.id]) {
      reward += 100;
      ballsThatHitRim[ball.id] = true;
    }
    // reward for making a basket
    else if (ball.wentIn && !ballsWentIn[ball.id]) {
      reward += 1000;
      ballsWentIn[ball.id] = true;
    }
    // punish for missing
    else if (ball.missed && !ballsThatMissed[ball.id]) {
      reward -= 10;
      ballsThatMissed[ball.id] = true;
    }
    // reward for being lined up with the basket
    else if (
      ball.x === basketX &&
      !ball.missed &&
      !ball.wentIn &&
      !ball.hitRim
    ) {
      reward += 15;
    }
  });
  return reward;
};

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

  const actions = [
    () => dispatch(moveLeft()),
    () => {},
    () => dispatch(moveRight()),
  ];

  const inputSize =
    HORIZONTAL_SECTIONS + gameSettings.maxBalls * (HORIZONTAL_SECTIONS + 1);

  if (!modelRef.current) {
    modelRef.current = new Network({
      hiddenLayerSizes: [128, 128],
      inputSize,
      numActions: 3,
    });
  }

  const runEpisode = async (
    model: Network,
    eps: number,
    episode: number,
    ballsThatHitRim: BallTracker,
    ballsWentIn: BallTracker,
    ballsThatMissed: BallTracker
  ) => {
    const state = getEnvironmentState(
      basketRef.current.x,
      Object.values(ballsRef.current),
      inputSize
    );

    const action = model.chooseAction(state, eps);
    actions[action]();

    const reward = calculateReward(
      Object.values(ballsRef.current),
      basketRef.current.x,
      ballsThatHitRim,
      ballsWentIn,
      ballsThatMissed
    );
    console.log('Reward: ', reward);

    const nextState = getEnvironmentState(
      basketRef.current.x,
      Object.values(ballsRef.current),
      inputSize
    );

    model.remember(state, action, reward, nextState);

    eps = Math.max(
      gameSettings.minEpsilon,
      eps * Math.exp(-gameSettings.lambda * episode)
    );
  };

  const runTrainingLoop = async () => {
    let game = 0;

    const runNextEpisode = async () => {
      if (game >= gameSettings.numGames) {
        await modelRef.current?.saveModel();
        console.log('Training done');
        return;
      }

      let episode = 0;
      dispatch(resetBallState());
      const ballsThatHitRim: BallTracker = {};
      const ballsWentIn: BallTracker = {};
      const ballsThatMissed: BallTracker = {};

      const runNextGame = async () => {
        if (episode >= gameSettings.numEpisodes) {
          console.log('Finished Game: ', game);
          await modelRef.current?.train();
          game++;
          requestAnimationFrame(runNextEpisode);
          return;
        }

        await runEpisode(
          modelRef.current as Network,
          gameSettings.maxEpsilon,
          episode,
          ballsThatHitRim,
          ballsWentIn,
          ballsThatMissed
        );
        // await modelRef.current?.train();
        await new Promise((resolve) => setTimeout(resolve, 200));

        episode++;
        requestAnimationFrame(runNextGame); // Use requestAnimationFrame for smooth animations
      };

      requestAnimationFrame(runNextGame); // Start the first episode of the game
    };

    requestAnimationFrame(runNextEpisode); // Start the first game
  };

  return { runTrainingLoop };
};
