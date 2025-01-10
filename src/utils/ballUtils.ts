import { Ball } from '../state/balls-slice';
import { BASKET_Y } from '../constants';

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
