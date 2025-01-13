import React, { useState } from 'react';
import BasketballCourt from './components/BasketballCourt';
import Scoreboard from './components/Scoreboard';
import GameSettingsForm from './components/GameSettingsForm';
import Balls from './components/Balls';
import Basket from './components/Basket';

import { useTrainingLoop } from './hooks/use-training-loop';
import { usePlayLoop } from './hooks/use-play-loop';

function App() {
  const { trainWithoutState } = useTrainingLoop();
  const { play } = usePlayLoop();
  const [showTrainingModal, setshowTrainingModal] = useState(false);

  return (
    <div>
      <BasketballCourt />
      <Scoreboard />
      {showTrainingModal ? (
        <GameSettingsForm onClose={() => setshowTrainingModal(false)} />
      ) : null}
      <Balls />
      <Basket />
      <button onClick={() => setshowTrainingModal(true)}>
        Open Training Settings
      </button>
      <button onClick={play}>Play</button>
    </div>
  );
}

export default App;
