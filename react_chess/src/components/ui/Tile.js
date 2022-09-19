import "./Chessboard.css";
import ChessPiece from "./ChessPiece";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../DragDrop/constants";
import Overlay from "./Overlay";

import React from "react";

const Tile = (props) => {
  const xCoord = props.square.x;
  const yCoord = props.square.y;

  let pieceOnThisSquare, notation;

  const [{ isOver, data, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (data, monitor) => {   
      props.endDrag(data.square.pieceOnThisSquare.id, [xCoord, yCoord], data.square.getNormalizedCoords(), true);
    },
    collect: (monitor) => {
      if (monitor.getItem()) {
        const item = monitor.getItem();
        if (item) {
          pieceOnThisSquare = item.pieceID && item.pieceID[1];
          notation = item.square && item.square.notation;
        }
      }
      return {
        canDrop: props.canMovePiece(
          pieceOnThisSquare,
          notation,
          xCoord,
          yCoord
        ),
        data: monitor.getItem(),
        isOver: !!monitor.isOver(),
      };
    },
  }));

  return (
    <div
      className={props.tileCount % 2 === 0 ? "tile light" : "tile dark"}
      ref={drop}
    >
      {/* {isOver && !canDrop && <Overlay color="red" />}
      {isOver && canDrop && <Overlay color="green" />} */}
      {canDrop && <Overlay color="black" />}
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
        isWhite={props.isWhite}
        pieceID={props.pieceID}
        square={props.square}
        blackInCheck={props.blackInCheck}
        whiteInCheck={props.whiteInCheck}
        isPlayerWhite={props.isPlayerWhite}
      />
    </div>
  );
};

export default Tile;
