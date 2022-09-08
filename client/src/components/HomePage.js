import { Box, Stack, Typography, ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBox from "./searchbox";
import { useState } from "react";
import { theme } from "./theme";
import { useReadChannelState } from "@onehop/react";

const url =
  "https://images.unsplash.com/photo-1557264337-e8a93017fe92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";

export default function Home(props) {
  const [temp, setTemp] = useState(null);
  const [code, setCode] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setTemp(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(temp);
    props.setName(temp);
  };

  const handleCode = (e) => {
    e.preventDefault();
    setCode(e.target.value);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    fetch("https://tetrius.hop.sh/getChannelMode", {
      headers: { channelId: e.target.value },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.mode === 0) {
          navigate(`/coop?channelId=${code}`);
        } else {
          navigate(`/versus?channelId=${code}`);
        }
      });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
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
              width="400px"
            />

            {!props.channelId && (
              <>
                <Typography variant="h4" sx={{ color: "white" }}>
                  Already have a code? Enter it here!
                </Typography>
                <SearchBox
                  placeholder="Enter Code"
                  handleChange={handleCode}
                  handleSubmit={handleCodeSubmit}
                  width="200px"
                />
              </>
            )}
          </Stack>
        </Box>
      </ThemeProvider>
    </>
  );
}
