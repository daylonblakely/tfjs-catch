import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  maxBalls: 10,
  minBallSpeed: 5,
  minEpsilon: 0.01,
  epsilonStart: 1,
  epsilonDecay: 0.997,
  batchSize: 64,
  discountRate: 0.95,
  learningRate: 0.001,
  memoryLength: 10000,
  numEpisodes: 3000,
  stepsPerEpisode: 500,
  hiddenLayerSizes: [128, 128, 128],
  isTraining: false,
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
    setBatchSize: (state, action: PayloadAction<number>) => {
      state.batchSize = action.payload;
    },
    setNumEpisodes: (state, action: PayloadAction<number>) => {
      state.numEpisodes = action.payload;
    },
    setStepsPerEpisode: (state, action: PayloadAction<number>) => {
      state.stepsPerEpisode = action.payload;
    },
    setLearningRate: (state, action: PayloadAction<number>) => {
      state.learningRate = action.payload;
    },
    setDiscountRate: (state, action: PayloadAction<number>) => {
      state.discountRate = action.payload;
    },
    setIsTraining: (state, action: PayloadAction<boolean>) => {
      state.isTraining = action.payload;
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
  setBatchSize,
  setNumEpisodes,
  setStepsPerEpisode,
  setLearningRate,
  setDiscountRate,
  setGameSettings,
  setIsTraining,
} = gameSettingsSlice.actions;

export default gameSettingsSlice.reducer;
