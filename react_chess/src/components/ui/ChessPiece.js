import React, { useEffect, useRef } from 'react';
import './Chessboard.css';

import { ItemTypes } from '../../DragDrop/constants';

import {useDrag} from 'react-dnd';

const ChessPiece = (props) => {

    const pieceRef = useRef(null);

    const [{isDragging}, dragRef] = useDrag(() => {
        return {
          item: {
            pieceID: props.pieceID,
            square: props.square,
          },
          type: ItemTypes.PIECE,
          collect: (monitor) => {
            return {
              offset: monitor.getInitialClientOffset(),
              isDragging: !!monitor.isDragging(),
              pieceID: props.pieceID,
              data: monitor.getItem(),
            };
          }
        };
    }
    ,[props.chessBoard]);

    const isBlackInCheck = props.pieceID === "bk1" && props.blackInCheck;
    const isWhiteInCheck = props.pieceID === "wk1" && props.whiteInCheck;


  const colorIndex = props.playerColor === "white" ? 0 : 1
  if (props.imageUrl !== undefined) {
    return (
      <div className="piece-wrapper">
        {(isBlackInCheck || isWhiteInCheck) && (
            <div className='check-alert'></div>
        )}
        <img
          src={props.imageUrl[colorIndex]}
          className="piece"
          alt="chess piece"
          ref={(r) => {
            dragRef(r);
            pieceRef.current = r;
          }}
          style={{
            opacity: isDragging ? 0.5 : 1,
          }}
        />
      </div>
    );
  }
}

export default ChessPiece