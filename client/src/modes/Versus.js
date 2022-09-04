import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useReadChannelState } from "@onehop/react";
import { COL_SIZE, ROW_SIZE } from "../components/shape";
import Home from "../components/HomePage";
import Square from "../components/square";

const style = {
  width: "250px",
  height: "250px",
  margin: "0 auto",
  display: "grid",
  borderWidth: "10px",
  gridTemplate: `repeat(${COL_SIZE}, 1fr) / repeat(${ROW_SIZE}, 1fr)`,
};

export default function VersusGame(props) {
  const [params] = useSearchParams();
  //console.log(params.get("channelId"));
  const channelId = params.get("channelId");

  const { state } = useReadChannelState(channelId);
  const stateRef = useRef(state);
  stateRef.current = state;
  const [name, setName] = React.useState(props.name);
  const [playerId, setPlayerId] = React.useState(props.playerId);

  useEffect(() => {
    if (name) {
      fetch("/joingame", {
        headers: { name: name, id: playerId, channelId: channelId },
      }).then((res) => res.json());
    }
    window.addEventListener("keydown", keyInput);
  }, []);

  function createName(name) {
    setName(name);
    let temp =
      Date.now().toString(36) +
      Math.floor(
        Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
      ).toString(36);
    setPlayerId(temp);
    fetch("/joingame", {
      headers: { name: name, id: temp, channelId: channelId },
    }).then((res) => res.json());
  }

  function onclick() {
    fetch("/ready", {
      headers: { name: name, id: playerId, channelId: channelId },
    }).then((res) => res.json());
  }

  let keyInput = (event) => {
    const { key, keyCode } = event;
    if (!stateRef) {
      return;
    }
    console.log(keyCode);
    console.log(stateRef.current);
    if (stateRef.current.gameStarted) {
      fetch("/keypress", {
        headers: { keyCode: keyCode, id: playerId, channelId: channelId },
      }).then((res) => res.json());
    }
  };

  if (!state) {
    return (
      <>
        <Box
          component="section"
          sx={{
            display: "flex",
            backgroundColor: "Grey",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Stack direction="column" spacing={4} alignItems="center">
            <Typography variant="h2">Loading...</Typography>
            <CircularProgress sx={{ color: "black" }} />
          </Stack>
        </Box>
      </>
    );
  }

  if (!name) {
    return <Home setName={createName} />;
  }

  return (
    <>
      <Box
        component="section"
        sx={{
          backgroundColor: "Grey",
          height: "100vh",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          spacing={5}
        >
          <Stack
            drection="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}
          >
            <Typography variant="h2">{state.playerOneName}</Typography>
            {state[state[state.playerOneId]] && (
              <Typography variant="h2">
                Score: {state[state[state.playerOneId]].score}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={onclick}
              sx={{ backgroundColor: state.playerOneReady ? "green" : "red" }}
            >
              Ready
            </Button>
          </Stack>
          {state.gameStarted && (
            <Stack
              direction="row"
              spacing={10}
              justifyContent="space-between"
              alignItems="center"
            >
              <div style={style}>
                {state[state[state.playerOneId]].board.map((val, pos) => (
                  <Square key={pos} name={pos} color={val} />
                ))}
              </div>
              <div />
              <div style={style}>
                {state[state[state.playerTwoId]].board.map((val, pos) => (
                  <Square key={pos} name={pos} color={val} />
                ))}
              </div>
            </Stack>
          )}
          {state.playerTwo && (
            <Stack
              drection="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
            >
              <Typography variant="h2">{state.playerTwoName}</Typography>
              {state[state[state.playerTwoId]] && (
                <Typography variant="h2">
                  Score: {state[state[state.playerTwoId]].score}
                </Typography>
              )}
              <Button
                variant="contained"
                onClick={onclick}
                sx={{ backgroundColor: state.playerTwoReady ? "green" : "red" }}
              >
                Ready
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>
    </>
  );
}
