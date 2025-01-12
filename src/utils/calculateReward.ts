import { Ball } from '../state/balls-slice';
import { Basket } from '../state/basket-slice';

export const calculateReward = (balls: Ball[], basket: Basket) => {
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

  if (basket.x === closestBall.x) {
    reward += 200; // Reward for catching the ball
  }

  if (Math.abs(basket.velocity)) {
    reward -= 10;
  }

  return reward;
};
