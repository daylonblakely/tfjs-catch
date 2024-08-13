import React, { useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  Ball as BallType,
  setBallY,
  removeBallById,
  setBallHitRim,
  setBallWentIn,
  setBallMissed,
} from '../state/balls-slice';
import {
  HORIZONTAL_SECTIONS,
  HORIZONTAL_SPACING,
  BASKET_Y,
} from '../constants';

const Ball = ({ id, ball }: { id: string; ball: BallType }) => {
  const basket = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();
  const y = useMotionValue(ball.y);

  useEffect(() => {
    const checkIfBallHitRim = () => {
      if (
        !ball.hitRim &&
        !ball.missed &&
        ball.x === basket.x &&
        y.get() >= BASKET_Y - 60 &&
        y.get() <= BASKET_Y - 55
      ) {
        dispatch(setBallHitRim(id));
        console.log('hit rim');
      }
    };

    const checkIfWentIn = () => {
      if (y.get() >= BASKET_Y && y.get() <= BASKET_Y + 5) {
        if (
          ball.hitRim &&
          !ball.missed &&
          !ball.wentIn &&
          ball.x === basket.x
        ) {
          dispatch(setBallWentIn(id));
          console.log('score');
        } else {
          dispatch(setBallMissed(id));
        }
      }
    };

    const unsubscribeChange = y.on('change', () => {
      dispatch(setBallY({ id, y: y.get() }));

      checkIfBallHitRim();
      checkIfWentIn();
    });

    const unsubscribeComplete = y.on('animationComplete', () => {
      dispatch(removeBallById(id));
    });

    return () => {
      unsubscribeChange();
      unsubscribeComplete();
    };
  }, [
    dispatch,
    y,
    id,
    ball.hitRim,
    ball.wentIn,
    ball.missed,
    basket.x,
    ball.x,
  ]);

  if (!ball) {
    return null;
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        x:
          (ball.x / HORIZONTAL_SECTIONS) *
            (window.innerWidth - HORIZONTAL_SPACING * 2) +
          HORIZONTAL_SPACING -
          24,
        y,
        fontSize: '48px',
      }}
      animate={{ y: window.innerHeight }}
      transition={{ duration: ball.duration }}
    >
      🏀
    </motion.div>
  );
};

export default Ball;
