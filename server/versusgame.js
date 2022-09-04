require("dotenv").config();
const { Hop, ChannelType } = require("@onehop/js");
const hop = new Hop(process.env.REACT_APP_HOP_PROJECT_ENV);

const {
  ROW_SIZE,
  COL_SIZE,
  DEFAULT_VALUE,
  getShape,
  getFutureShape,
  rotateShape,
  getRandomShape,
} = require("./components/shape");
const debounce = require("lodash.debounce");

const increaseSpeed = ({ speed }) => speed - 5 * (speed > 10);

class VersusGame {
  constructor(channelId, state) {
    this.channelId = channelId;
    this.state = state;
    this.started = false;
  }

  joinGame(name, playerId) {
    if (!this.state.playerOne) {
      this.state[playerId] = "playerOneState";
      this.state.playerOne = true;
      this.state.playerOneName = name;
      this.state.playerOneId = playerId;
      hop.channels.patchState(this.channelId, {
        [playerId]: this.state[playerId],
        playerOne: this.state.playerOne,
        playerOneName: this.state.playerOneName,
        playerOneId: this.state.playerOneId,
      });
    } else if (!this.state.playerTwo) {
      this.state[playerId] = "playerTwoState";
      this.state.playerTwo = true;
      this.state.playerTwoName = name;
      this.state.playerTwoId = playerId;
      hop.channels.patchState(this.channelId, {
        [playerId]: this.state[playerId],
        playerTwo: this.state.playerTwo,
        playerTwoName: this.state.playerTwoName,
        playerTwoId: this.state.playerTwoId,
      });
    }
  }

  async ready(playerId) {
    if (this.started) {
      return;
    }
    console.log("game ready");
    if (this.state[playerId] === "playerOneState") {
      this.state.playerOneReady = true;
    } else if (this.state[playerId] === "playerTwoState") {
      this.state.playerTwoReady = true;
    }
    await hop.channels.patchState(this.channelId, {
      playerOneReady: this.state.playerOneReady,
      playerTwoReady: this.state.playerTwoReady,
    });
    if (this.state.playerOneReady && this.state.playerTwoReady) {
      this.startGame();
    }
  }

  async startGame() {
    console.log("gameStarted");
    this.started = true;
    this.state.gameStarted = true;
    await hop.channels.patchState(this.channelId, {
      gameStarted: true,
    });
    this.state[this.state[this.state.playerOneId]].shapePos = getRandomShape();
    this.state[this.state[this.state.playerTwoId]].shapePos = getRandomShape();
    this.periodicInterval = setInterval(() => {
      this.updateBoard(this.state.playerOneId, {
        shapePos: DEFAULT_VALUE,
        futurePos: -2,
      });
      this.shiftDown(this.state.playerOneId);
      this.updateBoard(this.state.playerOneId, {
        shapePos: this.state[this.state[this.state.playerOneId]].shapePos,
        futurePos: -2,
      });
      this.updateBoard(this.state.playerTwoId, {
        shapePos: DEFAULT_VALUE,
        futurePos: -2,
      });
      this.shiftDown(this.state.playerTwoId);
      this.updateBoard(this.state.playerTwoId, {
        shapePos: this.state[this.state[this.state.playerTwoId]].shapePos,
        futurePos: -2,
      });
      this.refreshBoard(this.state.playerOneId);
    }, this.state.speed);
  }

  async endGame() {
    console.log("gameeEnded");
    this.started = false;
    this.state.gameStarted = false;
    await hop.channels.patchState(this.channelId, {
      gameStarted: false,
    });
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
      hop.channels.patchState(this.channelId, {
        [this.state[playerId]]: state,
      });
      this.futurePosition(playerId);
      return;
    }

    //Making sure we are not overlaping other shape
    let isConflict = false;

    curShape.forEach((oldArray) => {
      // Removing elemnts that are not part of block
      let newArray = oldArray.filter((val) => val !== DEFAULT_VALUE);
      // checking the edge most value after we shift
      let edgeValue = func(newArray) + deltaX;
      // checking that there is no conflict
      if (state.board[edgeValue] !== DEFAULT_VALUE) {
        isConflict = true;
      }
    });

    if (!isConflict) {
      state.xPos = state.xPos + deltaX;
      this.state[this.state[playerId]] = state;
      hop.channels.patchState(this.channelId, {
        [this.state[playerId]]: state,
      });
      this.futurePosition(playerId);
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
          elem !== DEFAULT_VALUE &&
          // remove values that don't conflict with other shape
          state.board[elem] !== DEFAULT_VALUE
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
      hop.channels.patchState(this.channelId, {
        [this.state[playerId]]: state,
      });
      this.futurePosition(playerId);
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
          .map((pos) => state.board[pos])
          // checking the squares which are not filled
          .filter((val) => val >= 0).length === ROW_SIZE;
      if (isFilled) {
        state.score += 1;
        hop.channels.patchState(this.channelId, {
          [this.state[playerId].score]: state.score,
        });
        isFilled = false;
        let board = [...state.board];
        // clearing the row
        row.forEach((pos) => (board[pos] = DEFAULT_VALUE));
        // dropiing the above row by one column
        for (let j = row[0]; j > 0; j--) {
          if (board[j] !== DEFAULT_VALUE) {
            board[j + ROW_SIZE] = board[j];
            board[j] = DEFAULT_VALUE;
          }
        }
        state.board = board;
      }
    }

    state.shapePos = getRandomShape();
    this.state.speed = increaseSpeed(this.state.speed);
    state.yPos = -3;
    state.xPos = ROW_SIZE / 2;
    state.futureYPos = -3;
    state.futureXPos = ROW_SIZE / 2;
    state.rotatePos = 0;
    this.state[this.state[playerId]] = state;
    hop.channels.patchState(this.channelId, {
      [this.state[playerId]]: state,
      speed: this.state.speed,
    });

    this.futurePosition(playerId);
  }, 100);

  shiftDown = async (playerId) => {
    let state = this.state[this.state[playerId]];
    let curShape = getShape(state);
    // Checking if bottom of the board is touched
    if (state.yPos + curShape.length >= COL_SIZE) {
      this.getNextBlock(playerId);
      return;
    }
    let flag = false;
    // checking that there is no conflict
    curShape[0].forEach(async (_, pos) => {
      let newArray = curShape.map((row) =>
        row[pos] === DEFAULT_VALUE ? -1 : row[pos] + ROW_SIZE
      );

      let bottomValue = Math.max.apply(Math, newArray);
      //console.log(bottomValue);
      if (
        // handling the shape before it touches the board
        state.board[bottomValue] !== undefined &&
        // checking if there is no collision
        state.board[bottomValue] >= 0
      ) {
        if (state.yPos <= 0 && state.yPos !== -3) {
          clearInterval(this.periodicInterval);
          this.endGame();
        } else {
          this.getNextBlock(playerId);
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
    hop.channels.patchState(this.channelId, {
      [this.state[playerId]]: state,
    });
  };

  maxDown = (playerId) => {
    let state = this.state[this.state[playerId]];
    state.yPos = state.futureYPos;
    this.state[this.state[playerId]] = state;
    hop.channels.patchState(this.channelId, {
      [this.state[playerId]]: state,
    });
  };

  futurePosition = (playerId) => {
    let state = this.state[this.state[playerId]];
    //Starts from the current block position
    state.futureXPos = state.xPos;
    state.futureYPos = state.yPos;
    let flag = true;
    let x = 0;

    while (x < COL_SIZE + 3) {
      //console.log("Loop");
      let curShape = getFutureShape(state);
      if (state.futureYPos + curShape.length >= COL_SIZE) {
        this.state[this.state[playerId]] = state;
        hop.channels.patchState(this.channelId, {
          [this.state[playerId]]: state,
        });
        return;
      }

      curShape[0].forEach((_, pos) => {
        let newArray = curShape.map((row) =>
          row[pos] === DEFAULT_VALUE ? -1 : row[pos] + ROW_SIZE
        );
        let bottomValue = Math.max.apply(Math, newArray);

        if (
          // handling the shape before it touches the board
          state.board[bottomValue] !== undefined &&
          // checking if there is no collision
          state.board[bottomValue] >= 0
        ) {
          flag = false;
          return;
        }
      });

      if (flag === false) {
        this.state[this.state[playerId]] = state;
        hop.channels.patchState(this.channelId, {
          [this.state[playerId]]: state,
        });
        return;
      }
      x++;
      state.futureYPos = state.futureYPos + 1;
    }
    this.state[this.state[playerId]] = state;
    hop.channels.patchState(this.channelId, {
      [this.state[playerId]]: state,
    });
  };

  // Updates the Board for both users, not meant to be shown
  updateBoard = (playerId, { shapePos, futurePos }) => {
    let state = this.state[this.state[playerId]];
    let board = state.board;

    let futureShape = getFutureShape(state);
    futureShape.forEach((row) =>
      row.forEach((pos) => {
        if (pos !== DEFAULT_VALUE) {
          board[pos] = futurePos;
        }
      })
    );

    let curShape = getShape(state);
    curShape.forEach((row) =>
      row.forEach((pos) => {
        if (pos !== DEFAULT_VALUE) {
          board[pos] = shapePos;
        }
      })
    );

    state.board = board;
  };

  refreshBoard = (playerId) => {
    this.state[this.state[playerId]] = state;
    hop.channels.patchState(this.channelId, {
      [this.state[playerId]]: state,
    });
  };
}

module.exports = { VersusGame };
