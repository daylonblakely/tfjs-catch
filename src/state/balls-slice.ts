import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BallPosition = [number, number];

interface BallState {
  balls: BallPosition[];
}

const initialState: BallState = {
  balls: [],
};

const ballsSlice = createSlice({
  name: 'balls',
  initialState,
  reducers: {
    addBall: (state, action: PayloadAction<BallPosition>) => {
      state.balls.push(action.payload);
    },
    //   increased: (state) => {
    //     state.value += 1
    //   },
    //   decreased: (state) => {
    //     state.value -= 1
    //   },
    //   increasedByAmount: (state, action: PayloadAction<number>) => {
    //     state.value += action.payload
    //   },
  },
});

export const { addBall } = ballsSlice.actions;

export default ballsSlice.reducer;
