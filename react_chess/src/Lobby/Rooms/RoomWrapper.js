import React, {useEffect, useState} from 'react';
import { socket } from '../../connections/socket';

import Room from './Room';

const RoomWrapper = ({games, joinRoom}) => {
  return (
    <>
      {games &&
        games.map((gameArray, index) => {
          return (
            <React.Fragment key={index}>
              {gameArray.map((game, index) => {
                if (Object.keys(game).length > 0) {
                  console.log(game);
                  return (
                    <Room 
                    key={index} 
                    gameID={game.gameID}
                    creatorUserName={game.userName.creator}
                    joinRoom={joinRoom}
                     />
                  );
                }
              })}
            </React.Fragment>
          );
        })}
    </>
  );
}

export default RoomWrapper