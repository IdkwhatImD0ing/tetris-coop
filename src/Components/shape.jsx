// Board Constants
export const ROW_SIZE = 8;
export const COL_SIZE = 16;
export const DEFAULT_VALUE = -1;

// Empty Board
export const emptyBoard = () => {
  [...Array(ROW_SIZE * COL_SIZE)].map((_) => DEFAULT_VALUE);
};

// Hardcoded Tetris Shapes

const SHAPE = [
  /* --------------- */
  [
    [
      // I
      [1, 1, 1, 1],
    ],
    [[1], [1], [1], [1]],
  ],
  [
    /* --------------- */

    [
      // T
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
  ],
  [
    /* --------------- */
    [
      // L
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
  ],
  [
    /* --------------- */
    [
      // J
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    [
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
  ],
  [
    /* --------------- */
    [
      // Z
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
  ],
  [
    /* --------------- */
    [
      // S
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  ],
  [
    /* --------------- */
    [
      // O
      [1, 1],
      [1, 1],
    ],
  ],
];

// shapePos = which shape we are using
// rotatePos = which rotation of the shape we are using
// xPos position in x direction
// yPos position in y direction
export const getShape = ({ shapePos, rotatePos, xPos, yPos }) =>
  SHAPE[shapePos][rotatePos].map((row, rowPos) =>
    row.map((col, colPos) =>
      col ? xPos + colPos + ROW_SIZE * (rowPos + yPos) : DEFAULT_VALUE
    )
  );

// Gets one random shape
export const getRandomShape = () =>
  Math.round((SHAPE.length - 1) * Math.random());

// Rotates the shape based on direction
export const rotateShape = (isClockwise, { shapePos, rotatePos }) =>
  isClockwise
    ? rotatePos === 0
      ? SHAPE[shapePos].length - 1
      : rotatePos - 1
    : rotatePos === SHAPE[shapePos].length - 1
    ? 0
    : rotatePos + 1;
