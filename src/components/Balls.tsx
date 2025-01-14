import React from 'react';
import { useAppSelector } from '../state/hooks';
import Ball from './Ball';

const Balls = () => {
  const balls = useAppSelector((state) => state.balls.balls);

  return (
    <div>
      {balls.map((ball, i) => {
        return <Ball key={ball.id} ball={ball} />;
      })}
    </div>
  );
};

export default Balls;
