import React, {useState, useEffect, useRef} from "react";
import "./Chessboard.css";
import ChessBoard from "../../Models/Board";
import Tile from "./Tile";

import PieceStyles from "../../assets/pieces/piece_styles";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Chessboard = () => {
  const [chessBoard, setChessBoard] = useState(new ChessBoard(true));
  const [moveMade, setMoveMade] = useState(false);

  const prevGameState = useRef(null);

  // useEffect(() => {
  //   prevGameState.current = chessBoard;
  //   console.log(prevGameState)
  // }, [])
  
  
  useEffect(() => {
    prevGameState.current = chessBoard;
    setMoveMade(false);

  }, [moveMade])


  const startingBoard = chessBoard.getBoard()

  const handlePieceMove = (pieceID, toCoords) => {
      console.log('TARGET SQUARE COORDS', toCoords);
        chessBoard.movePiece(pieceID, toCoords);
        setMoveMade(true);
   

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
