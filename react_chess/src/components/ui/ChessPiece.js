import React, { useEffect, useRef } from 'react';
import './Chessboard.css';

import { ItemTypes } from '../../DragDrop/constants';

import {useDrag} from 'react-dnd';

const ChessPiece = (props) => {


    const pieceRef = useRef(null);
    let pieceID;
    const [{isDragging}, dragRef] = useDrag(() => {
        if (props.square.pieceOnThisSquare) {
            pieceID = props.square.pieceOnThisSquare.id
        }
        return {
          item: {
            pieceID: pieceID,
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
    ,[]);

    const canPieceBeMovedByThisPlayer = props.isWhite === props.isPlayerWhite;
    // console.group("PIECE INFO");
    // console.log("is piece white?", props.isWhite);
    // console.log("is player white?", props.isPlayerWhite);
    // console.log("can piece be moved by player?", canPieceBeMovedByThisPlayer);
    // console.groupEnd();
    const isBlackInCheck = props.pieceID === "bk1" && props.blackInCheck;
    const isWhiteInCheck = props.pieceID === "wk1" && props.whiteInCheck;


  const colorIndex = props.isWhite ? 0 : 1;
  if (props.imageUrl !== undefined) {
    return (
      <div className="piece-wrapper">
        {(isBlackInCheck || isWhiteInCheck) && (
            <div className='check-alert'></div>
        )}
        <img
          src={props.imageUrl[colorIndex]}
          className="piece"
          alt={props.pieceID}
          ref={(r) => {
            canPieceBeMovedByThisPlayer && dragRef(r)
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