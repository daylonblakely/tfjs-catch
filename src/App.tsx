import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './state/hooks';
import { addBall } from './state/balls-slice';
import Ball from './components/Ball';
import Basket from './components/Basket';

import { moveLeft, moveRight } from './state/basket-slice';
import { useGame } from './hooks/use-game';

function App() {
  const balls = useAppSelector((state) => state.balls.balls);
  const dispatch = useAppDispatch();

  const { learnToPlay } = useGame();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(addBall());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          background: 'red',
          // top: ((10 - 1) / 10) * window.innerHeight,
          transform: `translateY(${((10 - 1) / 10) * window.innerHeight}px)`,

          height: 1,
          width: window.innerWidth,
        }}
      ></div>
      {Object.keys(balls).map((id) => (
        <Ball key={id} ball={balls[id]} id={id} />
      ))}
      <Basket />
      <button onClick={() => dispatch(addBall())}>Add Ball</button>
      <button onClick={() => console.log(balls)}>print</button>

      <button onClick={() => dispatch(moveLeft())}>Move Left</button>
      <button onClick={() => dispatch(moveRight())}>Move Right</button>

      <button onClick={() => learnToPlay()}> Play </button>
    </div>
  );
}

export default App;
