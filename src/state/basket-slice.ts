import { createSlice } from '@reduxjs/toolkit';

export interface Basket {
  x: number;
  velocity: number;
}

const initialState: Basket = {
  x: 0,
  velocity: 10,
};

const MOVE_DISTANCE = 30;

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    moveLeft: (state) => {
      // prevent basket from going off screen
      if (state.x - MOVE_DISTANCE < 0) {
        return;
      }
      state.x -= MOVE_DISTANCE;
    },
    moveRight: (state) => {
      // prevent basket from going off screen
      if (state.x + MOVE_DISTANCE > window.innerWidth - 100) {
        return;
      }
      state.x += MOVE_DISTANCE;
    },
  },
});

export const { moveLeft, moveRight } = basketSlice.actions;

export default basketSlice.reducer;
