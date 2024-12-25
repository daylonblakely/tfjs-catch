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

  //  every 100 milliseconds check if balls hit rim, went in, or missed
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      //   check for rim hits and complete missed balls
      let rimHitIndex = 0;
      let nextRimHit;
      while (
        rimHitQueue[rimHitIndex] &&
        rimHitQueue[rimHitIndex].timeInMillis <= now
      ) {
        nextRimHit = rimHitQueue[rimHitIndex];
        // check if ball hit rim
        const hitRim = nextRimHit.x === basket.x;
        if (hitRim) {
          dispatch(setBallHitRim(nextRimHit.id));
        } else {
          dispatch(setBallMissed(nextRimHit.id));
        }

        dispatch(shiftRimHitQueue());
        rimHitIndex++;
      }

      //   check for balls that went in
      let throughRimIndex = 0;
      let nextThroughRim;
      while (
        throughRimQueue[throughRimIndex] &&
        throughRimQueue[throughRimIndex].timeInMillis <= now
      ) {
        nextThroughRim = throughRimQueue[throughRimIndex];
        // check if ball went in
        const wentIn = nextThroughRim.x === basket.x;
        if (wentIn) {
          dispatch(setBallWentIn(nextThroughRim.id));
        } else {
          dispatch(setBallMissed(nextThroughRim.id));
        }

        dispatch(shiftThroughRimQueue());
        throughRimIndex++;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [rimHitQueue, basket.x, dispatch, throughRimQueue]);

  return null;
};
