import React, { useEffect, useState } from "react";
import { socket } from "../../connections/socket";

import Room from "./Room";

const RoomWrapper = ({ games, joinRoom, handleOpponentUserName, error }) => {
  return (
    <>
      {games &&
        games.map((game, index) => {
          return (
            <Room
              key={index}
              gameID={game.gameID}
              creator={game.creator}
              joinRoom={joinRoom}
              handleOpponentUserName={handleOpponentUserName}
              error={error}
            />
          );
        })}
    </>
  );
};

export default RoomWrapper;
