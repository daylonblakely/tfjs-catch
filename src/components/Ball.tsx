import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useAppSelector } from '../state/hooks';
import {
  HORIZONTAL_SECTIONS,
  HORIZONTAL_SPACING,
  BASKET_Y,
} from '../constants';

const Ball = React.memo(({ id }: { id: string }) => {
  const ball = useAppSelector(
    (state) => state.balls.balls[id],
    (prev, next) => {
      return prev.x === next.x && prev.y === next.y;
    }
  );
  const [secondaryAnimation, setSecondaryAnimation] = useState(false);
  const [animationProps, setAnimationProps] = useState({});
  const y = useMotionValue(ball.y);
  const x = useMotionValue(
    (ball.x / HORIZONTAL_SECTIONS) *
      (window.innerWidth - HORIZONTAL_SPACING * 2) +
      HORIZONTAL_SPACING -
      24
  );

  useEffect(() => {
    if (ball.wentIn) {
      setAnimationProps({
        y: BASKET_Y,
        scale: 1.5,
        opacity: 0,
      });
      setSecondaryAnimation(true);
    } else if (ball.hitRim && ball.missed) {
      setAnimationProps({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        scale: 1.5,
        opacity: 0,
      });
      setSecondaryAnimation(true);
    }
  }, [ball.hitRim, ball.missed, ball.wentIn]);

  if (!ball) {
    return null;
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        x,
        y,
        fontSize: '48px',
      }}
      initial={{ y: ball.y }}
      animate={secondaryAnimation ? animationProps : { y: ball.y }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 100,
      }}
      onAnimationComplete={() => {
        if (secondaryAnimation) {
          // Perform any additional actions after the secondary animation completes
        }
      }}
    >
      🏀
    </motion.div>
  );
});

export default Ball;
