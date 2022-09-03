require("dotenv").config();
const { Hop, ChannelType } = require("@onehop/js");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const hop = new Hop(process.env.REACT_APP_HOP_PROJECT_ENV);
const transport = require("./Transport");

export const ROW_SIZE = 8;
export const COL_SIZE = 20;
export const DEFAULT_VALUE = -1;

// creates empty board
const emptyBoard = () =>
  [...Array(ROW_SIZE * COL_SIZE)].map((_) => DEFAULT_VALUE);

const createChannelId = () => {
  return Math.random().toString(16);
};

app.get("/api", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/id", async (req, res) => {
  const { id } = await hop.channels.tokens.create();
  res.json({ message: "Successfully Generated ID!", id: id });
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
        gameStarted: false,
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

app.get("/create", (req, res) => {
  const id = req.get(id);
  const name = req.get(name);
  res.json({
    message: "Hello from Express! Your name is" + name + "and your id is" + id,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
