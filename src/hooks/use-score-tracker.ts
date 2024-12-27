import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import {
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
  const rimHitQueue = useAppSelector((state) => state.balls.rimHitQueue);
  const throughRimQueue = useAppSelector(
    (state) => state.balls.throughRimQueue
  );
  const basket = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  //  every X milliseconds check if balls hit rim, went in, or missed
  let lastRimHitX = useRef(-1);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      const checkRimHits = () => {
        let rimHitIndex = 0;
        while (
          rimHitQueue[rimHitIndex] &&
          rimHitQueue[rimHitIndex].timeInMillis <= now
        ) {
          const nextRimHit = rimHitQueue[rimHitIndex];
          const hitRim = nextRimHit.x === basket.x;

          if (hitRim) {
            lastRimHitX.current = nextRimHit.x;
            dispatch(setBallHitRim(nextRimHit.id));
          }

          dispatch(shiftRimHitQueue());
          rimHitIndex++;
        }
      };

      const checkThroughRim = () => {
        let throughRimIndex = 0;
        while (
          throughRimQueue[throughRimIndex] &&
          throughRimQueue[throughRimIndex].timeInMillis <= now
        ) {
          const nextThroughRim = throughRimQueue[throughRimIndex];
          const wentIn =
            nextThroughRim.x === basket.x &&
            nextThroughRim.x === lastRimHitX.current;

          if (wentIn) {
            dispatch(setBallWentIn(nextThroughRim.id));
          } else {
            dispatch(setBallMissed(nextThroughRim.id));
          }

          dispatch(shiftThroughRimQueue());
          throughRimIndex++;
        }
      };

      checkRimHits();
      checkThroughRim();
    }, 50);

    return () => clearInterval(interval);
  }, [rimHitQueue, throughRimQueue, basket.x, dispatch]);

  return null;
};
