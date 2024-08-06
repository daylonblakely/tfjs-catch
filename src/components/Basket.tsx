import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../state/hooks';
import {
  HORIZONTAL_SECTIONS,
  HORIZONTAL_SPACING,
  VERTICAL_SECTIONS,
} from '../constants';

const BASKET_WIDTH = 150;
const BASKET_OFFSET = BASKET_WIDTH / 2;

const Basket = () => {
  const { x, velocity } = useAppSelector((state) => state.basket);

  return (
    <motion.div
      style={{
        position: 'absolute',
        y: ((VERTICAL_SECTIONS - 1) / VERTICAL_SECTIONS) * window.innerHeight,
        height: 15,
        width: BASKET_WIDTH,
        backgroundColor: 'orange',
        borderRadius: '7.5px',
      }}
      animate={{
        x:
          (x / HORIZONTAL_SECTIONS) *
            (window.innerWidth - HORIZONTAL_SPACING * 2) +
          HORIZONTAL_SPACING -
          BASKET_OFFSET,
      }}
      //   animate={{ y: window.innerHeight }}
      //   transition={{ duration: 6 }}
      transition={{ type: 'spring', velocity }}
    ></motion.div>
  );
};

export default Basket;
