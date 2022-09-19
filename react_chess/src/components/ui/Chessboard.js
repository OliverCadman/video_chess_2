import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import "./Chessboard.css";
import ChessBoard from "../../Models/Board";
import Tile from "./Tile";

import { ColorContext } from "../../context/ColorContext";

import PieceStyles from "../../assets/pieces/piece_styles";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { socket } from "../../connections/socket";

const ChessGame = ({gameID}) => {

  const color = useContext(ColorContext);

  const [chessBoard, setChessBoard] = useState(new ChessBoard(color.isCreator));
  const [moveMade, setMoveMade] = useState(false);
  const [whiteInCheck, setWhiteInCheck] = useState(false);
  const [blackInCheck, setBlackInCheck] = useState(false);
  const [whiteTurnToMove, setWhiteTurnToMove] = useState(true);

  const prevGameState = useRef(null);


  useEffect(() => {
    socket.on("opponent move", (move) => {
      if (move.playerThatMadeMoveIsWhite !== color.isCreator) {
        handlePieceMove(move.pieceID, move.toCoords, false, "from opponent move");
        setWhiteTurnToMove(!move.playerThatMadeMoveIsWhite);
      }
    }, [socket]);


  }, [])

  useEffect(() => {
    prevGameState.current = chessBoard;
    setMoveMade(false);
  }, [moveMade]);



  const startingBoard = chessBoard.getBoard();

  const handlePieceMove = (pieceID, toCoords, isMyMove) => {

    const move = chessBoard.movePiece(pieceID, toCoords, isMyMove);

    let whiteKingInCheck;
    let blackKingInCheck;
    let whiteMated;
    let blackMated;

    if (move === "w in check") {
      whiteKingInCheck = true;
    } else if (move === "b in check") {
      blackKingInCheck = true;
    }
    if (isMyMove) {
      socket.emit("new move", {
        nextPlayerToMove: !chessBoard.playerIsWhite,
        playerThatMadeMoveIsWhite: chessBoard.playerIsWhite,
        pieceID: pieceID,
        toCoords,
        gameID,
      });

    }
    
    setChessBoard(chessBoard);
    setMoveMade(true);
    setBlackInCheck(blackKingInCheck);
    setWhiteInCheck(whiteKingInCheck);
    setWhiteTurnToMove(!color);

  };

  const endDrag = (pieceID, toCoords) => {
    handlePieceMove(pieceID, toCoords, true);
  }

  const canMovePiece = (pieceID, fromCoords, x, y) => {
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
    <div className="chessboard-wrapper">
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
                      isWhite={
                        isPieceOnThisSquare && (square.getPiece().color === "white")
                      }
                      isPlayerWhite={color.isCreator}
                      pieceID={
                        isPieceOnThisSquare && square.pieceOnThisSquare.id
                      }
                      endDrag={endDrag}
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
    </div>
  );
};

const ChessBoardWrapper = () => {
  const [opponentUserName, setOpponentUserName] = useState('');
  const { gameid } = useParams();


  useEffect(() => {
    socket.on('playerJoinedGame', data => {
      setOpponentUserName(data.opponentUserName);
    socket.on('disconnected', () => {
      socket.emit('deleteGame', gameid)
    })
    }, [socket])

    return () => {
      socket.off('playerJoinedGame');
    }
  })
  return (
    <ChessGame gameID={gameid}/>
  )
};


export default ChessBoardWrapper;


