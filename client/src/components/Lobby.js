import { Box, Stack, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

export default function Lobby(props) {
  const mode = props.mode;
  const name = props.name;
  const navigate = useNavigate();
  const id = props.playerId;
  const [loading, setLoading] = React.useState(true);
  const [channelId, setChannelId] = React.useState("");

  const createCoopChannel = async () => {
    setLoading(true);
    fetch("/createCoopChannel")
      .then((res) => res.json())
      .then((data) => setChannelId(data.channelId));
    setLoading(false);
    navigate(`/coop?channelId=${channelId}`);
  };

  const createVersusChannel = async () => {
    setLoading(true);
    fetch("/createVersusChannel")
      .then((res) => res.json())
      .then((data) => setChannelId(data.channelId));
    setLoading(false);
    navigate(`/versus?channelId=${channelId}`);
  };

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
          onClick={() => {
            if (mode === 0) {
              createCoopChannel();
            }
            if (mode === 1) {
              createVersusChannel();
            }
          }}
        >
          Create Room
        </Button>
      </Box>
    </>
  );
}
