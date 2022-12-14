require("dotenv").config();
const { Hop, ChannelType } = require("@onehop/js");
const express = require("express");
const cors = require("cors");
const PORT = 3001;
const app = express();
const hop = new Hop(process.env.REACT_APP_HOP_PROJECT_ENV);
const { VersusGame } = require("./versusgame");

const ROW_SIZE = 8;
const COL_SIZE = 20;
const DEFAULT_VALUE = -1;
const LEFT = "37"; /* left arrow */
const ROTATE_UP = "90"; /* z */
const RIGHT = "39"; /* right arrow */
const ROTATE_DOWN = "88"; /* x */
const DOWN = "40"; /* down arrow */
const SPACE = "32"; /* space */

const GAMES = new Map();

// creates empty board
const emptyBoard = () =>
  [...Array(ROW_SIZE * COL_SIZE)].map((_) => DEFAULT_VALUE);

const createChannelId = () => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

app.use(cors());
app.get("/api", (req, res) => {
  res.json({
    message: "Hello from Tetris Duels Backend created in ExpressJS!",
  });
});

app.get("/id", async (req, res) => {
  const { id } = await hop.channels.tokens.create();
  res.json({ message: "Successfully Generated ID!", id: id });
});

app.get("/getChannelMode", (req, res) => {
  console.log("Getting channel mode");
  const channelId = req.get("channelId");
  const game = GAMES.get(channelId);
  if (!game) {
    res.json({ message: "No game found!", mode: -1 });
  } else {
    res.json({ message: "Successfully got mode!", mode: game.state.mode });
  }
});

app.get("/leaveChannel", async (req, res) => {
  const channelId = req.get("channelId");
  if (!channelId || !GAMES.get(channelId)) {
    res.json({ message: "Channel ID not provided!" });
    return;
  }
  const stats = await hop.channels.getStats(channelId);
  if (stats.online_count === 0) {
    const room = await hop.channels.delete(channelId);
    console.log("Deleted channel");
    GAMES.delete(channelId);
    res.json({ message: "Successfully Deleted Channel" });
    return;
  }
  res.json({ message: "Did not delete channel" });
});

app.get("/createCoopChannel", async (req, res) => {
  const channelId = createChannelId();
  const channel = await hop.channels.create(
    ChannelType.UNPROTECTED,
    `${channelId}`,
    // Creation Options
    {
      // Initial Channel state object
      state: {
        mode: 0,
        playerOne: false,
        playerTwo: false,
        playerOneReady: false,
        playerTwoReady: false,
        playerOneName: "",
        playerTwoName: "",
        playerOneId: "",
        playerTwoId: "",
        gameStarted: false,
        gameEnded: false,
        board: emptyBoard(),
        speed: 500,
        score: 0,
        playerOneState: {
          shapePos: -1, // pointers to show which type of shape we are using
          rotatePos: 0, // pointer to represent which rotation of shape we are using
          xPos: ROW_SIZE / 2, // postion of current shape in x direction
          yPos: -3, // postion of variable in y direction
          futureXPos: ROW_SIZE / 2,
          futureYPos: -3,
        },
        playerTwoState: {
          shapePos: -1, // pointers to show which type of shape we are using
          rotatePos: 0, // pointer to represent which rotation of shape we are using
          xPos: ROW_SIZE / 2, // postion of current shape in x direction
          yPos: -3, // postion of variable in y direction
          futureXPos: ROW_SIZE / 2,
          futureYPos: -3,
        },
      },
    }
  );

  res.json({ message: "Successfully Generated Lobby!", channelId: channelId });
});

//Create Versus Channel
app.get("/createVersusChannel", async (req, res) => {
  const channelId = createChannelId();
  console.log("Creating Versus Channel: " + channelId);
  const state = {
    mode: 1,
    playerOne: false,
    playerTwo: false,
    playerOneName: "",
    playerTwoName: "",
    playerOneId: "",
    playerTwoId: "",
    playerOneReady: false,
    playerTwoReady: false,
    gameStarted: false,
    gameEnded: false,
    speed: 500,
    playerOneState: {
      shapePos: -1, // pointers to show which type of shape we are using
      rotatePos: 0, // pointer to represent which rotation of shape we are using
      xPos: ROW_SIZE / 2, // postion of current shape in x direction
      yPos: -3, // postion of variable in y direction
      futureXPos: ROW_SIZE / 2,
      futureYPos: -3,
      board: emptyBoard(),

      score: 0,
    },
    playerTwoState: {
      shapePos: -1, // pointers to show which type of shape we are using
      rotatePos: 0, // pointer to represent which rotation of shape we are using
      xPos: ROW_SIZE / 2, // postion of current shape in x direction
      yPos: -3, // postion of variable in y direction
      futureXPos: ROW_SIZE / 2,
      futureYPos: -3,
      board: emptyBoard(),
      score: 0,
    },
  };
  const channel = await hop.channels.create(
    ChannelType.UNPROTECTED,
    `${channelId}`,
    // Creation Options
    {
      state: state, // Initial Channel state object
    }
  );
  const g = new VersusGame(channelId, state);
  GAMES.set(channelId, g);
  res.json({ message: "Successfully Generated Lobby!", channelId: channelId });
  return;
});

app.get("/joingame", (req, res) => {
  const name = req.get("name");
  const id = req.get("id");
  const channelId = req.get("channelId");
  const game = GAMES.get(channelId);
  if (!game) {
    res.json({ message: "Game not found!", response: -1 });
    return;
  }
  if (
    game.state.gameStarted &&
    game.state.playerOneId !== name &&
    game.state.playerTwoId !== name
  ) {
    res.json({ message: "You are spectator!", response: 1 });
    return;
  }
  if (game) {
    game.joinGame(name, id);
  }
  res.json({ message: "Successfully Joined Game!", response: 1 });
});

app.get("/ready", (req, res) => {
  const id = req.get("id");
  const channelId = req.get("channelId");
  const game = GAMES.get(channelId);
  if (
    (game.state.playerOneId !== id && game.state.playerTwoId !== id) ||
    game.state.gameStarted ||
    game.state.gameEnded
  ) {
    res.json({ message: "Not allowed!!", channelId: channelId });
    return;
  }
  if (game) {
    game.ready(id);
  }
  res.json({ message: "Successfully Ready!", channelId: channelId });
});

app.get("/keypress", (req, res) => {
  const keyCode = req.get("keyCode");
  const id = req.get("id");
  const name = req.get("name");
  const channelId = req.get("channelId");
  const game = GAMES.get(channelId);
  if (
    (game.state.playerOneId !== id && game.state.playerTwoId !== id) ||
    !game.state.gameStarted ||
    game.state.gameEnded
  ) {
    res.json({ message: "Not Allowed!", channelId: channelId });
    return;
  }
  if (game) {
    game.updateBoard(id, {
      shapePos: DEFAULT_VALUE,
      futurePos: DEFAULT_VALUE,
    });
    switch (keyCode) {
      case LEFT:
      case RIGHT:
        game.shiftRight(id, keyCode === RIGHT);
        break;
      case ROTATE_UP:
      case ROTATE_DOWN:
        game.rotateClockwise(id, keyCode !== ROTATE_UP);
        break;
      case DOWN:
        // this.detectCollision();
        game.shiftDown(id);
        break;
      case SPACE:
        game.maxDown(id);
        break;
    }
    game.updateBoard(id, {
      shapePos: game.state[game.state[id]].shapePos,
      futurePos: -2,
    });
    game.renderBoard();
  }
  res.json({ message: "Successfully Pressed Key!", channelId: channelId });
});

app.get("/create", (req, res) => {
  console.log("in create");
  const id = req.get("id");
  const name = req.get("name");
  res.json({
    message:
      "Hello from Express! Your name is " + name + " and your id is " + id,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
