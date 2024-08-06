export const MAX_BALLS = 10;
export const HORIZONTAL_SECTIONS = 10;
export const VERTICAL_SECTIONS = 10;
export const HORIZONTAL_SPACING = 100;
export const NUMBER_OF_ACTIONS = 3;

/*
[
0, 0, 1, 0, // basket position
0, 1, 0, 0, // ball 1 x position
0, 1, 0, 0, // ball 1 y position
.5,         // ball 1 duration
1, 0, 0, 0, // ball 2 x position
0, 0, 1, 0, // ball 2 y position
.7,         // ball 2 duration
]
*/

export const INPUT_SIZE =
  HORIZONTAL_SECTIONS +
  MAX_BALLS * (HORIZONTAL_SECTIONS + VERTICAL_SECTIONS + 1);
