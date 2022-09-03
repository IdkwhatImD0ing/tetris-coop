import { Box, Stack, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Lobby(props) {
  const mode = props.mode;
  const name = props.name;
  const navigate = useNavigate();
  const id = props.playerId;
  const [loading, setLoading] = React.useState(true);

  const createCoopChannel = async () => {
    setLoading(true);
    fetch("/api/createCoopChannel")
      .then((res) => res.json())
      .then((data) => setData(data.channelId));
    setLoading(false);
    navigate(`/CoopGame?channelId=${channelId}`);
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
            createCoopChannel();
          }}
        >
          Create Room
        </Button>
      </Box>
    </>
  );
}
