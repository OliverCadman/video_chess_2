import Square from "./Square";
import ChessPiece from "./Piece";
import { Chess } from "chess.js";

class ChessBoard {
  constructor(playerIsWhite) {
    this.playerIsWhite = playerIsWhite;
    this.chessBoard = this.createBoard();

    // Chess JS
    this.chess = new Chess();

    this.alphabetToX = {
      a: 0,
      b: 1,
      c: 2,
      d: 3,
      e: 4,
      f: 5,
      g: 6,
      h: 7
    }

    this.rankToY = {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5,
      7: 6,
      8: 7
    }
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
    const pawnPromoted = this.isPawnPromotion(pieceID, to);
    console.log(pawnPromoted)

    // Validate moves with chess.js
    const moveAttempt = pawnPromoted
      ? this.chess.move({
          from: fromSquareAlgebraNotation,
          to: toSquareAlgebraNotation,
          piece: pieceID[1],
          promotion: "q"
        })
      : this.chess.move({
          from: fromSquareAlgebraNotation,
          to: toSquareAlgebraNotation,
          piece: pieceID[1],
        });


    if (moveAttempt) {
      console.log("MOVE ATTEMPT", moveAttempt)
      currentBoard[to[1]][to[0]].setPiece(pieceToMove, "calling set board...");

      currentBoard[y][x].setPiece(null);

      this.setBoard(currentBoard);
    } else if (moveAttempt === null) {

      return;
    } else if (moveAttempt.flags === "c") {
      console.log("capture");
    } else if (moveAttempt.flags === "p" || moveAttempt.flags === "cp") {
      console.log("promotion");
      const color = pieceID[0];
      if (color === "w") {
        console.log("promotion!")
        currentBoard[to[1][0]].setPiece(
          new ChessPiece("queen", false, "wq2", "white")
        );
      }
    }

    const check = this.chess.inCheck();
    
    if (check) {
      return `${this.chess.turn()} in check`
    }

    //
    // Determine castling
    //

    const playerDidCastle = this.didCastle(moveAttempt);
    if (playerDidCastle) {
      // If player castled, update position of rook.
      const { fromX, toX, fromY, toY } = playerDidCastle;
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
    const threeFoldRepetition = this.chess.isThreefoldRepetition()
      ? true
      : false;

    if (threeFoldRepetition) return this.chess.turn() + threeFoldRepetition;
  }

  findPiece(currentBoard, pieceID) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (currentBoard[i][j].getPieceIDOnSquare() === pieceID) {
          return [j, i];
        }
      }
    }
  }

  canMovePiece(piece, squareThisPieceIsOn, x, y) {
    const moves = this.chess.moves({
      piece: piece,
      square: squareThisPieceIsOn,
      verbose: true
    })

    const availableMoves = [];

    for (let move of moves) {
        availableMoves.push([this.alphabetToX[move.to[0]], this.rankToY[move.to[1]]])
      }

    return availableMoves;
  }

 generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

  isPawnPromotion(pieceID, to) {
    console.log(pieceID, to)
    const res = pieceID[1] === "p" && (to[1] === 7 || to[1] === 0);
    console.log("res", res)
    if (res) {
      return true;
    } else {
      return false;
    }
  }

  didCastle(moveAttempt) {
    /**
     * Check for castling attempt.
     * If castle, return position and destination
     * co-ordinates of rooks, relative to
     * King-side or Queen side castling, and color.
     */

    const { from, to, piece } = moveAttempt;

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
            null,
            this.generateUUID()
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
