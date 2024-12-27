import React, { useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Ball as BallType } from '../state/balls-slice';
import {
  HORIZONTAL_SECTIONS,
  HORIZONTAL_SPACING,
  BASKET_Y,
  MIN_BALL_SPEED,
} from '../constants';

const Ball = ({ id, ball }: { id: string; ball: BallType }) => {
  const y = useMotionValue(ball.y);

  useEffect(() => {
    const unsubscribeChange = y.on('change', () => {
      // dispatch(setBallY({ id, y: y.get() }));
      // checkIfBallHitRim();
      // checkIfWentIn();
    });

    const unsubscribeComplete = y.on('animationComplete', () => {
      // dispatch(removeBallById(id));
      // checkIfBallHitRim();
    });

    return () => {
      unsubscribeChange();
      unsubscribeComplete();
    };
  }, [y]);

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
      animate={{ y: BASKET_Y - 60 }}
      transition={{ duration: MIN_BALL_SPEED * ball.fallSpeed }}
    >
      🏀
    </motion.div>
  );
};

export default Ball;
