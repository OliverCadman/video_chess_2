import React, { useState, useEffect } from "react";
import Form from "./Form";
import "../assets/css/lobby.css";

import { socket } from "../connections/socket";

import { v4 as uuid } from "uuid";

import { useNavigate } from "react-router-dom";
import RoomWrapper from "./Rooms/RoomWrapper";

const Lobby = () => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(false);
  const [games, setGames] = useState(null);

  useEffect(() => {
    socket.emit("findAllGames");

    socket.on("listAllGames", (data) => {
      if (data) {
        setGames(data);
      }
    });
  }, []);

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
          creator: userName,
        },
      });
      if (openSocket) {
        navigate(`game/${gameID}`);
      }
    }
  };

  const joinRoom = (gameID) => {
    console.log("game id", gameID);
  };
  return (
    <div className="lobby-container">
      <Form handleUserName={handleUserName} error={error} send={send} />
      <RoomWrapper games={games} joinRoom={joinRoom} />
    </div>
  );
};

export default Lobby;
