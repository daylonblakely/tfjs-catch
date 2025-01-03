import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  maxBalls: 10,
  minBallSpeed: 5,
  minEpsilon: 0.01,
  maxEpsilon: 0.9,
  lambda: 0.001,
  numGames: 200,
  numEpisodes: 1000,
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
    setMaxEpsilon: (state, action: PayloadAction<number>) => {
      state.maxEpsilon = action.payload;
    },
    setLambda: (state, action: PayloadAction<number>) => {
      state.lambda = action.payload;
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
  setMaxEpsilon,
  setLambda,
  setNumEpisodes,
  setGameSettings,
} = gameSettingsSlice.actions;

export default gameSettingsSlice.reducer;
