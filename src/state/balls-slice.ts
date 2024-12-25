import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MAX_BALLS, HORIZONTAL_SECTIONS, MIN_BALL_SPEED } from '../constants';

export interface Ball {
  id: string;
  x: number;
  y: number;
  // duration: number;
  fallSpeed: number;
  rimHeightAt: number;
  throughRimAt: number;
  hitRim: boolean;
  missed: boolean;
  wentIn: boolean;
  isActive: boolean;
}

export interface BallPositionAtTime {
  id: string;
  timeInMillis: number;
  x: number;
}

const initialState: {
  count: number;
  balls: {
    [key: string]: Ball;
  };
  rimHitQueue: BallPositionAtTime[];
  throughRimQueue: BallPositionAtTime[];
} = {
  count: 0,
  balls: {},
  rimHitQueue: [],
  throughRimQueue: [],
};

const ballsSlice = createSlice({
  name: 'balls',
  initialState,
  reducers: {
    addBall: (state) => {
      // limit number of active balls not done
      // if (Object.keys(state.balls).length >= MAX_BALLS) {
      //   return;
      // }
      const countActiveBalls = Object.values(state.balls).filter(
        (ball) => ball.isActive
      ).length;
      if (countActiveBalls >= MAX_BALLS) {
        return;
      }

      const id = state.count.toString();
      const x = Math.floor(Math.random() * (HORIZONTAL_SECTIONS - 1));
      const fallSpeed = Math.random() * 0.5 + 0.5;
      // ball at rim height at now time plus duration in seconds
      const rimHeightAt = Date.now() + MIN_BALL_SPEED * fallSpeed * 1000;
      const throughRimAt = rimHeightAt + 500;

      state.balls[state.count] = {
        id,
        x,
        y: 0,
        // duration: Math.floor(Math.random() * 10) + 5,
        // random number between .5 and 1
        fallSpeed,
        // ball at rim height at now time plus duration in seconds
        rimHeightAt,
        throughRimAt,
        hitRim: false,
        missed: false,
        wentIn: false,
        isActive: true,
      };

      state.rimHitQueue.push({ id, timeInMillis: rimHeightAt, x });
      state.rimHitQueue.sort((a, b) => a.timeInMillis - b.timeInMillis);

      state.throughRimQueue.push({ id, timeInMillis: throughRimAt, x });
      state.throughRimQueue.sort((a, b) => a.timeInMillis - b.timeInMillis);

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
      console.log('hit rim');
      state.balls[action.payload].hitRim = true;
    },
    setBallWentIn: (state, action: PayloadAction<string>) => {
      // if ball hit rim, it can't go in
      if (state.balls[action.payload].hitRim) {
        console.log('make');
        state.balls[action.payload].wentIn = true;
      } else {
        console.log('miss');
        state.balls[action.payload].missed = true;
      }

      state.balls[action.payload].isActive = false;
    },
    setBallMissed: (state, action: PayloadAction<string>) => {
      console.log('miss');
      state.balls[action.payload].missed = true;
      state.balls[action.payload].isActive = false;
    },
    shiftRimHitQueue: (state) => {
      state.rimHitQueue.shift();
    },
    shiftThroughRimQueue: (state) => {
      state.throughRimQueue.shift();
    },
    resetBallState: (state) => {
      // state = { ...initialState };
      state.balls = {};
      state.count = 0;
      state.rimHitQueue = [];
      state.throughRimQueue = [];
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
  shiftRimHitQueue,
  shiftThroughRimQueue,
  resetBallState,
} = ballsSlice.actions;

export default ballsSlice.reducer;
