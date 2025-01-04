import { Ball } from '../state/balls-slice';

export type BallTracker = { [key in string]: boolean };

export const calculateReward = (
  balls: Ball[],
  basketX: number,
  ballsThatHitRim: BallTracker,
  ballsWentIn: BallTracker,
  ballsThatMissed: BallTracker,
  previousBasketX: number
) => {
  let reward = 0;

  // Find the closest ball to the basket
  let closestBall: Ball = balls[0];
  let minDistance = -Infinity;

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
      reward -= 100;
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

    // find the closest ball to the basket
    if (ball.isActive && ball.y > minDistance) {
      minDistance = ball.y;
      closestBall = ball;
    }
  });

  // Reward for moving toward the closest ball to catch
  if (closestBall) {
    const previousDistance = Math.abs(closestBall.x - previousBasketX);
    const currentDistance = Math.abs(closestBall.x - basketX);

    if (currentDistance < previousDistance) {
      reward += 50; // Reward for moving closer to the closest ball
    } else if (currentDistance > previousDistance) {
      reward -= 50; // Negative reward for moving away from the closest ball
    }
    // else {
    //   reward -= 5; // Negative reward for unnecessary moves
    // }
  }

  return reward;
};
