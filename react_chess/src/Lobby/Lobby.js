import React, { useState } from "react";
import Form from "./Form";
import "../assets/css/lobby.css";

import { socket } from "../connections/socket";

import { v4 as uuid } from "uuid";

import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleUserName = (input) => {
    if (!input) {
      setError(true);
    } else {
      setError(false);
      setUserName(input);
    }
  };

  const send = (e) => {
    e.preventDefault();
    if (!userName) {
      setError(true);
    } else {
      setError(false);
      const gameID = uuid();
      const openSocket = socket.emit("createNewGame", {
        gameID: gameID,
        userName: {
            creator: userName
        }
      });
      if (openSocket) {
        navigate(`game/${gameID}`);
      }
    }
  };
  return (
    <div className="lobby-container">
      <Form handleUserName={handleUserName} error={error} send={send} />
    </div>
  );
};

export default Lobby;
