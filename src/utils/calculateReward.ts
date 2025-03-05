import { BASKET_Y, HORIZONTAL_SECTIONS } from '../constants';
import { Ball } from '../state/balls-slice';
import { Basket } from '../state/basket-slice';

export const calculateReward = (
  balls: Ball[],
  basket: Basket,
  action: number
) => {
  let reward = 0;

  // // Find the closest ball to the basket
  // let closestBall: Ball = balls[0];
  // let minDistance = -Infinity;

  // balls.forEach((ball) => {
  //   // find the closest ball to the basket
  //   if (ball.isActive && ball.y > minDistance) {
  //     minDistance = ball.y;
  //     closestBall = ball;
  //   }
  // });

  // Find the most imminent ball
  // const imminentBall = balls.reduce(
  //   (closest, ball) => {
  //     if (ball.y > BASKET_Y) return closest;

  //     const timeToBasket = (BASKET_Y - ball.y) / ball.fallSpeed; // Time for the ball to reach the basket
  //     const closestTimeToBasket = (BASKET_Y - closest.y) / closest.fallSpeed;
  //     return timeToBasket < closestTimeToBasket ? ball : closest;
  //   },
  //   {
  //     id: 'init',
  //     x: 0,
  //     y: 0,
  //     fallSpeed: 1,
  //     hitRim: false,
  //     missed: false,
  //     wentIn: false,
  //     isActive: true,
  //   }
  // );

  // // if (basket.x === closestBall.x) {
  // //   reward += 200; // Reward for catching the ball
  // // }

  // // Dense reward for moving closer to the imminent ball
  // const previousPosition = basket.x - basket.velocity;
  // const distanceBefore = Math.abs(imminentBall.x - previousPosition); // Previous distance
  // const distanceAfter = Math.abs(imminentBall.x - basket.x); // Current distance

  // if (distanceAfter < distanceBefore) {
  //   reward += 1; // Reward for moving closer
  // } else if (distanceAfter > distanceBefore) {
  //   reward -= 1; // Penalty for moving away
  // }

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

  balls.forEach((ball) => {
    if (!ball.isActive) return;

    const timeToBasket = (BASKET_Y - ball.y) / ball.fallSpeed; // Time for the ball to reach the basket
    const closestTimeToBasket =
      (BASKET_Y - imminentBall.y) / imminentBall.fallSpeed;
    imminentBall = timeToBasket < closestTimeToBasket ? ball : imminentBall;

    // penalty for missed balls
    if (ball.missed) {
      reward -= 5;
    }

    if (ball.hitRim) {
      reward += 2;
    }

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
