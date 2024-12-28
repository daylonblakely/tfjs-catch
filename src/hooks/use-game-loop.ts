import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import {
  Ball,
  setBallHitRim,
  setBallMissed,
  setBallWentIn,
  updateAllBallY,
  addBall,
  removeBallById,
} from '../state/balls-slice';
import { BASKET_Y } from '../constants';

export const useGameLoop = () => {
  const balls = useAppSelector((state) => state.balls.balls);
  const basket = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  const lastRimHitX = useRef(-1);
  const movedSinceLastRimHit = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    movedSinceLastRimHit.current = basket.x !== lastRimHitX.current;

    const checkIfBallHitRim = (ball: Ball) => {
      if (ball.hitRim || ball.missed) return;

      const rimHeight = ball.y >= BASKET_Y - 60 && ball.y <= BASKET_Y;

      if (rimHeight && ball.x === basket.x) {
        lastRimHitX.current = ball.x;
        dispatch(setBallHitRim(ball.id));
      }
    };

    const checkIfBallWentIn = (ball: Ball) => {
      if (ball.wentIn || ball.missed) return;

      const throughRim = ball.y >= BASKET_Y;

      if (!throughRim) return;

      if (ball.hitRim && ball.x === basket.x && !movedSinceLastRimHit.current) {
        dispatch(setBallWentIn(ball.id));
      } else {
        dispatch(setBallMissed(ball.id));
      }
    };

    const removeBall = (ball: Ball) => {
      setTimeout(() => {
        dispatch(removeBallById(ball.id));
      }, 1000);
    };

    const update = () => {
      // Update y for all balls
      dispatch(updateAllBallY());

      for (const ballId in balls) {
        const ball = balls[ballId];
        if (!ball.isActive) {
          removeBall(ball);
        } else {
          checkIfBallHitRim(ball);
          checkIfBallWentIn(ball);
        }
      }

      animationFrameId.current = requestAnimationFrame(update);
    };

    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [balls, basket.x, dispatch]);

  // Add balls to state every second
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(addBall());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};
