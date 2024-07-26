import React from 'react';
import { useAppSelector, useAppDispatch } from './state/hooks';
import { addBall } from './state/balls-slice';

function App() {
  const balls = useAppSelector((state) => state.balls.balls);
  const dispatch = useAppDispatch();

  return (
    <div>
      {balls.map((ball, index) => (
        <div
          key={index}
          style={{ position: 'absolute', left: ball[0], top: ball[1] }}
        >
          🏀
        </div>
      ))}
      <button
        onClick={() =>
          dispatch(addBall([Math.random() * 400, Math.random() * 400]))
        }
      >
        Add Ball
      </button>
    </div>
  );
}

export default App;
