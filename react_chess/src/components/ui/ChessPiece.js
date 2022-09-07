import React from 'react';
import piece_styles from '../../assets/pieces/piece_styles';
import './Chessboard.css'

const ChessPiece = (props) => {
  const colorIndex = props.playerColor === "white" ? 0 : 1
  if (props.imageUrl !== undefined) {
    return (
        <img src={props.imageUrl[colorIndex]} className="piece" alt="chess piece" />
    )
  }
}

export default ChessPiece