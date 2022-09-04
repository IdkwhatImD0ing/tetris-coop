import React from "react";
import {
  BrowserRouter as Router,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { hop } from "@onehop/client";
import { Box, Button, Typography } from "@mui/material";

const url =
  "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=958&q=80";

export default function CoopGame(props) {
  const navigate = useNavigate();
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
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 0px 10px #000000",
            padding: "10%",
            backgroundColor: "rgba(255, 255, 255, 0.475)",
          }}
        >
          <Typography variant="h1">
            Under Construction, Check Back Later!
          </Typography>
          <Button
            onClick={() => {
              navigate("/select");
            }}
          >
            {" "}
            <Typography variant="h4" sx={{ color: "white" }}>
              Go Home
            </Typography>
          </Button>
        </Box>
      </Box>
    </>
  );
}
