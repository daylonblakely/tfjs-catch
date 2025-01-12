import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../state/hooks';
import {
  HORIZONTAL_SECTIONS,
  HORIZONTAL_SPACING,
  BASKET_Y,
  BASKET_HEIGHT,
} from '../constants';

const BASKET_WIDTH = 100;
const BASKET_OFFSET = BASKET_WIDTH / 2;

const Basket = () => {
  const { x, velocity } = useAppSelector((state) => state.basket);

  return (
    <div style={{ position: 'relative' }}>
      {/* Rim */}
      <motion.div
        style={{
          position: 'absolute',
          y: BASKET_Y,
          height: BASKET_HEIGHT,
          width: BASKET_WIDTH,
          backgroundColor: 'orange',
          borderRadius: '7.5px',
          x:
            (x / HORIZONTAL_SECTIONS) *
              (window.innerWidth - HORIZONTAL_SPACING * 2) +
            HORIZONTAL_SPACING -
            BASKET_OFFSET,
        }}
        transition={{ type: 'spring', velocity }}
      >
        {/* Net */}
        <div
          style={{
            position: 'absolute',
            bottom: -30, // Position the net just below the rim
            left: '50%',
            backgroundColor: 'lightGrey',
            transform: 'translateX(-50%)',
            width: BASKET_WIDTH,
            height: BASKET_HEIGHT * 2,
            backgroundImage: `repeating-linear-gradient(45deg, white 0, white 2px, transparent 2px, transparent 6px)`,
            backgroundSize: '10px 10px',
            clipPath: 'polygon(5% 0, 95% 0, 80% 100%, 20% 100%)', // Trapezoid shape,
          }}
        ></div>
      </motion.div>
    </div>
  );
};

export default Basket;
