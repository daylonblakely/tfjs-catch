import React from 'react';
import BasketballCourt from './components/BasketballCourt';
import Scoreboard from './components/Scoreboard';
import Balls from './components/Balls';
import Basket from './components/Basket';

import { useTrainingLoop } from './hooks/use-training-loop';
import { usePlayLoop } from './hooks/use-play-loop';

function App() {
  const { trainWithoutState } = useTrainingLoop();
  const { play } = usePlayLoop();

  return (
    <div>
      <BasketballCourt />
      <Scoreboard />
      <Balls />
      <Basket />
      <button onClick={trainWithoutState}>Train</button>
      <button onClick={play}>Play</button>
    </div>
  );
}

export default App;
