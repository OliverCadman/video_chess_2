import "./Chessboard.css";
import ChessPiece from "./ChessPiece";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../DragDrop/constants";

import React from "react";

const Tile = (props) => {
  const xCoord = props.square.x;
  const yCoord = props.square.y;

  const [{ isOver, data, canDrop, }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PIECE,
      drop: (data) => {
        props.handlePieceMove(data.square.pieceOnThisSquare.id, [xCoord, yCoord]);
      },
      collect: (monitor) => {
        return {
          canDrop: !!monitor.canDrop(),
          data: monitor.getItem(),
          isOver: !!monitor.isOver(),
        };
      },
    })
  );
  return (
    <div
      className={props.tileCount % 2 === 0 ? "tile light" : "tile dark"}
      ref={drop}
    >
      {isOver && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "red",
          }}
        ></div>
      )}
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
        pieceID={props.pieceID}
        square={props.square}
        chessBoard={props.chessBoard}
      />
    </div>
  );
};

export default Tile;
