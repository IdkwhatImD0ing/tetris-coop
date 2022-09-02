import logo from "./logo.svg";
import "./App.css";
import React, { Component } from "react";
import Square from "./Components/square";
import {
  COL_SIZE,
  ROW_SIZE,
  emptyBoard,
  getRandomShape,
} from ".Components/shape";

const style = {
  width: "250px",
  height: "250px",
  margin: "0 auto",
  display: "grid",
  borderWidth: "10px",
  gridTemplate: `repeat(${COL_SIZE}, 1fr) / repeat(${ROW_SIZE}, 1fr)`,
};

const LEFT = 37; /* left arrow */
const ROTATE_UP = 90; /* z */
const RIGHT = 39; /* right arrow */
const ROTATE_DOWN = 88; /* x */
const SPACE = 32; /* space */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shape: getRandomShape(), // Random Shape
      rotatePos: 0, // Rotation Position
      xPos: ROW_SIZE / 2, //Middle of row of board
      yPos: -3, // Start from top of board
      board: emptyBoard(), //Empty Board
    };
  }

  componentDidMount() {
    document.onkeydown = this.keyInput;
  }

  render() {
    const board = this.state.board.map((val, pos) => (
      <Square key={pos} name={pos} color={val} />
    ));
    return (
      <div className="App">
        <h1> Tetris </h1>
        <div style={style}> {board} </div>
      </div>
    );
  }
}

export default App;
