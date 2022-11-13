import React from 'react';
import PieceStyles from '../../assets/pieces/piece_styles';

const Room = ({gameID, handleOpponentUserName, joinRoom, error, creator, playerArray, opponent}) => {
  const disabled = playerArray.length === 2;
  return (
    <article className="room-portal-wrapper">
      {!disabled ? (
        <>
          <h1>Opponent: {creator}</h1>
          <p>Please type your username:</p>
          <form>
            <input
              type="text"
              onChange={(e) => handleOpponentUserName(e.target.value)}
              className="username-input"
            />
            {error.opponentUserNameError && <p>Please enter a username.</p>}
            <div className="submit-btn-wrapper">
              <button
                className="submit-btn"
                type="button"
                onClick={() => joinRoom(gameID)}
                disabled={disabled}
              >
                {disabled ? "Room Full" : "Join Game"}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div>
          <p>
            <img
              src={PieceStyles.king[0]}
              alt="White King"
              width="50"
              height="50"
              className="room-icon"
            />
            : {creator}
          </p>

          <p>
            <img
              src={PieceStyles.king[1]}
              alt="Black King"
              width="50"
              height="50"
              className="room-icon"
            />
            : {opponent}
          </p>
          <h3>Room is full</h3>
        </div>
      )}
    </article>
  );
}

export default Room