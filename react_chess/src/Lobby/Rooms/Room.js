import React from 'react'

const Room = ({gameID, handleOpponentUserName, joinRoom, error}) => {
  return (
    <article className="room-portal-wrapper">
      <h1>Opponent: </h1>
      <p>Please type your username:</p>
      <form>
        <input
          type="text"
          onChange={(e) => handleOpponentUserName(e.target.value)}
          className="username-input"
        />
        {error.opponentUserNameError && (
            <p>
                Please enter a username.
            </p>
        )}
        <div className="submit-btn-wrapper">
          <button
            className="submit-btn"
            type="button"
            onClick={() => joinRoom(gameID)}
          >
            Join Game
          </button>
        </div>
      </form>
    </article>
  );
}

export default Room