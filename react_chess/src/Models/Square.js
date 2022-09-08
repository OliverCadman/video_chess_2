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

  setPiece(newPiece, message) {
    if (newPiece === null && this.pieceOnThisSquare === null) {
      // console.log('everything is null')
      return;
    } else if (newPiece === null) {
      // console.log('new piece is null')
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
    // console.log(this)
    if (this.pieceOnThisSquare === null) {
      return "square is empty";
    } else {
      return this.pieceOnThisSquare.id;
    }
  }

  getPiece() {
    return this.pieceOnThisSquare;
  }
}

export default Square;