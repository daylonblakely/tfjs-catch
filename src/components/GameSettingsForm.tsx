import React from 'react';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import {
  setMaxBalls,
  setMinEpsilon,
  setBatchSize,
  setNumEpisodes,
  setStepsPerEpisode,
  setLearningRate,
  setDiscountRate,
} from '../state/game-settings-slice';
import { useTrainingLoop } from '../hooks/use-training-loop';

const GameSettingsForm = ({ onClose }: { onClose: any }) => {
  const dispatch = useAppDispatch();
  const gameSettings = useAppSelector((state) => state.gameSettings);
  const { trainWithoutState } = useTrainingLoop();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    action: any
  ) => {
    const value = parseFloat(e.target.value);
    dispatch(action(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.container}>
      <h3>Game Settings</h3>
      <div style={formStyles.field}>
        <label>Max Balls:</label>
        <input
          type="number"
          value={gameSettings.maxBalls}
          onChange={(e) => handleInputChange(e, setMaxBalls)}
          style={formStyles.input}
          disabled={gameSettings.isTraining}
        />
      </div>
      {/* <div style={formStyles.field}>
        <label>Min Ball Speed:</label>
        <input
          type="number"
          value={gameSettings.minBallSpeed}
          onChange={(e) => handleInputChange(e, setMinBallSpeed)}
          style={formStyles.input}
          disabled={gameSettings.isTraining}
        />
      </div> */}
      <div style={formStyles.field}>
        <label>Min Epsilon:</label>
        <input
          type="number"
          step="0.001"
          value={gameSettings.minEpsilon}
          onChange={(e) => handleInputChange(e, setMinEpsilon)}
          style={formStyles.input}
          disabled={gameSettings.isTraining}
        />
      </div>
      <div style={formStyles.field}>
        <label>Learning Rate:</label>
        <input
          type="number"
          step="0.001"
          value={gameSettings.learningRate}
          onChange={(e) => handleInputChange(e, setLearningRate)}
          style={formStyles.input}
          disabled={gameSettings.isTraining}
        />
      </div>
      <div style={formStyles.field}>
        <label>Discount Rate:</label>
        <input
          type="number"
          step="0.01"
          value={gameSettings.discountRate}
          onChange={(e) => handleInputChange(e, setDiscountRate)}
          style={formStyles.input}
          disabled={gameSettings.isTraining}
        />
      </div>
      <div style={formStyles.field}>
        <label>Batch Size:</label>
        <input
          type="number"
          value={gameSettings.batchSize}
          onChange={(e) => handleInputChange(e, setBatchSize)}
          style={formStyles.input}
          disabled={gameSettings.isTraining}
        />
      </div>
      <div style={formStyles.field}>
        <label>Num Episodes:</label>
        <input
          type="number"
          value={gameSettings.numEpisodes}
          onChange={(e) => handleInputChange(e, setNumEpisodes)}
          style={formStyles.input}
          disabled={gameSettings.isTraining}
        />
      </div>
      <div style={formStyles.field}>
        <label>Steps Per Episode:</label>
        <input
          type="number"
          value={gameSettings.stepsPerEpisode}
          onChange={(e) => handleInputChange(e, setStepsPerEpisode)}
          style={formStyles.input}
          disabled={gameSettings.isTraining}
        />
      </div>
      <button style={formStyles.button} onClick={trainWithoutState}>
        Train
      </button>
      <button style={formStyles.button} onClick={onClose}>
        Close
      </button>
    </form>
  );
};

const formStyles = {
  container: {
    position: 'fixed' as 'fixed',
    top: '50px',
    left: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    width: '300px',
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  field: {
    marginBottom: '15px',
  },
  input: {
    width: '20%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '5px',
    marginLeft: '5px',
  },
  button: {
    padding: '10px',
    margin: '5px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default GameSettingsForm;
