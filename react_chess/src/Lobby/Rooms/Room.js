import React from 'react'

const Room = ({creatorUserName, gameID, joinRoom}) => {
  return (
    <article className="room-portal-wrapper">
      <h4>{creatorUserName}</h4>
      <button className="submit-btn" onClick={() => joinRoom(gameID)}>Join Game</button>
    </article>
  );
}

export default Room