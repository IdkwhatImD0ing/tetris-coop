import "./Single.css";
import React, { Component, useEffect } from "react";
import { COL_SIZE, ROW_SIZE } from "../components/shape";
import * as s from "../components/shape";
import Square from "../components/square";
import debounce from "lodash.debounce";
import { Box, Stack, Typography } from "@mui/material";

const style = {
  width: "250px",
  height: "250px",
  margin: "0 auto",
  display: "grid",
  borderWidth: "10px",
  gridTemplate: `repeat(${COL_SIZE}, 1fr) / repeat(${ROW_SIZE}, 1fr)`,
};

const url =
  "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80";

const LEFT = 37; /* left arrow */
const ROTATE_UP = 90; /* z */
const RIGHT = 39; /* right arrow */
const ROTATE_DOWN = 88; /* x */
const DOWN = 40; /* down arrow */
const SPACE = 32; /* space */

const increaseSpeed = ({ speed }) => speed - 10 * (speed > 10);

class Single extends Component {
  constructor(props) {
    super(props);
    this.state = s.InitialState();
  }

  resetGame = () => this.setState(s.InitialState());

  componentDidMount() {
    this.periodicInterval = setInterval(() => {
      this.updateBoard({
        shapePos: s.DEFAULT_VALUE,
        futurePos: -2,
      });
      this.shiftDown();
      this.updateBoard({ shapePos: this.state.shapePos, futurePos: -2 });
    }, this.state.speed);
    document.onkeydown = this.keyInput;
  }

  componentWillUnmount() {
    clearInterval(this.periodicInterval);
  }

  // shift
  shiftRight = (isRight) => {
    let curShape = s.getShape(this.state);
    let { deltaX, func, isEdge } = isRight
      ? {
          deltaX: 1,
          func: (edgeVal) => Math.max.apply(null, edgeVal),
          isEdge: this.state.xPos + curShape[0].length === ROW_SIZE,
        }
      : {
          deltaX: -1,
          func: (edgeVal) => Math.min.apply(null, edgeVal),
          isEdge: this.state.xPos === 0,
        };
    // Making sure we are not going off the edge
    if (isEdge) {
      return;
    }

    if (this.state.yPos < 0) {
      this.setState({ xPos: this.state.xPos + deltaX });
      this.futurePosition();
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

    // Shifting if there is not conflict
    if (!isConflict) {
      this.setState({ xPos: this.state.xPos + deltaX });
      this.futurePosition();
    }
  };

  // rotate
  rotateClockwise = (isClockwise) => {
    let oldShape = s.getShape(this.state);
    let newState = { ...this.state };
    newState.rotatePos = s.rotateShape(isClockwise, this.state);
    let newShape = s.getShape(newState);

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
      this.setState({ rotatePos: newState.rotatePos });
      this.futurePosition();
    }
  };

  getNextBlock = debounce(() => {
    let isFilled = false;
    let curShape = s.getShape(this.state);

    for (let i = 0; i < curShape.length; i++) {
      // getting the row that the shape is touching
      let row = [...Array(ROW_SIZE)].map(
        (_, pos) => pos + ROW_SIZE * (this.state.yPos + i)
      );

      // getting the value of all the bottom elements
      isFilled =
        row
          .map((pos) => this.state.board[pos])
          // checking the squares which are not filled
          .filter((val) => val >= 0).length === ROW_SIZE;
      if (isFilled) {
        this.setState({ score: this.state.score + 1 });
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
        this.setState({ board: board });
      }
    }

    this.setState({
      shapePos: s.getRandomShape(),
      speed: increaseSpeed(this.state),
      yPos: -3,
      xPos: ROW_SIZE / 2,
      futureXPos: ROW_SIZE / 2,
      futureYPos: -3,
      rotatePos: 0,
    });
    console.log("Calling Future");
    this.futurePosition();
  }, 100);

  shiftDown = () => {
    let curShape = s.getShape(this.state);
    // Checking if bottom of the board is touched
    if (this.state.yPos + curShape.length >= COL_SIZE) {
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
        if (this.state.yPos <= 0 && this.state.yPos !== -3) {
          this.getNextBlock();
          console.log("next block");
          alert("Game Over");
          this.resetGame();
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

    this.setState({ yPos: this.state.yPos + 1 });
  };

  futurePosition = () => {
    console.log("Future Called");

    //Starts from the current block position
    this.setState({
      futureXPos: this.state.xPos,
      futureYPos: this.state.yPos,
    });
    let flag = true;
    let x = 0;

    console.log(this.state);

    while (x < COL_SIZE + 3) {
      //console.log("Loop");
      let curShape = s.getFutureShape(this.state);
      if (this.state.futureYPos + curShape.length >= COL_SIZE) {
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
        return;
      }

      this.setState({ futureYPos: this.state.futureYPos + 1 });
      x++;
    }
  };

  updateBoard = ({ shapePos, futurePos }) => {
    let board = [...this.state.board];

    let futureShape = s.getFutureShape(this.state);
    futureShape.forEach((row) =>
      row.forEach((pos) => {
        if (pos !== s.DEFAULT_VALUE) {
          board[pos] = futurePos;
        }
      })
    );

    let curShape = s.getShape(this.state);
    curShape.forEach((row) =>
      row.forEach((pos) => {
        if (pos !== s.DEFAULT_VALUE) {
          board[pos] = shapePos;
        }
      })
    );

    this.setState({ board: board });
  };

  keyInput = ({ keyCode }) => {
    // clearing the board
    this.updateBoard({ shapePos: s.DEFAULT_VALUE, futurePos: s.DEFAULT_VALUE });

    switch (keyCode) {
      case LEFT:
      case RIGHT:
        this.shiftRight(keyCode === RIGHT);
        break;
      case ROTATE_UP:
      case ROTATE_DOWN:
        this.rotateClockwise(keyCode !== ROTATE_UP);
        break;
      case DOWN:
        // this.detectCollision();
        this.shiftDown();
        break;
      case SPACE:
        this.setState({ yPos: this.state.futureYPos });
        break;
    }
    this.updateBoard({
      shapePos: this.state.shapePos,
      futurePos: -2,
    });
  };

  render() {
    const board = this.state.board.map((val, pos) => (
      <Square key={pos} name={pos} color={val} />
    ));
    return (
      <>
        <Box
          component="section"
          sx={{
            backgroundImage: `url(${url})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            justifyItems="center"
            spacing={10}
            sx={{ height: "70vh" }}
          >
            <Box
              width="25vw"
              height="50vh"
              sx={{
                marginTop: 0,
                display: "flex",
                backdropFilter: "blur(10px)",
                boxShadow: "0px 0px 10px #000000",
                backgroundColor: "rgba(255, 255, 255, 0.275)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5"> Points: {this.state.score}</Typography>
            </Box>

            <div style={style}> {board} </div>
            <Box
              width="25vw"
              height="50vh"
              sx={{
                marginTop: 0,
                display: "flex",
                backdropFilter: "blur(10px)",
                boxShadow: "0px 0px 10px #000000",
                backgroundColor: "rgba(255, 255, 255, 0.275)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack
                direction="column"
                justifyContent="space-around"
                alignItems="center"
                spacing={2}
              >
                <Typography variant="h5">Controls:</Typography>
                <Typography variant="h5">Right Arrow: Move Right</Typography>
                <Typography variant="h5">Left Arrow: Move Left</Typography>
                <Typography variant="h5">Down Arrow: Move Down</Typography>
                <Typography variant="h5">X: Rotate Clockwise</Typography>
                <Typography variant="h5">
                  Z: Rotate Counter Clockwise
                </Typography>
                <Typography variant="h5">Space: Drop Block</Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </>
    );
  }
}

export default Single;
