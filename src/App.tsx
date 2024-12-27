import React from 'react';
import { useAppSelector, useAppDispatch } from './state/hooks';
import { addBall } from './state/balls-slice';
import Ball from './components/Ball';
import Basket from './components/Basket';

import { moveLeft, moveRight } from './state/basket-slice';
import { useGameLoop } from './hooks/use-game-loop';
import { useGame } from './hooks/use-game';

import { BASKET_Y } from './constants';

const NUM_GAMES = 100;

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
  const { runGames } = useGame();

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

      <button onClick={() => runGames(NUM_GAMES)}> Play </button>
    </div>
  );
}

export default App;
