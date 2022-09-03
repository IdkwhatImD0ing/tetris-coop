import * as React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import Api from "./ServerWorks";
import Single from "./modes/Single";
import { useState } from "react";
import Home from "./components/HomePage";
import GameSelect from "./components/GameSelect";
import { hop } from "@onehop/client";
import CoopGame from "./modes/Coop";

hop.init({
  projectId: process.env.HOP_PROJECT_ID, // replace with your project ID
});

export default function App() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [mode, setMode] = useState(0);
  const navigate = useNavigate();

  function createID() {
    let id =
      Date.now().toString(36) +
      Math.floor(
        Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
      ).toString(36);
    setId(id);
  }

  function createName(name) {
    setName(name);
    createID();
    navigate("/select");
  }
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home setName={createName} />} />
        <Route
          path="/select"
          element={<GameSelect name={name} playerId={id} setMode={setMode} />}
        />
        <Route
          path="/lobby"
          element={<Lobby name={name} playerId={id} mode={mode} />}
        />
        <Route path="/CoopGame" element={<CoopGame />} />
        <Route path="/api" element={<Api />} />
        <Route path="/single" element={<Single />} />
      </Routes>
    </div>
  );
}
