import React from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { HORIZONTAL_SECTIONS, HORIZONTAL_SPACING } from '../constants';
import { Ball as BallType } from '../state/balls-slice';

const Ball = ({ ball }: { ball: BallType }) => {
  const x = useMotionValue(
    (ball.x / HORIZONTAL_SECTIONS) *
      (window.innerWidth - HORIZONTAL_SPACING * 2) +
      HORIZONTAL_SPACING -
      24
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        x,
        y: ball.y,
        fontSize: '48px',
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 100,
      }}
    >
      🏀
    </motion.div>
  );
};

export default Ball;
