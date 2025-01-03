import { Ball } from '../state/balls-slice';

export type BallTracker = { [key in string]: boolean };

export const calculateReward = (
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
