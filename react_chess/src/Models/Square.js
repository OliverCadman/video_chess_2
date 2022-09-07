class Square {
  /*
        Represents each single square on the chess board.

        Attributes:
            x co-ordinate
            y co-ordinate
            The piece on the square (if any)
            The co-ordinates in pixels
    */
  constructor(x, y, notation, pieceOnThisSquare) {
    this.x = x;
    this.y = y;
    this.notation = notation;
    this.pieceOnThisSquare = pieceOnThisSquare;
  }

  setPiece(newPiece) {
    if (newPiece === null && this.pieceOnThisSquare === null) {
      return;
    } else if (newPiece === null) {
      this.pieceOnThisSquare.setSquare(undefined);
      this.pieceOnThisSquare = null;
    } else if (this.pieceOnThisSquare === null) {
      this.pieceOnThisSquare = newPiece;
      newPiece.setSquare(this);
    } else if (
      this.getPieceIDOnSquare() !== newPiece.id &&
      this.pieceOnThisSquare.color !== newPiece.color
    ) {
      this.pieceOnThisSquare = newPiece;
      newPiece.setSquare(this);
    }
  }

  getPieceIDOnSquare() {
    if (this.pieceOnThisSquare === null) {
      return "square is empty";
    } else {
      return this.pieceOnThisSquare.id;
    }
  }
}

export default Square;