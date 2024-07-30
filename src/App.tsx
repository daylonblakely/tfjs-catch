import React from 'react';
import { useAppSelector, useAppDispatch } from './state/hooks';
import { addBall } from './state/balls-slice';
import Ball from './components/Ball';
import Basket from './components/Basket';

import { moveLeft, moveRight } from './state/basket-slice';

function App() {
  const balls = useAppSelector((state) => state.balls);
  const dispatch = useAppDispatch();

  return (
    <div>
      {balls.map((ball, index) => (
        <Ball key={index} ball={ball} index={index} />
      ))}
      <Basket />
      <button onClick={() => dispatch(addBall())}>Add Ball</button>

      <button onClick={() => dispatch(moveLeft())}>Move Left</button>
      <button onClick={() => dispatch(moveRight())}>Move Right</button>
    </div>
  );
}

export default App;
