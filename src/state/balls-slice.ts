import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MAX_BALLS, HORIZONTAL_SECTIONS } from '../constants';

export interface Ball {
  x: number;
  y: number;
  isDone: boolean;
}

const initialState: Ball[] = [];

const ballsSlice = createSlice({
  name: 'balls',
  initialState,
  reducers: {
    addBall: (state) => {
      // limit number of balls not done
      if (state.filter((ball) => !ball.isDone).length >= MAX_BALLS) {
        return;
      }

      state.push({
        x: Math.floor(Math.random() * (HORIZONTAL_SECTIONS - 1)),
        y: 0,
        isDone: false,
      });
    },
    setBallY: (state, action: PayloadAction<{ index: number; y: number }>) => {
      state[action.payload.index].y = action.payload.y;
    },
    setBallIsDone: (
      state,
      action: PayloadAction<{ index: number; isDone: boolean }>
    ) => {
      state[action.payload.index].isDone = action.payload.isDone;
    },
  },
});

export const { addBall, setBallY, setBallIsDone } = ballsSlice.actions;

export default ballsSlice.reducer;
