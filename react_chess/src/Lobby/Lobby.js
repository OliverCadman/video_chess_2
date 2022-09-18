import React, { useState, useEffect, useContext } from "react";
import { ColorContext } from "../context/ColorContext";
import Form from "./Form";
import "../assets/css/lobby.css";

import { socket } from "../connections/socket";

import { v4 as uuid } from "uuid";

import { useNavigate } from "react-router-dom";
import RoomWrapper from "./Rooms/RoomWrapper";

const Lobby = () => {
  const [userName, setUserName] = useState("");
  const [opponentUserName, setOpponentUserName] = useState("");
  const [error, setError] = useState({
    userNameError: false,
    opponentUserNameError: false
  });

  const [games, setGames] = useState(null);

  const color = useContext(ColorContext);

  useEffect(() => {
     socket.emit("findAllGames");

     socket.on("listAllGames", (data) => {
       if (data) {
         setGames(data);
       }
     });
  }, [])

  useEffect(() => {

    socket.on('connectToRoom', data => {
        console.log(data)
    })
  }, [opponentUserName]);

  const navigate = useNavigate();

  const handleUserName = (input) => {
    if (!input) {
      setError({
        ...error,
        userNameError: true
      });
    } else {
      setError({
        ...error,
        userNameError: false
      });
      setUserName(input);
    }
  };

  const handleOpponentUserName = (input) => {
    if (!input) {
        setError({
            ...error,
            opponentUserNameError: true
        });
    } else {
        setError({
            ...error,
            opponentUserNameError: false
        });
        setOpponentUserName(input);
    }
  }

  const send = (e) => {
    e.preventDefault();
    if (!userName) {
      setError({
        ...error,
        userNameError: true
      });
    } else {
      setError({
        ...error,
        userNameError: false
      });
      const gameID = uuid();
      const openSocket = socket.emit("createNewGame", {
        gameID: gameID,
        userName: {
          creator: userName,
        },
      });
      if (openSocket) {
        color.playerIsCreator()
        navigate(`game/${gameID}`);
      }
    }
  };

  const joinRoom = (gameID) => {
    if (!opponentUserName) {
        setError({
            ...error,
            opponentUserNameError: true
        });
    } else {
        setError({
            ...error,
            opponentUserNameError: false
        });
    
        const connectionAttempt = socket.emit("playerJoinedGame", {
            gameID: gameID,
            opponentUserName: opponentUserName
        })

       if (connectionAttempt.connected) {
          navigate(`game/${gameID}`)
       }
    }
  };
  return (
    <div className="lobby-container">
      <Form handleUserName={handleUserName} error={error} send={send} />
      <RoomWrapper
      games={games}
      joinRoom={joinRoom}
      handleOpponentUserName={handleOpponentUserName}
      error={error} />
    </div>
  );
};

export default Lobby;
