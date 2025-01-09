import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  maxBalls: 10,
  minBallSpeed: 5,
  minEpsilon: 0.01,
  epsilonStart: 1,
  epsilonDecay: 0.995,
  batchSize: 128,
  discountRate: 0.99,
  learningRate: 0.0005,
  memoryLength: 10000,
  numGames: 1000,
  numEpisodes: 1000,
  hiddenLayerSizes: [128, 128, 128],
};

const gameSettingsSlice = createSlice({
  name: 'gameSettings',
  initialState,
  reducers: {
    setMaxBalls: (state, action: PayloadAction<number>) => {
      state.maxBalls = action.payload;
    },
    setMinBallSpeed: (state, action: PayloadAction<number>) => {
      state.minBallSpeed = action.payload;
    },
    setMinEpsilon: (state, action: PayloadAction<number>) => {
      state.minEpsilon = action.payload;
    },
    setNumEpisodes: (state, action: PayloadAction<number>) => {
      state.numEpisodes = action.payload;
    },
    setGameSettings: (state, action: PayloadAction<typeof initialState>) => {
      state = action.payload;
    },
  },
});

export const {
  setMaxBalls,
  setMinBallSpeed,
  setMinEpsilon,
  setNumEpisodes,
  setGameSettings,
} = gameSettingsSlice.actions;

export default gameSettingsSlice.reducer;
