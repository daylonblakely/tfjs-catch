import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import {
  Ball,
  setBallHitRim,
  setBallMissed,
  setBallWentIn,
  updateAllBallY,
  addBall,
} from '../state/balls-slice';
import { BASKET_Y } from '../constants';

export const useGameLoop = () => {
  const balls = useAppSelector((state) => state.balls.balls);
  const basket = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  //  every X milliseconds check if balls hit rim, went in, or missed
  let lastRimHitX = useRef(-1);
  useEffect(() => {
    const interval = setInterval(() => {
      const checkIfBallHitRim = (ball: Ball) => {
        if (ball.hitRim || ball.missed) return;

        const rimHeight = ball.y >= BASKET_Y - 60 && ball.y <= BASKET_Y;

        if (!rimHeight) return;

        if (ball.x === basket.x) {
          lastRimHitX.current = ball.x;
          dispatch(setBallHitRim(ball.id));
        }
      };

      const checkIfBallWentIn = (ball: Ball) => {
        if (ball.wentIn || ball.missed) return;

        const throughRim = ball.y >= BASKET_Y;

        if (!throughRim) return;

        if (
          ball.hitRim &&
          ball.x === basket.x &&
          ball.x === lastRimHitX.current
        ) {
          dispatch(setBallWentIn(ball.id));
        } else {
          dispatch(setBallMissed(ball.id));
        }
      };

      //   update y for all balls
      dispatch(updateAllBallY());

      for (const ballId in balls) {
        const ball = balls[ballId];
        if (!ball.isActive) continue;

        checkIfBallHitRim(ball);
        checkIfBallWentIn(ball);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [balls, basket.x, dispatch]);

  //   add balls to state every second
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(addBall());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};
