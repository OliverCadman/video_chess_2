import React from "react";
import "./Chessboard.css";
import ChessBoard from "../../Models/Board";
import Tile from "./Tile";

import piece_styles from "../../assets/pieces/piece_styles";

const horizontalAxisSquares = ["a", "b", "c", "d", "e", "f", "g", "h"];

const verticalAxisSquares = ["1", "2", "3", "4", "5", "6", "7", "8"];

const Chessboard = () => {
  const chessBoard = new ChessBoard(true);
  const startingBoard = chessBoard.getStartingBoard()

  let board = [];

  // Populate board with square co-ordinates.
  for (let i = 0; i < horizontalAxisSquares.length; i++) {
    for (let j = 0; j < verticalAxisSquares.length; j++) {
      const tileCount = j + i + 2;
      board.push({
        letter: horizontalAxisSquares[j],
        number: verticalAxisSquares[i],
        tileCount,
      });
    }
  }
  return (
    <div id="chessboard">
      {startingBoard.map((row, index) => {
        let outerCount = index;
        return (
          <React.Fragment key={index}>
            {row.map((square, index) => {

              const isPieceOnThisSquare = Boolean(square.pieceOnThisSquare);

              const tileLetterAndNumber = square.notation.split('');
              const tileLetter = tileLetterAndNumber[0];
              const tileNumber = tileLetterAndNumber[1];
              let innerCount = index;
              const tileCount = outerCount + innerCount + 2
              return (
                <Tile
                key={index}
                index={index}
                tileCount={tileCount}
                tileLetter={tileLetter}
                tileNumber={tileNumber}
                outerCount={outerCount}
                imageUrl={piece_styles[isPieceOnThisSquare && square.pieceOnThisSquare.name]}
                isPieceOnThisSquare={isPieceOnThisSquare}
                playerColor={isPieceOnThisSquare && square.pieceOnThisSquare.color}
                >
                </Tile>
              )
            })}
          </React.Fragment>

        );
      })}
    </div>
  );
};

export default Chessboard;
