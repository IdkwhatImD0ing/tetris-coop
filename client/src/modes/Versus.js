import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { useBeforeunload } from "react-beforeunload";

const style = {
  width: "250px",
  height: "250px",
  display: "grid",
  borderWidth: "10px",
  gridTemplate: `repeat(${COL_SIZE}, 1fr) / repeat(${ROW_SIZE}, 1fr)`,
};

const url =
  "https://images.unsplash.com/photo-1592035659284-3b39971c1107?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1726&q=80";
const loadingUrl =
  "https://images.unsplash.com/photo-1591302418462-eb55463b49d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2502&q=80";

export default function VersusGame(props) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  //console.log(params.get("channelId"));
  const channelId = params.get("channelId");
  const [name, setName] = useState(props.name);
  const [playerId, setPlayerId] = useState(props.playerId);
  const [loading, setLoading] = useState(true);
  const [gameNotFound, setGameNotFound] = useState(false);

  // Hop State and Refs
  const { state } = useReadChannelState(channelId);
  const stateRef = useRef(state);
  const nameRef = useRef(name);
  const idRef = useRef(playerId);
  stateRef.current = state;
  nameRef.current = name;
  idRef.current = playerId;

  useEffect(() => {
    if (name) {
      fetch("https://tetrius.hop.sh/joingame", {
        headers: { name: name, id: playerId, channelId: channelId },
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.response < 0) {
            setGameNotFound(true);
          }
        });
    }
    window.addEventListener("keydown", keyInput);
    return () => {
      window.removeEventListener("keydown", keyInput);
    };
  }, []);

  useBeforeunload(() => {
    fetch("https://tetrius.hop.sh/leaveChannel", {
      headers: { channelId: channelId },
      keepalive: true,
    }).then((res) => res.json());
  });

  function createName(tempName) {
    console.log("createName Called " + tempName);
    setName(tempName);
    let temp =
      Date.now().toString(36) +
      Math.floor(
        Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
      ).toString(36);
    setPlayerId(temp);
    fetch("https://tetrius.hop.sh/joingame", {
      headers: { name: tempName, id: temp, channelId: channelId },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.response);
        if (data.response < 0) {
          console.log("Game Not Found");
          setGameNotFound(true);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
  }

  function onclick() {
    fetch("https://tetrius.hop.sh/ready", {
      headers: { name: name, id: playerId, channelId: channelId },
    }).then((res) => res.json());
  }

  let keyInput = (event) => {
    const { keyCode } = event;
    if (!stateRef) {
      return;
    }
    if (
      (stateRef.current.gameStarted &&
        !stateRef.current.gameEnded &&
        stateRef.current.playerOneId === idRef.current) ||
      stateRef.current.playerTwoId === idRef.current
    ) {
      fetch("https://tetrius.hop.sh/keypress", {
        headers: {
          keyCode: keyCode,
          name: nameRef.current,
          id: idRef.current,
          channelId: channelId,
        },
      }).then((res) => res.json());
    }
  };

  if (!name) {
    return <Home setName={createName} channelId={channelId} />;
  }

  if (loading) {
    return (
      <>
        <Box
          component="section"
          sx={{
            display: "flex",
            backgroundImage: `url(${loadingUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
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

  if (gameNotFound) {
    return (
      <>
        <Box
          component="section"
          sx={{
            display: "flex",
            backgroundImage: `url(${loadingUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Stack direction="column" spacing={4} alignItems="center">
            <Typography variant="h3">Lobby not Found</Typography>
            <Button
              onClick={() => {
                navigate("/select");
              }}
            >
              {" "}
              <Typography variant="h4" sx={{ color: "black" }}>
                Go Home
              </Typography>
            </Button>
          </Stack>
        </Box>
      </>
    );
  }

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
          justifyContent="center"
          alignItems="center"
          justifyItems="center"
          spacing={5}
          sx={{ height: "20vh" }}
        >
          <Typography variant="h5" sx={{ color: "white" }}>
            Room Code: {channelId}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              console.log(channelId);
              navigator.clipboard.writeText(channelId);
            }}
            sx={{
              backgroundColor: "black",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
              },
            }}
          >
            Copy Room Code
          </Button>
          <Typography variant="h5" sx={{ color: "white" }}>
            You can also use the link to join:
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              console.log(window.location.href);
              navigator.clipboard.writeText(window.location.href);
            }}
            sx={{
              backgroundColor: "black",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
              },
            }}
          >
            Copy Link
          </Button>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          justifyItems="center"
          spacing={10}
          sx={{ height: "20vh" }}
        >
          <Box
            padding="3%"
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
                sx={{
                  backgroundColor: state.playerOneReady ? "green" : "red",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "black",
                  },
                }}
              >
                Ready
              </Button>
            </Stack>
          </Box>
          {state.gameStarted && !state.gameEnded && (
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
            <Box
              padding="3%"
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
                  sx={{
                    backgroundColor: state.playerTwoReady ? "green" : "red",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "black",
                    },
                  }}
                >
                  Ready
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </>
  );
}
