import React from 'react';
import { useAppSelector, useAppDispatch } from './state/hooks';
import { addBall } from './state/balls-slice';
import Ball from './components/Ball';

function App() {
  const balls = useAppSelector((state) => state.balls);
  const dispatch = useAppDispatch();

  return (
    <div>
      {balls.map((ball, index) => (
        <Ball key={index} ball={ball} index={index} />
      ))}
      <button
        onClick={() =>
          dispatch(
            addBall({
              x: 50 + Math.random() * (window.innerWidth - 50),
              y: 0,
              isDone: false,
            })
          )
        }
      >
        Add Ball
      </button>
      <button
        onClick={() => {
          console.log(balls);
        }}
      >
        Print Balls
      </button>
    </div>
  );
}

export default App;
