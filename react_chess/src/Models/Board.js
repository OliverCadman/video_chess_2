import Square from "./Square";
import ChessPiece from "./Piece";
import { Chess } from "chess.js";

class ChessBoard {
  constructor(playerIsWhite) {
    this.playerIsWhite = playerIsWhite;
    this.chessBoard = this.createBoard();

    // Chess JS
    this.chess = new Chess()
  }

  getBoard() {
    return this.chessBoard;
  }
  
  setBoard(newBoard) {
    this.chessBoard = newBoard;
  }

  movePiece(pieceID, to) {
    
    const currentBoard = this.getBoard();
    const pieceCoordinates = this.findPiece(currentBoard, pieceID);
  
    if (!pieceCoordinates) {
      return;
    }

    const x = pieceCoordinates[0];
    const y = pieceCoordinates[1];

    const fromSquareAlgebraNotation = currentBoard[y][x].notation;
    const toSquareAlgebraNotation = currentBoard[to[1]][to[0]].notation;

    const pieceToMove = currentBoard[y][x].getPiece();

    // Validate moves with chess.js
    const moveAttempt = this.chess.move({
      from: fromSquareAlgebraNotation,
      to: toSquareAlgebraNotation,
      piece: pieceID[1]
    });
    
    if (moveAttempt) {
        currentBoard[to[1]][to[0]].setPiece(
          pieceToMove,
          "calling set board..."
        );

        currentBoard[y][x].setPiece(null);

        this.setBoard(currentBoard);
    } else if (moveAttempt === null) {
      console.log('invalid move');
      return;
    } else if (moveAttempt.flags === "c") {
      console.log("capture")
    }

    //
    // Determine castling
    //

    const playerDidCastle = this.didCastle(moveAttempt);
    if (playerDidCastle) {

      // If player castled, update position of rook.
      const {fromX, toX, fromY, toY} = playerDidCastle;
      let castlingRook = currentBoard[fromY][fromX].getPiece();
      currentBoard[toY][toX].setPiece(castlingRook);
      currentBoard[fromY][fromX].setPiece(null);
    }


    //
    // Determine circumstances when game is over.
    //

    // Checkmate
    const checkMate = this.chess.isCheckmate() ? true : false;
    if (checkMate) return this.chess.turn() + checkMate;


    // Threefold repetition
    const threeFoldRepetition = this.chess.isThreefoldRepetition() ?
                                true : false;

    if (threeFoldRepetition) return this.chess.turn() + threeFoldRepetition;
  }

  findPiece(currentBoard, pieceID) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (currentBoard[i][j].getPieceIDOnSquare() === pieceID) {
          return [j, i]
        }
      }
    }
  }

  didCastle(moveAttempt) {

    /**
     * Check for castling attempt.
     * If castle, return position and destination
     * co-ordinates of rooks, relative to
     * King-side or Queen side castling, and color.
     */

    const {from, to, piece} = moveAttempt;

    if (piece === "k") {
      if (from === "e1" && to === "c1") {
        // White queenside castle
        return {
          didCastle: true,
          fromX: 0,
          toX: 3,
          fromY: 0,
          toY: 0,
        };
      } else if (from === "e1" && to === "g1") {
        // White kingside castle
        return {
          didCastle: true,
          fromX: 7,
          toX: 5,
          fromY: 0,
          toY: 0,
        };
      } else if (from === "e8" && to === "c8") {
        // Black queenside castle
        return {
          didCastle: true,
          fromX: 0,
          toX: 3,
          fromY: 7,
          toY: 7,
        };
      } else if (from === "e8" && to === "g8") {
        // Black kingside castle
        return {
          didCastle: true,
          fromX: 7,
          toX: 5,
          fromY: 7,
          toY: 7,
        };
      } else {
        return false;
      }
    } 
    return false;
  }



  createBoard() {
    const board = [];
    const horizontalAxisSquares = ["a", "b", "c", "d", "e", "f", "g", "h"];

    const verticalAxisSquares = ["1", "2", "3", "4", "5", "6", "7", "8"];

    // Populate board with square co-ordinates.
    for (let i = 0; i < horizontalAxisSquares.length; i++) {
      board.push([]);
      for (let j = 0; j < verticalAxisSquares.length; j++) {
        // console.log(j, i)
        board[i].push(
          new Square(
            j,
            i,
            horizontalAxisSquares[j] + verticalAxisSquares[i],
            null
          )
        );
      }
    }

    // Define the IDs of pieces on the backrank.
    const whiteBackRankId = [
      "wr1",
      "wn1",
      "wb1",
      "wq1",
      "wk1",
      "wb2",
      "wn2",
      "wr2",
    ];
    const blackBackRankId = [
      "br1",
      "bn1",
      "bb1",
      "bq1",
      "bk1",
      "bb2",
      "bn2",
      "br2",
    ];

    const backrank = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ];

    for (let i = 0; i < 8; i += 7) {
      for (let j = 0; j < 8; j++) {
        if (i === 0) {
          // Bottom (from white's perspective)
          board[i][this.playerIsWhite ? j : 7 - j].setPiece(
            new ChessPiece(
              backrank[j],
              false,
              this.playerIsWhite && whiteBackRankId[j],
              this.playerIsWhite && "white"
            )
          );
          board[i + 1][this.playerIsWhite ? j : 7 - j].setPiece(
            new ChessPiece(
              "pawn",
              false,
              this.playerIsWhite ? "wp" + (j + 1) : "bp" + i,
              this.playerIsWhite && "white"
            )
          );
        } else {
            // Top (from white's perspective)
          board[i - 1][this.playerIsWhite ? j : 7 - j].setPiece(
            new ChessPiece(
              "pawn",
              false,
              this.playerIsWhite ? "bp" + (j + 1) : "wp" + (j + 1),
              this.playerIsWhite && "black"

            )
          );
          board[i][this.playerIsWhite ? j : 7 - j].setPiece(
            new ChessPiece(
              backrank[j],
              false,
              this.playerIsWhite && blackBackRankId[j],
              this.playerIsWhite && "black"
            )
          );
        }
      }
    }

    return board;
  }
}

export default ChessBoard;
