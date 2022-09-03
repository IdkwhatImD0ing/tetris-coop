import { Box, Stack, Typography } from "@mui/material";
import SearchBox from "./searchbox";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home(props) {
  const [temp, setTemp] = useState("");

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
          <Typography variant="h2">Hello There! What is your name?</Typography>

          <SearchBox
            placeholder="Enter your name"
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />

          <Link to="/api">Check out our Api!</Link>
        </Stack>
      </Box>
    </>
  );
}
