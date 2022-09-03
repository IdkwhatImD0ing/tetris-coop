import "./Single.css";
import React, { Component, useEffect } from "react";
import { COL_SIZE, ROW_SIZE } from "../components/shape";
import * as s from "../components/shape";
import Square from "../components/square";
import debounce from "lodash.debounce";
import * as transport from "../components/Transport";
import { Hop } from "@onehop/js";

const style = {
  width: "250px",
  height: "250px",
  margin: "0 auto",
  display: "grid",
  borderWidth: "10px",
  gridTemplate: `repeat(${COL_SIZE}, 1fr) / repeat(${ROW_SIZE}, 1fr)`,
};

const shareUrl = {
  fontSize: "12px",
};

const shareLink = {
  fontSize: "25px",
  padding: "5px",
  width: "15%",
  marginRight: "5px",
};

const copyUrl = {
  marginBottom: "5px",
};

const copyLink = {
  fontSize: "20px",
  textDecoration: "underline",
  cursor: "pointer",
};

const readyBtn = {
  fontSize: "20px",
  cursor: "pointer",
  backgroundColor: "red",
};

// const hop = new Hop('ptk_c18xOTZiZWQzNzNhNjliODkyZDJmZTdkMzg3NjA0MTY1Ml81MDI5NDkzMDA3OTI3MzIwNA'); /////////////////Change to enviroment variables if possible

// const random = (length = 8) => {
//     return Math.random().toString(16);
// };

// const gameId = Math.random().toString(16);

const LEFT = 37; /* left arrow */
const ROTATE_UP = 90; /* z */
const RIGHT = 39; /* right arrow */
const ROTATE_DOWN = 88; /* x */
const DOWN = 40; /* down arrow */
const SPACE = 32; /* space */

let linkIsValid = false;

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = s.InitialState();
  }

  componentDidMount() {
    //Hop create channel
    let emptyboard = [];
    for (let i = 0; i < 120; i++) {
      emptyboard.push(-1);
    }

    const hop = new Hop(
      "ptk_c18xOTZiZWQzNzNhNjliODkyZDJmZTdkMzg3NjA0MTY1Ml81MDI5NDkzMDA3OTI3MzIwNA"
    ); /////////////////Change to enviroment variables if possible

    const params = new URLSearchParams(window.location.search);
    const gameId = params.get("tetris");
    const player = params.get("p");

    console.log("Channel id is:");
    console.log(gameId);
    transport.createChannel(hop, gameId, emptyboard);

    const rdyBtn = document.getElementById("readyButton");
    rdyBtn.addEventListener("click", () => {
      transport
        .setReady(hop, gameId, player)
        .then(
          (rdyBtn.style.backgroundColor = "green"),
          (rdyBtn.style.color = "white")
        );
    });
    const startBtn = document.getElementById("startButton");
    startBtn.addEventListener("click", () => {
      transport
        .setReady(hop, gameId, player)
        .then(
          (startBtn.style.backgroundColor = "green"),
          (startBtn.style.color = "white")
        );
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.id !== prevProps.id) {
      //make an API call here and update the state
    }
  }

  render() {
    function copyGameLink() {
      /* Get the text field */
      var copyText = document.getElementById("myInput");

      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */

      /* Copy the text inside the text field */
      navigator.clipboard.writeText(copyText.value);

      /* Alert the copied text */
      alert("Copied the text: " + copyText.value);
    }

    async function startGame() {
      console.log("in start game button");
      let url = `http://localhost:3000/versus?tetris=${new URLSearchParams(
        window.location.search
      ).get("tetris")}&p=1`;
      setTimeout(function () {
        window.location = url;
      }, 1000);
    }

    return (
      <div className="App">
        <h1> Tetris </h1>
        <a>Waiting for other player to join</a>
        <br />
        <div style={shareUrl}>
          <div style={copyUrl}>
            {/* <span style={shareLink}>https://{new URLSearchParams(window.location.host)}{new URLSearchParams(window.location.pathname)}?mode={new URLSearchParams(window.location.search).get("mode")}&tetris={new URLSearchParams(window.location.search).get("tetris")}&p=2</span> Change to https later on */}
            <span style={shareLink}>
              http://{new URLSearchParams(window.location.host)}versus?tetris=
              {new URLSearchParams(window.location.search).get("tetris")}&p=2
            </span>{" "}
            {/* Change to https later on */}
            {/* <input type="text" style={shareLink} value="http://www.mydummyurl.com/" /> */}
            <br />
            <span style={copyLink}>Copy to Clipboard</span>{" "}
            {/* Copy doesn't work yet */}
            <button id="readyButton" style={readyBtn}>
              I am ready.
            </button>
            <button id="startButton" onClick={startGame} style={readyBtn}>
              Start the game
            </button>
          </div>
          <span id="share-text">
            Share this URL with your friends to play with them.
          </span>
        </div>
      </div>
    );
  }
}

export default Lobby;
