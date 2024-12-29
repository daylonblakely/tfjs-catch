import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HORIZONTAL_SECTIONS, MAX_BALLS } from '../constants';

export interface Ball {
  id: string;
  x: number;
  y: number;
  fallSpeed: number;
  hitRim: boolean;
  missed: boolean;
  wentIn: boolean;
  isActive: boolean;
}

const initialState: {
  count: number;
  numActiveBalls: number;
  balls: {
    [key: string]: Ball;
  };
} = {
  count: 0,
  numActiveBalls: 0,
  balls: {},
};

const ballsSlice = createSlice({
  name: 'balls',
  initialState,
  reducers: {
    addBall: (state) => {
      // check if max balls reached
      if (state.numActiveBalls >= MAX_BALLS) return;

      const id = state.count.toString();
      const x = Math.floor(Math.random() * (HORIZONTAL_SECTIONS - 1));
      const fallSpeed = Math.random() * 0.5 + 0.5;

      state.balls[id] = {
        id,
        x,
        y: -100,
        fallSpeed,
        hitRim: false,
        missed: false,
        wentIn: false,
        isActive: true,
      };

      state.count++;
      state.numActiveBalls++;
    },
    setBallY: (state, action: PayloadAction<{ id: string; y: number }>) => {
      if (!state.balls[action.payload.id]) return;

      state.balls[action.payload.id].y = action.payload.y;
    },
    removeBallById: (state, action: PayloadAction<string>) => {
      delete state.balls[action.payload];
    },
    setBallHitRim: (state, action: PayloadAction<string>) => {
      console.log('hit rim');
      state.balls[action.payload].hitRim = true;
    },
    setBallWentIn: (state, action: PayloadAction<string>) => {
      console.log('make');
      state.balls[action.payload].wentIn = true;

      state.balls[action.payload].isActive = false;
      state.numActiveBalls--;
    },
    setBallMissed: (state, action: PayloadAction<string>) => {
      console.log('miss');
      state.balls[action.payload].missed = true;
      state.balls[action.payload].isActive = false;
      state.numActiveBalls--;
    },
    resetBallState: (state) => {
      // state = { ...initialState };
      state.balls = {};
      state.count = 0;
      state.numActiveBalls = 0;
    },
    updateAllBallY: (state) => {
      for (const ballId in state.balls) {
        const ball = state.balls[ballId];

        // set ball y position based on current position and fall speed
        const y = ball.y + 2;
        state.balls[ballId].y = y;
      }
    },
  },
});

export const {
  addBall,
  setBallY,
  removeBallById,
  setBallHitRim,
  setBallWentIn,
  setBallMissed,
  resetBallState,
  updateAllBallY,
} = ballsSlice.actions;

export default ballsSlice.reducer;
