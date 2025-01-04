import React from 'react';
import { useAppSelector, useAppDispatch } from './state/hooks';
import { addBall } from './state/balls-slice';
import Ball from './components/Ball';
import Basket from './components/Basket';

import { moveLeft, moveRight } from './state/basket-slice';
import { useGameLoop } from './hooks/use-game-loop';
import { useTrainingLoop } from './hooks/use-training-loop';
import { usePlayLoop } from './hooks/use-play-loop';

import { BASKET_Y } from './constants';

type BallListProps = {
  balls: { [key: string]: any };
};

const BallList = React.memo(({ balls }: BallListProps) => {
  return (
    <>
      {Object.keys(balls).map((id) => (
        <Ball key={id} id={id} />
      ))}
    </>
  );
});

function App() {
  const balls = useAppSelector((state) => state.balls.balls);
  const dispatch = useAppDispatch();
  useGameLoop();
  const { train } = useTrainingLoop();
  const { play } = usePlayLoop();

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          background: 'red',
          // top: ((10 - 1) / 10) * window.innerHeight,
          transform: `translateY(${BASKET_Y}px)`,

          height: 1,
          width: window.innerWidth,
        }}
      ></div>
      <BallList balls={balls} />
      <Basket />
      <button onClick={() => dispatch(addBall())}>Add Ball</button>
      <button onClick={() => console.log(balls)}>print</button>

      <button onClick={() => dispatch(moveLeft())}>Move Left</button>
      <button onClick={() => dispatch(moveRight())}>Move Right</button>

      <button onClick={() => train()}> Train </button>
      <button onClick={() => play()}> Play </button>
    </div>
  );
}

export default App;
