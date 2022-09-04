import { Box, Stack, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function GameSelect(props) {
  const navigate = useNavigate();
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
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={5}
        >
          <Typography variant="h2">Hello {props.name}!</Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Button variant="container" onClick={() => navigate("/single")}>
              Single Player
            </Button>
            <Button
              variant="container"
              onClick={() => {
                navigate("/lobby");
                props.setMode(0);
              }}
            >
              Co-op
            </Button>
            <Button
              variant="container"
              onClick={() => {
                navigate("/lobby");
                props.setMode(1);
              }}
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
