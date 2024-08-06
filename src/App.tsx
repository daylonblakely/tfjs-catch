import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './state/hooks';
import { addBall } from './state/balls-slice';
import Ball from './components/Ball';
import Basket from './components/Basket';

import { moveLeft, moveRight } from './state/basket-slice';
import { useEnvironmentState } from './hooks/use-environment-state';

function App() {
  const balls = useAppSelector((state) => state.balls);
  const dispatch = useAppDispatch();

  const { getEnvironmentState } = useEnvironmentState();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(addBall());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div>
      {balls.map((ball, index) => (
        <Ball key={index} ball={ball} index={index} />
      ))}
      <Basket />
      <button onClick={() => dispatch(addBall())}>Add Ball</button>
      <button onClick={() => console.log(getEnvironmentState())}>print</button>

      <button onClick={() => dispatch(moveLeft())}>Move Left</button>
      <button onClick={() => dispatch(moveRight())}>Move Right</button>
    </div>
  );
}

export default App;
