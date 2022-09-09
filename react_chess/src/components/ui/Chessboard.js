import React, {useState, useEffect} from "react";
import "./Chessboard.css";
import ChessBoard from "../../Models/Board";
import Tile from "./Tile";

import PieceStyles from "../../assets/pieces/piece_styles";

const horizontalAxisSquares = ["a", "b", "c", "d", "e", "f", "g", "h"];

const verticalAxisSquares = ["1", "2", "3", "4", "5", "6", "7", "8"];
let selectedPiece;
let squareClickCoords;
const Chessboard = () => {
  const [firstSquareSelected, setFirstSquareSelected] = useState(false);
  const [chessBoard, setChessBoard] = useState(new ChessBoard(true));

  let clickedSquareCoords;
  let selectedPieceID;
  let squareClicked;
  
  useEffect(() => {
    console.log('chessboard c')
  }, [chessBoard])


  const startingBoard = chessBoard.getBoard()

  let board = [];

  const handleClick = (pieceID) => {

  }

  const grabPiece = (e) => {
    const el = e.target;
    if (el.classList.contains("piece")) {
      const x = e.clientX - 70;
      const y = e.clientY - 70;

      // el.style.position = "absolute";
      // el.style.left = `${x}px`;
      // el.style.top = `${y}px`;
      
    }
  }


  const handlePieceMove = (pieceID, fromCoords, toCoords, index) => {
     let x, y;
     if (!firstSquareSelected && !selectedPiece) {
        selectedPiece = pieceID;
        squareClickCoords = [fromCoords.x, fromCoords.y];
        setFirstSquareSelected(true);
     } else {
        chessBoard.movePiece(selectedPiece, toCoords);
        setFirstSquareSelected(false);
        selectedPiece = null;
        setChessBoard(chessBoard);
     }

     if (fromCoords && toCoords.pieceOnThisSquare) {
      [x, y] = fromCoords;
      clickedSquareCoords = {x, y};
      if (!selectedPieceID) {
        selectedPieceID = pieceID;
      }
     }

    //  if (clickedSquareCoords && !toCoords.pieceOnThisSquare) {
    //   console.log(clickedSquareCoords)
         
    //  }  
  };


  //
  // Populate board with square co-ordinates.
  //
  // for (let i = 1; i < horizontalAxisSquares.length + 1; i++) {
  //   for (let j = 1; j < verticalAxisSquares.length + 1; j++) {
  //     const tileCount = j + i + 2;
  //     board.push({
  //       letter: horizontalAxisSquares[j],
  //       number: verticalAxisSquares[i],
  //       tileCount,
  //     });
  //   }
  // }
  return (
    <div id="chessboard" onMouseDown={(e) => grabPiece(e)}>
      {startingBoard.map((row, index) => {
        let outerCount = index;
        return (
          <React.Fragment key={index}>
            {row.map((square, index) => {
              const isPieceOnThisSquare = Boolean(square.pieceOnThisSquare);
              {/* if (isPieceOnThisSquare) {
                console.log(square.pieceOnThisSquare.id)
              } */}
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
                imageUrl={PieceStyles[isPieceOnThisSquare && square.pieceOnThisSquare.name]}
                isPieceOnThisSquare={isPieceOnThisSquare}
                playerColor={isPieceOnThisSquare && square.pieceOnThisSquare.color}
                handleClick={handleClick}
                pieceID={isPieceOnThisSquare && square.pieceOnThisSquare.id}
                handlePieceMove={handlePieceMove}
                square={square}
                squareClicked={firstSquareSelected}
                squareClickIndex={squareClickCoords}
                

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
