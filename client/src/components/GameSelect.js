import { Box, Stack, Typography, Button } from "@mui/material";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const url =
  "https://images.unsplash.com/photo-1559657693-e816ff3bd9af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80";
export default function GameSelect(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.name) {
      navigate("/");
    }
  }, []);
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
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={5}
        >
          <Typography variant="h2" sx={{ color: "white" }}>
            Hello {props.name}!
          </Typography>
          <Typography variant="h4" sx={{ color: "white" }}>
            Select your game mode below!
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/single")}
              sx={{ backgroundColor: "darkblue" }}
            >
              Single Player
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                navigate("/lobby");
                props.setMode(0);
              }}
              sx={{ backgroundColor: "darkblue" }}
            >
              Co-op
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                navigate("/lobby");
                props.setMode(1);
              }}
              sx={{ backgroundColor: "darkblue" }}
            >
              Versus
            </Button>
          </Stack>
          <Link to="/api">Check out our Api!</Link>
        </Stack>
      </Box>
    </>
  );
}
