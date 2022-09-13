import React, { useState } from "react";
import "../assets/css/lobby.css";

import { socket } from "../connections/socket";

import { v4 as uuid } from "uuid";

const Lobby = () => {
  const DOMAIN_URL = "http://localhost:3001/";
  const [didSend, setDidSend] = useState(false);
  const [gameId, setGameId] = useState("");

  const send = (e) => {
    e.preventDefault();
    const gameId = uuid();
    socket.emit("createNewGame", gameId);
    setGameId(gameId);
    setDidSend(true);

  };

  const copyURL = (e) => {
    e.preventDefault();
    const fullURL = `${DOMAIN_URL}${gameId}`;
    navigator.clipboard.writeText(fullURL);
  }


  return (
    <article className="lobby-wrapper">
      <div className="header">
        <h1>Welcome</h1>
      </div>
      <hr />
      <div className="username-form">
        <p>Please enter your username</p>
        <form>
          <div>
            <input type="text" className="username-input" />
          </div>
          <div className="submit-btn-wrapper">
            {!didSend ? (
              <button
                type="submit"
                className="submit-btn"
                onClick={(e) => send(e)}
              >
                Submit
              </button>
            ) : (
              <button
                type="submit"
                className="submit-btn"
                onClick={(e) => copyURL(e)}
              >
                Copy this URL and send to your friend.
              </button>
            )}
          </div>
        </form>
      </div>
    </article>
  );
};

export default Lobby;
