import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import {
  Ball,
  setBallHitRim,
  setBallMissed,
  setBallWentIn,
  shiftRimHitQueue,
  shiftThroughRimQueue,
} from '../state/balls-slice';

// watch for balls that hit rim
// watch for balls that went in
// watch for balls that missed
export const useScoreTracker = () => {
  const balls = useAppSelector((state) => state.balls.balls);
  const basket = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  //  every X milliseconds check if balls hit rim, went in, or missed
  let lastRimHitX = useRef(-1);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      const checkIfBallHitRim = (ball: Ball) => {
        if (ball.hitRim || ball.missed) return;

        const rimHeight = ball.rimHeightAt <= now;

        if (!rimHeight) return;

        if (ball.x === basket.x) {
          lastRimHitX.current = ball.x;
          dispatch(setBallHitRim(ball.id));
        }
      };

      const checkIfBallWentIn = (ball: Ball) => {
        if (ball.wentIn || ball.missed) return;

        const throughRim = ball.throughRimAt <= now;

        if (!throughRim) return;

        if (
          !!ball.hitRim &&
          ball.x === basket.x &&
          ball.x === lastRimHitX.current
        ) {
          dispatch(setBallWentIn(ball.id));
        } else {
          dispatch(setBallMissed(ball.id));
        }
      };

      for (const ballId in balls) {
        const ball = balls[ballId];
        if (!ball.isActive) continue;

        checkIfBallHitRim(ball);
        checkIfBallWentIn(ball);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [balls, basket.x, dispatch]);

  return null;
};
