import React, { useState, useEffect, useRef } from "react";
import "./Chessboard.css";
import ChessBoard from "../../Models/Board";
import Tile from "./Tile";

import PieceStyles from "../../assets/pieces/piece_styles";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { socket } from "../../connections/socket";


const Chessboard = () => {
  const [chessBoard, setChessBoard] = useState(new ChessBoard(true));
  const [moveMade, setMoveMade] = useState(false);
  const [whiteInCheck, setWhiteInCheck] = useState(false);
  const [blackInCheck, setBlackInCheck] = useState(false);

  const prevGameState = useRef(null);

  // useEffect(() => {
  //   prevGameState.current = chessBoard;
  //   console.log(prevGameState)
  // }, [])

  useEffect(() => {
    prevGameState.current = chessBoard;
    setMoveMade(false);
  }, [moveMade]);

  const startingBoard = chessBoard.getBoard();

  const handlePieceMove = (pieceID, toCoords) => {
    const move = chessBoard.movePiece(pieceID, toCoords);
    
    if (move === 'w in check') {
      setWhiteInCheck(true);
    } else if (move === "b in check") {
      setBlackInCheck(true);
    } else {
      setWhiteInCheck(false);
      setBlackInCheck(false);
    }

    setChessBoard(chessBoard);
    setMoveMade(true);
  };

  const canMovePiece = (pieceID, fromCoords, x, y) => {
    console.log(pieceID)
    if (!pieceID) return;
    const availableMoves = chessBoard.canMovePiece(pieceID, fromCoords, x, y);
    for (let move of availableMoves) {
      if (move[0] === x && move[1] === y) {
        return true;
      }
    }
    return false;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div id="chessboard">
        {startingBoard.map((row, index) => {
          let outerCount = index;
          return (
            <React.Fragment key={index}>
              {row.map((square, index) => {
                const isPieceOnThisSquare = Boolean(square.pieceOnThisSquare);
                const tileLetterAndNumber = square.notation.split("");
                const tileLetter = tileLetterAndNumber[0];
                const tileNumber = tileLetterAndNumber[1];
                let innerCount = index;
                const tileCount = outerCount + innerCount + 2;
                return (
                  <Tile
                    key={index}
                    index={index}
                    tileCount={tileCount}
                    tileLetter={tileLetter}
                    tileNumber={tileNumber}
                    outerCount={outerCount}
                    imageUrl={
                      PieceStyles[
                        isPieceOnThisSquare && square.pieceOnThisSquare.name
                      ]
                    }
                    isPieceOnThisSquare={isPieceOnThisSquare}
                    playerColor={
                      isPieceOnThisSquare && square.pieceOnThisSquare.color
                    }
                    pieceID={isPieceOnThisSquare && square.pieceOnThisSquare.id}
                    handlePieceMove={handlePieceMove}
                    square={square}
                    canMovePiece={canMovePiece}
                    blackInCheck={blackInCheck}
                    whiteInCheck={whiteInCheck}
                  ></Tile>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </DndProvider>
  );
};

export default Chessboard;
