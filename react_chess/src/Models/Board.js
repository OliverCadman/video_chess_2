import Square from "./Square";
import ChessPiece from "./Piece";

class ChessBoard {
  constructor(playerIsWhite) {
    this.playerIsWhite = playerIsWhite;
    this.startingBoard = this.createBoard();
  }

  getStartingBoard() {
    return this.startingBoard;
  }

  createBoard() {
    const board = [];
    const horizontalAxisSquares = ["a", "b", "c", "d", "e", "f", "g", "h"];

    const verticalAxisSquares = ["1", "2", "3", "4", "5", "6", "7", "8"];

    // Populate board with square co-ordinates.
    for (let i = 0; i < horizontalAxisSquares.length; i++) {
      board.push([]);
      for (let j = 0; j < verticalAxisSquares.length; j++) {
        const tileCount = j + i + 2;
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
