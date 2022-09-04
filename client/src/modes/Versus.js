import React, { useEffect } from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import { hop } from "@onehop/client";
import { Box, Stack, Typography, Button } from "@mui/material";
import { useReadChannelState } from "@onehop/react";
import { COL_SIZE, ROW_SIZE } from "../components/shape";
import Home from "../components/HomePage";

hop.init({ projectId: process.env.REACT_APP_HOP_PROJECT_ID });

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const style = {
  width: "250px",
  height: "250px",
  margin: "0 auto",
  display: "grid",
  borderWidth: "10px",
  gridTemplate: `repeat(${COL_SIZE}, 1fr) / repeat(${ROW_SIZE}, 1fr)`,
};

export default function VersusGame(props) {
  let query = useQuery();
  const channelId = query.get("channelId");
  const { state } = useReadChannelState(channelId);
  const [name, setName] = React.useState(props.name);
  const [playerId, setPlayerId] = React.useState(props.playerId);

  useEffect(async () => {
    state = await hop.channels.readState(channelId);
    if (name) {
      fetch("/joingame").then((res) => res.json());
    }
  }, []);

  function createID() {
    let id =
      Date.now().toString(36) +
      Math.floor(
        Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
      ).toString(36);
    setPlayerId(id);
  }

  function createName(name) {
    setName(name);
    createID();
  }

  return (
    <>
      {!name && <Home setName={createName} />}
      {name && (
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
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={5}
          >
            <Stack
              drection="column"
              justifyCOntent="center"
              alignItems="center"
              spacing={3}
            >
              <Typography variant="h2">{state.playerOneName}!</Typography>
              <Typography variant="h2">
                {state[state.playerOneId].score}!
              </Typography>
            </Stack>
            <div style={style}> {state[state.playerOneId].board} </div>
            <div style={style}> {state[state.playerTwoId].board} </div>
            <Stack
              drection="column"
              justifyCOntent="center"
              alignItems="center"
              spacing={3}
            >
              <Typography variant="h2">{state.playerOneName}!</Typography>
              <Typography variant="h2">
                {state[state.playerOneId].score}!
              </Typography>
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
}
