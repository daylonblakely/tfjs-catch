import { HORIZONTAL_SECTIONS } from '../constants';
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

  // Reward for moving toward the closest ball to catch
  if (closestBall) {
    // const currentDistance = closestBall.x - basket.x;
    // // const previousBasketX = Math.min(
    // //   Math.max(0, basket.x + basket.velocity),
    // //   HORIZONTAL_SECTIONS - 1
    // // );
    // // const previousDistance = Math.abs(closestBall.x - previousBasketX);

    // if (currentDistance === 0) {
    //   reward += 50; // Reward for catching the ball
    // } else if (
    //   (currentDistance > 0 && basket.velocity > 0) ||
    //   (currentDistance < 0 && basket.velocity < 0)
    // ) {
    //   reward += 50; // Reward for moving closer to the closest ball
    // } else if (
    //   (currentDistance > 0 && basket.velocity < 0) ||
    //   (currentDistance < 0 && basket.velocity > 0)
    // ) {
    //   reward -= 50; // Negative reward for moving away from the closest ball
    // } else if (basket.velocity === 0) {
    //   reward -= 60; // Negative reward for not moving
    // }

    if (basket.x === closestBall.x) {
      reward += 100; // Reward for catching the ball
    } else if (basket.velocity === 1 && basket.x < closestBall.x) {
      reward += 50; // Reward for moving closer to the closest ball
    } else if (basket.velocity === -1 && basket.x > closestBall.x) {
      reward += 50; // Reward for moving closer to the closest ball
    } else if (basket.velocity === 1 && basket.x > closestBall.x) {
      reward -= 60; // Negative reward for moving away from the closest ball
    } else if (basket.velocity === -1 && basket.x < closestBall.x) {
      reward -= 60; // Negative reward for moving away from the closest ball
    } else if (basket.velocity === 0) {
      reward -= 100; // Negative reward for not moving
    }
  }

  return reward;
};
