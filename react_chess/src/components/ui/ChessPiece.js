import React from 'react';
import './Chessboard.css';

import {useDrag} from 'react-dnd';

const ChessPiece = (props) => {
    const [{isDragging}, dragRef] = useDrag(
        () => ({
            type: "piece",
            item: "test",
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging()
            })
        })
    )


  const colorIndex = props.playerColor === "white" ? 0 : 1
  if (props.imageUrl !== undefined) {
    return (
        <img 
        src={props.imageUrl[colorIndex]}
        className="piece" alt="chess piece"
        onClick={() => props.handleClick(props.pieceID)}
        ref={dragRef} 
        style={{
            opacity: isDragging ? 0.5 : 1
        }}
        />
    )
  }
}

export default ChessPiece