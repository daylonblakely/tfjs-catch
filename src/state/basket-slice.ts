import { createSlice } from '@reduxjs/toolkit';
import { HORIZONTAL_SECTIONS } from '../constants';

export interface Basket {
  x: number;
  velocity: number;
}

const initialState: Basket = {
  x: Math.floor(HORIZONTAL_SECTIONS / 2),
  velocity: 0,
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    moveLeft: (state) => {
      // prevent basket from going off screen
      if (state.x === 0) {
        state.velocity = 0;
        return;
      }

      state.x -= 1;
      state.velocity = -1;
    },
    moveRight: (state) => {
      // prevent basket from going off screen
      if (state.x === HORIZONTAL_SECTIONS - 1) {
        state.velocity = 0;
        return;
      }

      state.x += 1;
      state.velocity = 1;
    },
    stay: (state) => {
      state.velocity = 0;
    },
  },
});

export const { moveLeft, moveRight, stay } = basketSlice.actions;

export default basketSlice.reducer;
