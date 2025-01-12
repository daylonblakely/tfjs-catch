import React, { useState } from 'react';
import { useAppDispatch } from './state/hooks';
import { addBall } from './state/balls-slice';
import Balls from './components/Balls';
import Basket from './components/Basket';

import { moveLeft, moveRight } from './state/basket-slice';
import { useTrainingLoop } from './hooks/use-training-loop';
import { usePlayLoop } from './hooks/use-play-loop';

import { BASKET_Y } from './constants';

function App() {
  const dispatch = useAppDispatch();
  const { trainWithoutState } = useTrainingLoop();
  const { play } = usePlayLoop();

  const [showBalls, setShowBalls] = useState(false);

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
      {showBalls ? (
        <>
          <Balls />
          <Basket />
        </>
      ) : null}
      <button onClick={() => dispatch(addBall())}>Add Ball</button>

      <button onClick={() => dispatch(moveLeft())}>Move Left</button>
      <button onClick={() => dispatch(moveRight())}>Move Right</button>
      <button onClick={trainWithoutState}>Train Without State</button>
      <button
        onClick={() => {
          setShowBalls(true);
          play();
        }}
      >
        Play
      </button>
    </div>
  );
}

export default App;
