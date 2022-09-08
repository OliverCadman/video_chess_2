import './Chessboard.css';
import ChessPiece from './ChessPiece';

import React from 'react'

const Tile = (props) => {
    const xCoord = props.square.x;
    const yCoord = props.square.y;

    const squareClickedX = props.squareClickIndex && props.squareClickIndex[0];
    const squareClickedY = props.squareClickIndex && props.squareClickIndex[1];

  return (
    <div
      className={props.tileCount % 2 === 0 ? "tile light" : "tile dark"}
      onClick={() =>
        props.handlePieceMove(
          props.pieceID,
          props.square,
          [xCoord, yCoord],
          props.index
        )
      }
      style={{
        backgroundColor:
          props.squareClicked &&
          xCoord === squareClickedX &&
          yCoord === squareClickedY
            ? "rgba(232, 175, 154, 0.8)"
            : "",
      }}
    >
      {/* Render letters on first rank only, and numbers on 'h' rank going up board. */}
      <span className="tile-content letter">
        {props.outerCount < 1 && props.tileLetter}
      </span>
      <span className="tile-content number">
        {props.index % 8 === 7 && props.tileNumber}
      </span>
      <ChessPiece
        imageUrl={props.imageUrl}
        isPieceOnThisSquare={props.isPieceOnThisSquare}
        playerColor={props.playerColor}
        handleClick={props.handleClick}
        pieceID={props.pieceID}
      />
    </div>
  );
}

export default Tile