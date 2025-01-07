import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  maxBalls: 10,
  minBallSpeed: 5,
  minEpsilon: 0.01,
  epsilonDecay: 0.95,
  batchSize: 256,
  discountRate: 0.95,
  learningRate: 0.01,
  memoryLength: 1000,
  numGames: 200,
  numEpisodes: 1000,
  hiddenLayerSizes: [128, 128],
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
