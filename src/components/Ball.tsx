import React, { useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useAppDispatch } from '../state/hooks';
import {
  Ball as BallType,
  setBallY,
  setBallIsDone,
} from '../state/balls-slice';
import {
  HORIZONTAL_SECTIONS,
  HORIZONTAL_SPACING,
  // VERTICAL_SECTIONS,
} from '../constants';

const Ball = ({ ball, index }: { ball: BallType; index: number }) => {
  const dispatch = useAppDispatch();
  const y = useMotionValue(ball.y);

  useEffect(() => {
    y.on('change', (latest) => {
      dispatch(setBallY({ index: index, y: latest }));
    });
    y.on('animationComplete', () => {
      dispatch(setBallIsDone({ index: index, isDone: true }));
    });
  }, [dispatch, y, index]);

  // useEffect(() => {
  //   if (ball.y === VERTICAL_SECTIONS - 1) {
  //     console.log('ball is in the basket');
  //   }
  // }, [ball.y]);

  if (ball.isDone) {
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
