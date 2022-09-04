const ROW_SIZE = 8;
const COL_SIZE = 20;
const DEFAULT_VALUE = -1;

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

// creates empty board
const emptyBoard = () =>
  [...Array(ROW_SIZE * COL_SIZE)].map((_) => DEFAULT_VALUE);

// Returns the shapewhich represents postion in the SHAPE array
// If we get return value 1 then it reresents I
const getRandomShape = () => Math.round((SHAPE.length - 1) * Math.random());

// Returns 2D array that represents the current shape with the accurate position
const getShape = ({ shapePos, rotatePos, xPos, yPos }) =>
  SHAPE[shapePos][rotatePos].map((row, rowPos) =>
    row.map((col, colPos) =>
      col ? xPos + colPos + ROW_SIZE * (rowPos + yPos) : DEFAULT_VALUE
    )
  );

// Returns the 2D array that represents the future shape with accurate position
const getFutureShape = ({ shapePos, rotatePos, futureXPos, futureYPos }) =>
  SHAPE[shapePos][rotatePos].map((row, rowPos) =>
    row.map((col, colPos) =>
      col
        ? futureXPos + colPos + ROW_SIZE * (rowPos + futureYPos)
        : DEFAULT_VALUE
    )
  );

//  updatest the rotate pos that represents the roatation for given shape
const rotateShape = (isClockwise, { shapePos, rotatePos }) =>
  isClockwise
    ? rotatePos === 0
      ? SHAPE[shapePos].length - 1
      : rotatePos - 1
    : rotatePos === SHAPE[shapePos].length - 1
    ? 0
    : rotatePos + 1;

const InitialState = () => {
  return {
    shapePos: getRandomShape(), // pointers to show which type of shape we are using
    rotatePos: 0, // pointer to represent which rotation of shape we are using
    xPos: ROW_SIZE / 2, // postion of current shape in x direction
    yPos: -3, // postion of variable in y direction
    board: emptyBoard(),
    futureXPos: ROW_SIZE / 2,
    futureYPos: -3,
    speed: 500,
    score: 0,
  };
};

module.exports = {
  ROW_SIZE,
  COL_SIZE,
  DEFAULT_VALUE,
  InitialState,
  getShape,
  getFutureShape,
  rotateShape,
  getRandomShape,
  emptyBoard,
};
