import { Ball } from '../state/balls-slice';

export const calculateReward = (
  balls: Ball[],
  basketX: number,
  previousBasketX: number
) => {
  let reward = 0;

  // Find the closest ball to the basket
  let closestBall: Ball = balls[0];
  let minDistance = -Infinity;

  balls.forEach((ball) => {
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

    if (currentDistance === 0) {
      reward += 500; // Reward for catching the ball
    }

    if (currentDistance < previousDistance) {
      reward += 50; // Reward for moving closer to the closest ball
    } else if (currentDistance > previousDistance) {
      reward -= 100 * currentDistance; // Negative reward for moving away from the closest ball
    }
  }

  return reward;
};
