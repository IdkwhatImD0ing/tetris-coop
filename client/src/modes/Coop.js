import React from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import { hop } from "@onehop/client";

hop.init({ projectId: process.env.REACT_APP_HOP_PROJECT_ID });

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function CoopGame(props) {
  let query = useQuery();
  const channelId = query.get("channelId");

  hop.channels.on("stateUpdate", (channelId, state) => {
    // do something
  });
}
