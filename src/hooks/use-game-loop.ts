import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { updateAllBallY, addBall } from '../state/balls-slice';

export const useGameLoop = () => {
  const lastRimHitX = useAppSelector((state) => state.balls.lastRimHitX);
  const basket = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      // Update y for all balls
      dispatch(
        updateAllBallY({
          basketX: basket.x,
          movedSincedLastRimHit: basket.x !== lastRimHitX,
        })
      );

      animationFrameId.current = requestAnimationFrame(update);
    };

    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [basket.x, dispatch, lastRimHitX]);

  // Add balls to state every second
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(addBall());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};
