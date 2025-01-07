import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HORIZONTAL_SECTIONS, MAX_BALLS, BASKET_Y } from '../constants';

const BALL_SPACING = 100;

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
  lastRimHitX: number;
  lastAddedBallId: number;
} = {
  count: 0,
  numActiveBalls: 0,
  balls: {},
  lastRimHitX: -1,
  lastAddedBallId: 0,
};

const checkIfBallHitRim = (ball: Ball, basketX: number): boolean => {
  if (ball.hitRim) return true;
  if (ball.missed) return false;

  const rimHeight = ball.y >= BASKET_Y - 60 && ball.y <= BASKET_Y;

  if (rimHeight && ball.x === basketX) {
    return true;
  } else {
    return false;
  }
};

const checkIfBallWentIn = (
  ball: Ball,
  basketX: number,
  movedSinceLastRimHit: boolean
): string => {
  const throughRim = ball.y >= BASKET_Y;

  if (!throughRim) return 'falling';

  if (ball.hitRim && ball.x === basketX && !movedSinceLastRimHit) {
    return 'wentIn';
  } else {
    return 'missed';
  }
};

const createBall = (id: string): Ball => {
  const x = Math.floor(Math.random() * (HORIZONTAL_SECTIONS - 1));
  const fallSpeed = Math.random() * 0.5 + 0.5;

  return {
    id,
    x,
    y: -100,
    fallSpeed,
    hitRim: false,
    missed: false,
    wentIn: false,
    isActive: true,
  };
};

const ballsSlice = createSlice({
  name: 'balls',
  initialState,
  reducers: {
    addBall: (state) => {
      // check if max balls reached
      if (state.numActiveBalls >= MAX_BALLS) return;

      const id = state.count.toString();

      state.balls[id] = createBall(id);

      state.count++;
      state.numActiveBalls++;
    },
    resetBallState: (state) => {
      state.balls = {};
      state.count = 0;
      state.numActiveBalls = 0;
      state.lastRimHitX = -1;
    },
    updateAllBallY: (
      state,
      action: PayloadAction<{
        basketX: number;
        movedSincedLastRimHit: boolean;
        plusY: number;
      }>
    ) => {
      // add new ball if there is space
      if (
        state.numActiveBalls === 0 ||
        (state.numActiveBalls < MAX_BALLS &&
          (state.balls[state.lastAddedBallId]?.y ?? 0) > BALL_SPACING)
      ) {
        const id = state.count.toString();

        state.balls[id] = createBall(id);
        state.lastAddedBallId = state.count;

        state.count++;
        state.numActiveBalls++;
      }

      // update y position for all balls
      for (const ballId in state.balls) {
        const ball = state.balls[ballId];

        // set ball y position based on current position and fall speed
        const y = ball.y + action.payload.plusY;
        state.balls[ballId].y = y;

        // remove if ball is not active and below the screen
        if (!ball.isActive) {
          if (ball.y > BASKET_Y + 100) {
            delete state.balls[ballId];
          }
          continue;
        }

        if (!ball.hitRim && checkIfBallHitRim(ball, action.payload.basketX)) {
          state.balls[ballId].hitRim = true;
          state.lastRimHitX = ball.x;
        }

        const ballStatus = checkIfBallWentIn(
          ball,
          action.payload.basketX,
          action.payload.movedSincedLastRimHit
        );

        if (ballStatus === 'wentIn') {
          state.balls[ballId].wentIn = true;
          state.balls[ballId].isActive = false;
          state.numActiveBalls--;
        } else if (ballStatus === 'missed') {
          state.balls[ballId].missed = true;
          state.balls[ballId].isActive = false;
          state.numActiveBalls--;
        }
      }
    },
  },
});

export const { addBall, resetBallState, updateAllBallY } = ballsSlice.actions;

export default ballsSlice.reducer;
