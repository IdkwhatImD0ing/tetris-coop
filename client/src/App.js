import * as React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import Api from "./ServerWorks";
import Single from "./modes/Single";
import { useState } from "react";
import Home from "./components/HomePage";
import GameSelect from "./components/GameSelect";

export default function App() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  function createName(name) {
    setName(name);
    navigate("/select");
  }
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home setName={createName} />} />
        <Route path="/select" element={<GameSelect name={name} />} />
        <Route path="/api" element={<Api />} />
        <Route path="/single" element={<Single />} />
      </Routes>
    </div>
  );
}
