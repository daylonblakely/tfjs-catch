import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  Ball as BallType,
  setBallY,
  removeBallById,
  setBallScored,
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
  const [hitRim, setHitRim] = useState(false);

  useEffect(() => {
    const checkIfBallHitRim = () => {
      if (
        !hitRim &&
        ball.x === basket.x &&
        y.get() >= BASKET_Y - 60 &&
        y.get() <= BASKET_Y - 55
      ) {
        setHitRim(true);
        console.log('hit rim');
      }
    };

    const checkIfBallScored = () => {
      if (
        hitRim &&
        !ball.scored &&
        ball.x === basket.x &&
        y.get() >= BASKET_Y &&
        y.get() <= BASKET_Y + 5
      ) {
        dispatch(setBallScored(id));
        console.log('score');
      }
    };

    const unsubscribeChange = y.on('change', () => {
      dispatch(setBallY({ id, y: y.get() }));

      checkIfBallHitRim();
      checkIfBallScored();
    });

    const unsubscribeComplete = y.on('animationComplete', () => {
      dispatch(removeBallById(id));
    });

    return () => {
      unsubscribeChange();
      unsubscribeComplete();
    };
  }, [dispatch, y, id, hitRim, ball.x, basket.x, ball.scored]);

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
