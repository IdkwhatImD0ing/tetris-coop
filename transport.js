// import { Hop } from '@onehop/js';
// const {Hop} = require('@onehop/js');
import { ChannelType } from "@onehop/js";

// const myToken = 'ptk_c18xOTZiZWQzNzNhNjliODkyZDJmZTdkMzg3NjA0MTY1Ml81MDI5NDkzMDA3OTI3MzIwNA';
// Export the Hop SDK instance so you can use it throughout your codebase
// const hop = new Hop(myToken);
const gameId = 1111111111111111;

// const channelId = "tetris"; // the channel we want to update

export const createChannel = (hop, gameId, board) => {
  console.log(hop);
  try {
    const send = async () => {
      await hop.channels.create(ChannelType.UNPROTECTED, `${gameId}`, {
        state: {
          readyPlayerOne: 0,
          readyPlayerTwo: 0,
          p1: [{ board }],
          p2: [{ board }],
        },
      });
    };

    send().then(() => {
      console.log("Sent");
    });
  } catch (error) {
    console.error(error);
  }
};

export const createLobbyId = async () => {
  const random = (length = 8) => {
    return Math.random().toString(16);
  };

  return (gameId = random(8));
};

export const setReady = async (hop, channelId, player) => {
  switch (player) {
    case "1":
      await hop.channels.setState(channelId, (s) => ({
        ...s,
        readyPlayerOne: 1,
      }));
      break;
    case "2":
      await hop.channels.setState(channelId, (s) => ({
        ...s,
        readyPlayerTwo: 1,
      }));
      break;
    default:
      console.error("Invalid player");
  }
};

export const startMatch = async (hop, channelId) => {
  console.log("Starting match");
  await hop.channels.get(channelId).then((r) => {
    if (r.state.readyPlayerOne === 1 && r.state.readyPlayerTwo === 1) {
      return "ready";
    } else {
      return "notready";
    }
  });
  // await hop.channels.get(channelId).then(r => {
  //     return r;
  // });
};

export const updateBoard = async (hop, channelId, board) => {
  //Need to Implement I,T,L,J,Z,S,O and 0 is none(black)

  try {
    const send = async () => {
      await hop.channels.setState(channelId, (s) => ({
        ...s,
        p1: [{ board }],
      }));
    };

    send().then(() => {
      console.log("Sent");
    });
  } catch (error) {
    console.error(error);
  }

  try {
    const receive = async () => {
      await hop.channels.get(channelId).then((r) => {
        console.log("Received data");
        return r;
      });
      // await hop.channels.get(channelId).then(r => {
      //     console.log("Received data");
      //     console.log(r);
      //     return r;
      // });
    };

    receive().then((r) => {
      console.log("in receive");
      console.log(r);
      return r;
    });
  } catch (error) {
    console.log(error);
  }
};

export const emptyBoard = () => {
  let board = [];
  for (let i = 0; i < 120; i++) {
    board.push(-1);
  }
  return board;
};
