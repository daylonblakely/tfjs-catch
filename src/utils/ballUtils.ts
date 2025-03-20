import { Ball } from '../state/balls-slice';
import { BASKET_Y, HORIZONTAL_SECTIONS, MAX_BALLS } from '../constants';

const BALL_SPACING = 100;

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
  // random number between .4 and 1
  const fallSpeed = Math.random() * (1 - 0.4) + 0.4;

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
  movedSincedLastRimHit: boolean,
  yDistance: number = 2,
  ballsMadeCount: number
) => {
  const lastAddedBall = balls[balls.length - 1];
  if (
    !balls.length ||
    (lastAddedBall.y > BALL_SPACING && balls.length < MAX_BALLS)
  ) {
    const nextId =
      balls.reduce(
        (max, ball) => (parseInt(ball.id) > max ? parseInt(ball.id) : max),
        0
      ) + 1;
    balls.push(createBall(nextId + ''));
  }

  const updatedBalls: Ball[] = balls.reduce((acc, ball) => {
    if (!ball.isActive && ball.y > BASKET_Y + 100) {
      return acc;
    }

    const newY = ball.y + yDistance * ball.fallSpeed;
    const newBall = { ...ball, y: newY };

    // if ball is still not below rim, but has already been tracked as make or miss
    if (!newBall.isActive) return [...acc, newBall];

    // set to inactive on next tick after make/miss
    if (ball.wentIn || ball.missed) {
      newBall.isActive = false;

      if (newBall.wentIn) {
        ballsMadeCount++;
      }
    }

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
    } else if (ballStatus === 'missed') {
      newBall.missed = true;
    }

    return [...acc, newBall];
  }, [] as Ball[]);

  return { updatedBalls, ballsMadeCount };
};
