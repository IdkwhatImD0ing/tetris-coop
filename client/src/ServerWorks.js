import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Link } from "react-router-dom";

function Api(props) {
  const [data, setData] = React.useState(null);
  const [data2, setData2] = React.useState(null);
  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
    fetch("/create", { headers: { name: props.name, id: props.id } })
      .then((res) => res.json())
      .then((data) => setData2(data.message));
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <p>{!data2 ? "Loading..." : data2}</p>
        <nav>
          <Link to="/select">Home</Link>
        </nav>
      </header>
    </div>
  );
}
export default Api;
