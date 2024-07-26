import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    addBall: (state, action: PayloadAction<Ball>) => {
      state.push(action.payload);
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
