require("dotenv").config();
const { Hop, ChannelType } = require("@onehop/js");
const hop = new Hop(process.env.REACT_APP_HOP_PROJECT_ENV);

const {
  getShape,
  getFutureShape,
  rotateShape,
  getRandomShape,
} = require("./components/shape");

const increaseSpeed = ({ speed }) => speed - 10 * (speed > 10);

class VersusGame {
  constructor(channelId) {
    this.channelId = channelId;
    this.state = getState();
    this.started = false;
  }

  async getState() {
    return await hop.channels.get(this.channelId);
  }

  joinGame(name, playerId) {
    if (!this.state.playerOne) {
      this.state[playerId] = "playerOneState";
      this.state.playerOne = true;
      this.state.playerOneName = name;
      this.state.playerOneId = playerId;
    } else if (!this.state.playerTwo) {
      this.state[playerId] = "playerTwoState";
      this.state.playerTwo = true;
      this.state.playerTwoName = name;
      this.state.playerTwoId = playerId;
    }
  }

  startGame() {
    this.started = true;
    this.state.gameStarted = true;
    this.state[this.state.playerOneId].shapePos = s.randomShape();
    this.state[this.state.playerTwoId].shapePos = s.randomShape();
    this.periodicInterval = setInterval(() => {
      this.updateBoard(playerId, {
        shapePos: s.DEFAULT_VALUE,
        futurePos: -2,
      });
      this.shiftDown();
      this.updateBoard(playerId, {
        shapePos: this.state.shapePos,
        futurePos: -2,
      });
    }, this.state.speed);
  }

  // Shifting
  shiftRight = (playerId, isRight) => {
    let state = this.state[this.state[playerId]];
    let curShape = getShape(state);
    let { deltaX, func, isEdge } = isRight
      ? {
          deltaX: 1,
          func: (edgeVal) => Math.max.apply(null, edgeVal),
          isEdge: state.xPos + curShape[0].length === ROW_SIZE,
        }
      : {
          deltaX: -1,
          func: (edgeVal) => Math.min.apply(null, edgeVal),
          isEdge: state.xPos === 0,
        };
    // Making sure we are not going off the edge
    if (isEdge) {
      return;
    }

    if (state.yPos < 0) {
      state.xPos = state.xPos + deltaX;
      this.state[this.state[playerId]] = state;
      hop.channels.setState(this.channelId, (s) => ({
        ...s,
        [this.state[playerId]]: state,
      }));
      this.futurePosition(playerId);
      return;
    }

    //Making sure we are not overlaping other shape
    let isConflict = false;

    curShape.forEach((oldArray) => {
      // Removing elemnts that are not part of block
      let newArray = oldArray.filter((val) => val !== s.DEFAULT_VALUE);
      // checking the edge most value after we shift
      let edgeValue = func(newArray) + deltaX;
      // checking that there is no conflict
      if (this.state.board[edgeValue] !== s.DEFAULT_VALUE) {
        isConflict = true;
      }
    });

    if (!isConflict) {
      state.xPos = state.xPos + deltaX;
      this.state[this.state[playerId]] = state;
      hop.channels.setState(this.channelId, (s) => ({
        ...s,
        [this.state[playerId]]: state,
      }));
      this.futurePosition();
    }
  };

  // Rotate
  rotateClockwise = (playerId, isClockwise) => {
    let state = this.state[this.state[playerId]];
    let oldShape = getShape(state);
    let newState = { ...state };
    newState.rotatePos = rotateShape(isClockwise, state);
    let newShape = getShape(newState);

    let isConflict = false;
    newShape.forEach((newArray) => {
      // changing pos for element whieh are present in pos i.e it is not equal to default
      let conflictedArray = newArray.filter(
        (elem) =>
          // removing values that are not there in shape
          elem !== s.DEFAULT_VALUE &&
          // remove values that don't conflict with other shape
          this.state.board[elem] !== s.DEFAULT_VALUE
      );
      /*console.log(
        newArray,
        conflictedArray,
        isConflict,
        newState.xPos + newShape.length > ROW_SIZE
      );*/

      // checking for conflict and making sure it is not going off edge
      if (
        conflictedArray.length !== 0 ||
        newState.xPos + oldShape.length > ROW_SIZE
      ) {
        isConflict = true;
      }
    });

    if (!isConflict) {
      state.rotatePos = newState.rotatePos;
      this.state[this.state[playerId]] = state;
      hop.channels.setState(this.channelId, (s) => ({
        ...s,
        [this.state[playerId]]: state,
      }));
      this.futurePosition();
    }
  };

  getNextBlock = debounce((playerId) => {
    let state = this.state[this.state[playerId]];
    let isFilled = false;
    let curShape = getShape(state);
    for (let i = 0; i < curShape.length; i++) {
      // getting the row that the shape is touching
      let row = [...Array(ROW_SIZE)].map(
        (_, pos) => pos + ROW_SIZE * (state.yPos + i)
      );

      // getting the value of all the bottom elements
      isFilled =
        row
          .map((pos) => this.state.board[pos])
          // checking the squares which are not filled
          .filter((val) => val >= 0).length === ROW_SIZE;
      if (isFilled) {
        this.state.score += 1;
        isFilled = false;
        let board = [...this.state.board];
        // clearing the row
        row.forEach((pos) => (board[pos] = s.DEFAULT_VALUE));
        // dropiing the above row by one column
        for (let j = row[0]; j > 0; j--) {
          if (board[j] !== s.DEFAULT_VALUE) {
            board[j + ROW_SIZE] = board[j];
            board[j] = s.DEFAULT_VALUE;
          }
        }
        this.state.board = board;
      }
    }

    state.shapePos = getRandomShape();
    state.speed = increaseSpeed(state.speed);
    state.yPos = -3;
    state.xPos = ROW_SIZE / 2;
    state.futureYPos = -3;
    state.futureXPos = ROW_SIZE / 2;
    state.rotatePos = 0;
    this.state[this.state[playerId]] = state;
    hop.channels.setState(this.channelId, (s) => ({
      ...s,
      [this.state[playerId]]: state,
    }));

    this.futurePosition();
  }, 100);

  shiftDown = (playerId) => {
    let state = this.state[this.state[playerId]];
    let curShape = getShape(state);
    // Checking if bottom of the board is touched
    if (state.yPos + curShape.length >= COL_SIZE) {
      console.log("next block");
      this.getNextBlock();
      return;
    }
    let flag = false;
    // checking that there is no conflict
    curShape[0].forEach((_, pos) => {
      let newArray = curShape.map((row) =>
        row[pos] === s.DEFAULT_VALUE ? -1 : row[pos] + ROW_SIZE
      );

      let bottomValue = Math.max.apply(Math, newArray);
      //console.log(bottomValue);
      if (
        // handling the shape before it touches the board
        this.state.board[bottomValue] !== undefined &&
        // checking if there is no collision
        this.state.board[bottomValue] >= 0
      ) {
        if (state.yPos <= 0 && state.yPos !== -3) {
          this.getNextBlock();
          console.log("next block");
          alert("Game Over");
        } else {
          console.log("next block");
          this.getNextBlock();
        }
        flag = true;
        return;
      }
    });

    if (flag) {
      return;
    }
    state.yPos = state.yPos + 1;
    this.state[this.state[playerId]] = state;
    hop.channels.setState(this.channelId, (s) => ({
      ...s,
      [this.state[playerId]]: state,
    }));
  };

  maxDown = (playerId) => {
    state = this.state[this.state[playerId]];
    state.yPos = state.futureYPos;
    this.state[this.state[playerId]] = state;
    hop.channels.setState(this.channelId, (s) => ({
      ...s,
      [this.state[playerId]]: state,
    }));
  };

  futurePosition = (playerId) => {
    let state = this.state[this.state[playerId]];
    //Starts from the current block position
    state.futureXPos = state.xPos;
    state.futureYPos = state.yPos;

    let flag = true;
    let x = 0;

    console.log(this.state);

    while (x < COL_SIZE + 3) {
      //console.log("Loop");
      let curShape = getFutureShape(state);
      if (state.futureYPos + curShape.length >= COL_SIZE) {
        this.state[this.state[playerId]] = state;
        hop.channels.setState(this.channelId, (s) => ({
          ...s,
          [this.state[playerId]]: state,
        }));
        return;
      }

      curShape[0].forEach((_, pos) => {
        let newArray = curShape.map((row) =>
          row[pos] === s.DEFAULT_VALUE ? -1 : row[pos] + ROW_SIZE
        );
        let bottomValue = Math.max.apply(Math, newArray);

        if (
          // handling the shape before it touches the board
          this.state.board[bottomValue] !== undefined &&
          // checking if there is no collision
          this.state.board[bottomValue] >= 0
        ) {
          flag = false;
          return;
        }
      });

      if (flag === false) {
        this.state[this.state[playerId]] = state;
        hop.channels.setState(this.channelId, (s) => ({
          ...s,
          [this.state[playerId]]: state,
        }));
        return;
      }
      x++;
      state.futureYPos = state.futureYPos + 1;
    }
    this.state[this.state[playerId]] = state;
    hop.channels.setState(this.channelId, (s) => ({
      ...s,
      [this.state[playerId]]: state,
    }));
  };

  // Updates the Board for both users, not meant to be shown
  updateBoard = (playerId, { shapePos, futurePos }) => {
    let state = this.state[this.state[playerId]];
    let board = [...state.board];

    let futureShape = getFutureShape(state);
    futureShape.forEach((row) =>
      row.forEach((pos) => {
        if (pos !== s.DEFAULT_VALUE) {
          board[pos] = futurePos;
        }
      })
    );

    let curShape = getShape(state);
    curShape.forEach((row) =>
      row.forEach((pos) => {
        if (pos !== s.DEFAULT_VALUE) {
          board[pos] = shapePos;
        }
      })
    );

    state.board = board;
    this.state[this.state[playerId]] = state;
    hop.channels.setState(this.channelId, (s) => ({
      ...s,
      [this.state[playerId]]: state,
    }));
  };

  keyInput = (playerId, { keyCode }) => {
    // clearing the board
    this.updateBoard(playerId, {
      shapePos: s.DEFAULT_VALUE,
      futurePos: s.DEFAULT_VALUE,
    });

    switch (keyCode) {
      case LEFT:
      case RIGHT:
        this.shiftRight(playerId, keyCode === RIGHT);
        break;
      case ROTATE_UP:
      case ROTATE_DOWN:
        this.rotateClockwise(playerId, keyCode === ROTATE_UP);
        break;
      case DOWN:
        // this.detectCollision();
        this.shiftDown();
        break;
      case SPACE:
        state = this.state[this.state[playerId]];
        state.yPos = state.futureYPos;
        this.state[this.state[playerId]] = state;
        break;
    }
    this.updateBoard(playerId, {
      shapePos: this.state.shapePos,
      futurePos: -2,
    });
  };
}

module.exports = { VersusGame };
