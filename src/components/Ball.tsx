import React, { useEffect, useState } from 'react';
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
  const x = useMotionValue(
    (ball.x / HORIZONTAL_SECTIONS) *
      (window.innerWidth - HORIZONTAL_SPACING * 2) +
      HORIZONTAL_SPACING -
      24
  );
  const [secondaryAnimation, setSecondaryAnimation] = useState(false);
  const [animationProps, setAnimationProps] = useState({});

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
    } else if (ball.missed) {
      setAnimationProps({
        y: window.innerHeight,
      });
      setSecondaryAnimation(true);
    }

    const unsubscribeChange = y.on('change', () => {});

    const unsubscribeComplete = y.on('animationComplete', () => {
      // dispatch(removeBallById(id));
    });

    return () => {
      unsubscribeChange();
      unsubscribeComplete();
    };
  }, [y, ball.hitRim, ball.wentIn, ball.missed]);

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
      animate={secondaryAnimation ? animationProps : { y: window.innerHeight }}
      // animate={secondaryAnimation ? animationProps : { y: BASKET_Y - 60 }}
      transition={{
        duration: MIN_BALL_SPEED * ball.fallSpeed,
        // duration:
        //   (window.innerHeight * MIN_BALL_SPEED * ball.fallSpeed) /
        //   ((9 / 10) * window.innerHeight - 60),
        // duration:
        //   secondaryAnimation && !ball.missed
        //     ? 0.5
        //     : (MIN_BALL_SPEED + 0.5) * ball.fallSpeed,
        // type: 'tween',
        ease: 'linear',
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
};

export default Ball;
