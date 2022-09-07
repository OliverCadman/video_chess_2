import './Chessboard.css';
import ChessPiece from './ChessPiece';

import React from 'react'

const Tile = (props) => {
  return (
    <div className={props.tileCount % 2 === 0 ? "tile light" : "tile dark"}>
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
        playerColor={props.playerColor} />
    </div>
  );
}

export default Tile