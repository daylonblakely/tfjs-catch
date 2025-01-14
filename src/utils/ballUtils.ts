import { Ball } from '../state/balls-slice';
import { BASKET_Y, HORIZONTAL_SECTIONS, MAX_BALLS } from '../constants';

export const checkIfBallHitRim = (ball: Ball, basketX: number): boolean => {
  if (ball.hitRim) return true;
  if (ball.missed) return false;

  const rimHeight = ball.y >= BASKET_Y - 60 && ball.y <= BASKET_Y;

  if (rimHeight && ball.x === basketX) {
    return true;
  } else {
    return false;
  }
};

export const checkIfBallWentIn = (
  ball: Ball,
  basketX: number,
  movedSinceLastRimHit: boolean
): string => {
  const throughRim = ball.y >= BASKET_Y;

  if (!throughRim) return 'falling';

  if (ball.hitRim && ball.x === basketX && !movedSinceLastRimHit) {
    return 'wentIn';
  } else {
    return 'missed';
  }
};

export const createBall = (id: string): Ball => {
  const x = Math.floor(Math.random() * (HORIZONTAL_SECTIONS - 1));
  const fallSpeed = Math.ceil(Math.random() * 2);

  return {
    id,
    x,
    y: -100,
    fallSpeed,
    hitRim: false,
    missed: false,
    wentIn: false,
    isActive: true,
  };
};

export const updateBalls = (
  balls: Ball[],
  basketX: number,
  movedSincedLastRimHit: boolean
): Ball[] => {
  const lastAddedBall = balls[balls.length - 1];
  if (!balls.length || (lastAddedBall.y > 100 && balls.length < MAX_BALLS)) {
    balls.push(createBall(balls.length.toString()));
  }

  return balls.reduce((acc, ball) => {
    if (!ball.isActive && ball.y > BASKET_Y + 100) {
      return acc;
    }

    const newY = ball.y + 20;
    const newBall = { ...ball, y: newY };

    if (!ball.hitRim && checkIfBallHitRim(ball, basketX)) {
      newBall.hitRim = true;
    }

    const ballStatus = checkIfBallWentIn(
      newBall,
      basketX,
      movedSincedLastRimHit
    );

    if (ballStatus === 'wentIn') {
      newBall.wentIn = true;
      newBall.isActive = false;
    } else if (ballStatus === 'missed') {
      newBall.missed = true;
      newBall.isActive = false;
    }

    return [...acc, newBall];
  }, [] as Ball[]);
};
