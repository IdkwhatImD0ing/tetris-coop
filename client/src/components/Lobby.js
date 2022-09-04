import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

const url =
  "https://images.unsplash.com/photo-1591302418462-eb55463b49d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2502&q=80";

export default function Lobby(props) {
  const mode = props.mode;
  console.log(mode);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (mode === 0) {
      navigate("/coop");
    }
  });

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
            backgroundImage: `url(${url})`,
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

  return (
    <>
      <Box
        component="section"
        sx={{
          display: "flex",
          backgroundImage: `url(${url})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
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
