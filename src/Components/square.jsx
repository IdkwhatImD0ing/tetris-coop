import React from "react";

const COLOR_MAP = [
  "white",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
];

const getStyle = (colorVal) => {
  return {
    height: "35px",
    width: "35px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "black",
    color: "black",
    justifyContent: "center",
    backgroundColor: COLOR_MAP[colorVal],
  };
};

export default function Square(props) {
  return <div style={getStyle(props.colorVal)} />;
}
