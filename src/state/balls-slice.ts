import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  balls: Ball[];
  ballsMadeCount: number;
} = {
  balls: [],
  ballsMadeCount: 0,
};

const ballsSlice = createSlice({
  name: 'balls',
  initialState,
  reducers: {
    resetBallState: (state) => {
      state.balls = [];
      state.ballsMadeCount = 0;
    },
    updateAllBalls: (state, action: PayloadAction<Ball[]>) => {
      state.balls = action.payload;
    },
  },
});

export const { resetBallState, updateAllBalls } = ballsSlice.actions;

export default ballsSlice.reducer;
