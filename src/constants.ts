export const MAX_BALLS = 10;
export const HORIZONTAL_SECTIONS = 10;
export const VERTICAL_SECTIONS = 10;
export const HORIZONTAL_SPACING = 100;
export const NUMBER_OF_ACTIONS = 3;

/*
[
0, 0, 1, 0, // basket position
0, 1, 0, 0, // ball 1 x position
300,        // ball 1 y position
.5,         // ball 1 duration
1, 0, 0, 0, // ball 2 x position
100,        // ball 2 y position
.7,         // ball 2 duration
]
*/

export const INPUT_SIZE =
  // HORIZONTAL_SECTIONS + MAX_BALLS * (HORIZONTAL_SECTIONS + 1 + 1);
  HORIZONTAL_SECTIONS + MAX_BALLS * (HORIZONTAL_SECTIONS + 1);

export const BASKET_Y =
  ((VERTICAL_SECTIONS - 1) / VERTICAL_SECTIONS) * window.innerHeight;

export const BASKET_HEIGHT = 15;

export const MIN_BALL_SPEED = 5;
