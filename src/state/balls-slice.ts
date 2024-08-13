import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MAX_BALLS, HORIZONTAL_SECTIONS } from '../constants';

export interface Ball {
  id: string;
  x: number;
  y: number;
  duration: number;
  hitRim: boolean;
  missed: boolean;
  wentIn: boolean;
}

const initialState: {
  count: number;
  balls: {
    [key: string]: Ball;
  };
} = {
  count: 0,
  balls: {},
};

const ballsSlice = createSlice({
  name: 'balls',
  initialState,
  reducers: {
    addBall: (state) => {
      // limit number of balls not done
      if (Object.keys(state.balls).length >= MAX_BALLS) {
        return;
      }

      state.balls[state.count] = {
        id: state.count.toString(),
        x: Math.floor(Math.random() * (HORIZONTAL_SECTIONS - 1)),
        y: 0,
        duration: Math.floor(Math.random() * 10) + 5,
        hitRim: false,
        missed: false,
        wentIn: false,
      };

      state.count++;
    },
    setBallY: (state, action: PayloadAction<{ id: string; y: number }>) => {
      if (!state.balls[action.payload.id]) return;

      state.balls[action.payload.id].y = action.payload.y;
    },
    removeBallById: (state, action: PayloadAction<string>) => {
      delete state.balls[action.payload];
    },
    setBallHitRim: (state, action: PayloadAction<string>) => {
      state.balls[action.payload].hitRim = true;
    },
    setBallWentIn: (state, action: PayloadAction<string>) => {
      state.balls[action.payload].wentIn = true;
    },
    setBallMissed: (state, action: PayloadAction<string>) => {
      state.balls[action.payload].missed = true;
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
} = ballsSlice.actions;

export default ballsSlice.reducer;
