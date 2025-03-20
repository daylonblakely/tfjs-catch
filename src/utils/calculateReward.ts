import { BASKET_Y } from '../constants';
import { Ball } from '../state/balls-slice';
import { Basket } from '../state/basket-slice';

export const calculateReward = (
  balls: Ball[],
  basket: Basket,
  action: number,
  ballFallDistance: number
) => {
  let reward = 0;

  let imminentBall: Ball = {
    id: 'init',
    x: 0,
    y: 0,
    fallSpeed: 1,
    hitRim: false,
    missed: false,
    wentIn: false,
    isActive: true,
  };

  let minTime = Infinity;

  balls.forEach((ball) => {
    if (!ball.isActive) return;

    const timeToBasket =
      (BASKET_Y - ball.y) / (ballFallDistance * ball.fallSpeed); // Time for the ball to reach the basket

    if (timeToBasket > 0 && timeToBasket < minTime) {
      minTime = timeToBasket;
      imminentBall = ball;
    }

    // penalty for missed balls
    if (ball.missed) {
      reward -= 5;
    }

    if (ball.hitRim) {
      reward += 2;
    }

    // Sparse reward:
    // Significant reward for catching
    if (ball.wentIn) {
      reward += 10;
    }
  });

  // Dense reward for moving closer to the imminent ball
  const previousPosition = basket.x - basket.velocity;
  const distanceBefore = Math.abs(imminentBall.x - previousPosition); // Previous distance
  const distanceAfter = Math.abs(imminentBall.x - basket.x); // Current distance

  if (distanceAfter < distanceBefore) {
    reward += 1; // Reward for moving closer
  } else if (distanceAfter > distanceBefore) {
    reward -= 1; // Penalty for moving away
  }

  // if moved
  // if (action !== 1) {
  //   reward -= 1;
  // }

  return reward;
};
