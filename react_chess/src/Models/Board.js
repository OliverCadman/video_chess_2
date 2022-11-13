/**
 * TODO: SOCKET IO RECEIVERS:
 *             En Passant
 *             Castling (only from opponent's perspective)
 *             
 *             
 */

import Square from "./Square";
import ChessPiece from "./Piece";
import { Chess } from "chess.js";

class ChessBoard {
  constructor(playerIsWhite) {
    this.playerIsWhite = playerIsWhite;

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
      h: 7,
    };

    this.rankToY = {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5,
      7: 6,
      8: 7,
    };

    this.fromCoordinates = {
      0: 1,
      1: 2,
      2: 3,
      3: 4,
      4: 5,
      5: 6,
      6: 7,
      7: 8,
    };

    this.fromAlphabet = {
      0: "a",
      1: "b",
      2: "c",
      3: "d",
      4: "e",
      5: "f",
      6: "g",
      7: "h",
    };

    this.chessBoard = this.createBoard(this.alphabetToX, this.rankToY);
  }

  getBoard() {
    return this.chessBoard;
  }

  setBoard(newBoard) {
    this.chessBoard = newBoard;
  }

  convertBoardCoords(coords) {
    return [7 - coords[0], 7 - coords[1]]
  }

  movePiece(pieceID, to, isMyMove) {

    const currentBoard = this.getBoard();
    const pieceCoordinates = this.findPiece(currentBoard, pieceID);

    if (!pieceCoordinates) {
      return;
    }
    const x = pieceCoordinates[0];
    const y = pieceCoordinates[1];

    const fromSquareAlgebraNotation = currentBoard[y][x].notation;
    const toSquareAlgebraNotation = this.playerIsWhite ? this.toChessMove([to[0], to[1]]) : currentBoard[to[0]][to[1]].notation;
    const pieceToMove = currentBoard[y][x].getPiece();
    const pawnPromoted = this.isPawnPromotion(pieceID, to);

    // Validate moves with chess.js
    let moveAttempt;

    if (this.playerIsWhite) {
      if (isMyMove) {
        moveAttempt = pawnPromoted
          ? this.chess.move({
              from: fromSquareAlgebraNotation,
              to: toSquareAlgebraNotation,
              piece: pieceID[1],
              promotion: "q",
            })
          : this.chess.move({
              from: fromSquareAlgebraNotation,
              to: toSquareAlgebraNotation,
              piece: pieceID[1],
            });
      } else {
        moveAttempt = pawnPromoted
          ? this.chess.move({
              from: fromSquareAlgebraNotation,
              to: this.toChessMove([7 - to[0], 7 - to[1]]),
              piece: pieceID[1],
              promotion: "q",
            })
          : this.chess.move({
              from: fromSquareAlgebraNotation,
              to: this.toChessMove([7 - to[0], 7 - to[1]]),
              piece: pieceID[1],
            });
      }
    } else {
      if (isMyMove) {
        moveAttempt = pawnPromoted
          ? this.chess.move({
              from: fromSquareAlgebraNotation,
              to: this.toChessMove([7 - to[0], 7 - to[1]]),
              piece: pieceID[1],
              promotion: "q",
            })
          : this.chess.move({
              from: fromSquareAlgebraNotation,
              to: this.toChessMove([7 - to[0], 7 - to[1]]),
              piece: pieceID[1],
            });
      } else {
        moveAttempt = pawnPromoted
          ? this.chess.move({
              from: fromSquareAlgebraNotation,
              to: this.toChessMove([to[0], to[1]]),
              piece: pieceID[1],
              promotion: "q",
            })
          : this.chess.move({
              from: fromSquareAlgebraNotation,
              to: this.toChessMove([to[0],to[1]]),
              piece: pieceID[1],
            });
      }
    }

    
    
    if (!moveAttempt) return;

    console.log('MOVE ATTEMPT', moveAttempt);
    
    if (isMyMove) {
        currentBoard[to[1]][to[0]].setPiece(pieceToMove);
      } else {
        const [x, y] = this.convertBoardCoords(to);
        currentBoard[y][x].setPiece(pieceToMove);
      }

      currentBoard[y][x].setPiece(null);
      this.setBoard(currentBoard);

    switch (moveAttempt.flags) {
      case "e":
        const move = moveAttempt.to;
        const x = this.alphabetToX[move[0]];
        console.log(x, this.convertBoardCoords)
        let y;

        if (moveAttempt.color === "w") {
           y = parseInt(move[1], 10) - 2;
         } else {
           y = parseInt(move[1], 10) + 2;
         }
        
        if (isMyMove) {
           currentBoard[y][x].setPiece(null);
        } else {
          const [convertedX, convertedY] = this.convertBoardCoords([x, y]);
          currentBoard[convertedY][convertedX].setPiece(null);
        }
        break;
      case "p":
        console.log("promotion");
        setPromotion("w", currentBoard, to);
        break;
      case "cp":
        console.log("Promotion with capture");
        setPromotion("w", currentBoard, to);
        break;
      case "b":
        console.log("Double pawn push");
        break;
      case "n":
        console.log("Move without capture");
      case "c":
        console.log("Capture");
      default:
        break;
    }

    const check = this.chess.inCheck();

    if (check) {
      return `${this.chess.turn()} in check`;
    }

    //
    // Determine castling
    //

    const playerDidCastle = this.didCastle(moveAttempt);
    if (playerDidCastle) {
      // If player castled, update position of rook.
      let castlingRook;
      let { fromX, toX, fromY, toY } = playerDidCastle;
      if (isMyMove) {
        console.log('MY CASTLE ATTEMPT', playerDidCastle);
        console.group('COORDS');
        console.log('fromX', fromX)
        console.log('fromY', fromY)
        console.log('toX', toX)
        console.log('toY', toY)
        console.groupEnd();
      castlingRook = currentBoard[fromY][fromX].getPiece();
      currentBoard[toY][toX].setPiece(castlingRook);
      currentBoard[fromY][fromX].setPiece(null);
      } else {
        const [convertedFromX, convertedFromY] = this.convertBoardCoords([fromX, fromY]);
        const [convertedToX, convertedToY] = this.convertBoardCoords([toX, toY]);
        console.log('OPPONENT CASTLE ATTEMPT', playerDidCastle);
        console.log('CONVERTED FROM', this.convertBoardCoords([fromX, fromY]))
        console.log('CONVERTED TO', this.convertBoardCoords([toX, toY]))
         castlingRook = currentBoard[convertedFromY][convertedFromX].getPiece();
         currentBoard[convertedToY][convertedToX].setPiece(castlingRook);
         currentBoard[convertedFromY][convertedFromX].setPiece(null);
      }
     
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
  

  toChessMove(finalPosition) {
    /*
      Convert the co-ordinates passed as arguments
      into a format readable by the chess.js object.
    */

    const move =
      this.fromAlphabet[finalPosition[0]] +
      this.fromCoordinates[finalPosition[1]];

    return move;
  }

  findPiece(currentBoard, pieceID, message) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (currentBoard[i][j].getPieceIDOnSquare() === pieceID) {
          return [currentBoard[i][j].x, currentBoard[i][j].y];
        }
      }
    }

    // const squareOnRow = currentBoard.map((row) => {
    //   return row.reduce((array, square) => {
    //     if (square.getPieceIDOnSquare() === pieceID) {
    //       array.push(square);
    //     }

    //     return array;
    //   }, [])
    // })

    // const specificSquare = squareOnRow.filter(square => square.length !== 0);

    // return [specificSquare[0][0].x, specificSquare[0][0].y]
  }

  canMovePiece(piece, squareThisPieceIsOn, x, y) {
    const moves = this.chess.moves({
      piece: piece,
      square: squareThisPieceIsOn,
      verbose: true,
    });

    // console.group("AVAILABLE MOVES");
    // console.log(moves);
    // console.groupEnd();

    const availableMoves = [];

    for (let move of moves) {
      const [x, y] = [this.alphabetToX[move.to[0]], this.rankToY[move.to[1]]];
      const [blackX,  blackY] = this.convertBoardCoords([x, y]);
      availableMoves.push([
        this.playerIsWhite ? x : blackX,
        this.playerIsWhite ? y : blackY
      ]);
    }

    return availableMoves;
  }

  generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : r & (0x3 | 0x8)).toString(16);
      }
    );
  }

  isPawnPromotion(pieceID, to) {
    const res = pieceID[1] === "p" && (to[1] === 7 || to[1] === 0);
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

  createBoard(alphabetToX, rankToY) {
    const board = [];
    const horizontalAxisSquares = this.playerIsWhite
      ? ["a", "b", "c", "d", "e", "f", "g", "h"]
      : ["h", "g", "f", "e", "d", "c", "b", "a"];

    const verticalAxisSquares = this.playerIsWhite
      ? ["1", "2", "3", "4", "5", "6", "7", "8"]
      : ["8", "7", "6", "5", "4", "3", "2", "1"];

    // Populate board with square co-ordinates.
    for (let i = 0; i < horizontalAxisSquares.length; i++) {
      board.push([]);
      for (let j = 0; j < verticalAxisSquares.length; j++) {
        const xAxisLetters = horizontalAxisSquares[j];
        const yAxisNumbers = verticalAxisSquares[i];
        const [blackX, blackY] = this.convertBoardCoords([j, i])
        const normalizedCoordinates = [(j + 1) * 82 + 15, (i + 1) * 82 + 15];
        board[i].push(
          new Square(
            j,
            i,
            horizontalAxisSquares[j] + verticalAxisSquares[i],
            null,
            this.generateUUID(),
            normalizedCoordinates
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
              this.playerIsWhite ? whiteBackRankId[j] : blackBackRankId[j],
              this.playerIsWhite ? "white" : "black"
            )
          );
          board[i + 1][this.playerIsWhite ? j : 7 - j].setPiece(
            new ChessPiece(
              "pawn",
              false,
              this.playerIsWhite ? "wp" + (j + 1) : "bp" + (j + 1),
              this.playerIsWhite ? "white" : "black"
            )
          );
        } else {
          // Top (from white's perspective)
          board[i - 1][this.playerIsWhite ? j : 7 - j].setPiece(
            new ChessPiece(
              "pawn",
              false,
              this.playerIsWhite ? "bp" + (j + 1) : "wp" + (j + 1),
              this.playerIsWhite ? "black" : "white"
            )
          );
          board[i][this.playerIsWhite ? j : 7 - j].setPiece(
            new ChessPiece(
              backrank[j],
              false,
              this.playerIsWhite ? blackBackRankId[j] : whiteBackRankId[j],
              this.playerIsWhite ? "black" : "white"
            )
          );
        }
      }
    }

    return board;
  }
}

const setPromotion = (color, board, to) => {
  if (color === "w") {
    console.log("promotion!");
    board[to[1][0]].setPiece(new ChessPiece("queen", false, "wq2", "white"));
  }
}; 

export default ChessBoard;
