import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { updateAllBallY } from '../state/balls-slice';

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
          plusY: 2,
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

  return null;
};
