import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

export default function Lobby(props) {
  const mode = props.mode;
  const name = props.name;
  const navigate = useNavigate();
  const id = props.playerId;
  const [loading, setLoading] = React.useState(false);

  const createCoopChannel = () => {
    setLoading(true);
    fetch("/createCoopChannel")
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        navigate(`/coop?channelId=${data.channelId}`);
      });
  };

  const createVersusChannel = () => {
    setLoading(true);
    fetch("/createVersusChannel")
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        navigate(`/versus?channelId=${data.channelId}`);
      });
  };

  if (loading) {
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
        <Button
          variant="contained"
          onClick={() => {
            if (mode === 0) {
              createCoopChannel();
            }
            if (mode === 1) {
              createVersusChannel();
            }
          }}
          sx={{ color: "white", backgroundColor: "black" }}
        >
          Create Room
        </Button>
      </Box>
    </>
  );
}
