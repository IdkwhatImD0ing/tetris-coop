import { Box, Stack, Typography } from "@mui/material";
import SearchBox from "./searchbox";
import { useState } from "react";
import { Link } from "react-router-dom";

const url =
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1756&q=80";

export default function Home(props) {
  const [temp, setTemp] = useState(null);

  const handleChange = (e) => {
    setTemp(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(temp);
    props.setName(temp);
  };

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
          <Typography variant="h1" sx={{ color: "white" }}>
            Tetris Duels
          </Typography>
          <Typography variant="h2" sx={{ color: "white" }}>
            Hello There! What is your name?
          </Typography>

          <SearchBox
            placeholder="Enter your name"
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </Stack>
      </Box>
    </>
  );
}
