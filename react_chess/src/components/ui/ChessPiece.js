import React from 'react';
import './Chessboard.css';

import { ItemTypes } from '../../DragDrop/constants';

import {useDrag} from 'react-dnd';

const ChessPiece = (props) => {
    const [{isDragging}, dragRef] = useDrag(() => {
        
        return {
          item: {
            pieceID: props.pieceID,
            square: props.square,
          },
          type: ItemTypes.PIECE,
          collect: (monitor) => {
            return {
              //   isDragging: !!monitor.isDragging(),
              pieceID: props.pieceID,
              data: monitor.getItem(),
            };
          },
        };
    }
    ,[props.chessBoard])


  const colorIndex = props.playerColor === "white" ? 0 : 1
  if (props.imageUrl !== undefined) {
    return (
        <img 
        src={props.imageUrl[colorIndex]}
        className="piece" alt="chess piece"
        ref={dragRef} 
        style={{
            opacity: isDragging ? 0.5 : 1
        }}
        />
    )
  }
}

export default ChessPiece