import React from 'react';
import { useAppSelector } from '../state/hooks';
import Ball from './Ball';

const Balls = () => {
  const balls = useAppSelector((state) => state.balls.balls);

  return (
    <div>
      {Object.keys(balls).map((id) => {
        return <Ball key={id} ball={balls[id]} />;
      })}
    </div>
  );
};

export default Balls;
