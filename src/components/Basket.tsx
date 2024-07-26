import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../state/hooks';

const Basket = () => {
  const { x, velocity } = useAppSelector((state) => state.basket);

  return (
    <motion.div
      style={{
        position: 'absolute',
        y: window.innerHeight - 100,
        height: 15,
        width: 150,
        backgroundColor: 'orange',
        borderRadius: '7.5px',
      }}
      animate={{ x: x }}
      //   animate={{ y: window.innerHeight }}
      //   transition={{ duration: 6 }}
      transition={{ type: 'spring', velocity }}
    ></motion.div>
  );
};

export default Basket;
