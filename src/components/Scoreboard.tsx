import React from 'react';
import { useAppSelector } from '../state/hooks';

const Scoreboard = () => {
  const ballsMadeCount = useAppSelector((state) => state.balls.ballsMadeCount);

  return (
    <div style={scoreboardStyles.container}>
      <div style={scoreboardStyles.scoreboard}>
        <h2>Baskets Made: {ballsMadeCount}</h2>
      </div>
    </div>
  );
};

const scoreboardStyles = {
  container: {
    position: 'fixed' as 'fixed',
    top: '150px',
    left: '75%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
  },
  scoreboard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textAlign: 'center' as 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
};

export default Scoreboard;
