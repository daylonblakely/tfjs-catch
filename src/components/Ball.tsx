import React, { useEffect } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { HORIZONTAL_SECTIONS, HORIZONTAL_SPACING } from '../constants';
import { Ball as BallType } from '../state/balls-slice';

const Ball = ({ ball }: { ball: BallType }) => {
  const x = useMotionValue(
    (ball.x / HORIZONTAL_SECTIONS) *
      (window.innerWidth - HORIZONTAL_SPACING * 2) +
      HORIZONTAL_SPACING -
      24
  );

  const controls = useAnimation();

  useEffect(() => {
    if (ball.wentIn) {
      controls.start({
        y: window.innerHeight,
        opacity: 0,
        scale: 1.5,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 100,
        },
      });
    } else if (ball.hitRim && ball.missed) {
      controls.start({
        y: window.innerHeight / 2,
        x: window.innerWidth / 2,
        opacity: 0,
        scale: 1.5,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 100,
        },
      });
    }
  }, [ball.wentIn, ball.hitRim, ball.missed, controls]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        x,
        y: ball.y,
        fontSize: '48px',
      }}
      animate={controls}
    >
      🏀
    </motion.div>
  );
};

export default Ball;
