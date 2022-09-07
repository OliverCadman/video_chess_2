class ChessPiece {
    constructor(name, isAttacked, id) {
        this.name = name;
        this.isAttacked = isAttacked;
        this.id = id;
    }

    setSquare(newSquare) {
        if (newSquare === undefined) {
            this.occupiedSquare = newSquare;
            return;
        }

        if (this.occupiedSquare === undefined) {
            this.occupiedSquare = newSquare;
            newSquare.setPiece(this);
        }

        const isOccupiedSquareDifferent = this.occupiedSquare.x !== newSquare.x || 
                                          this.occupiedSquare.y !== newSquare.y

        if (isOccupiedSquareDifferent) {
            this.occupiedSquare = newSquare;
            newSquare.setPiece(this);
        }

    }

}

export default ChessPiece;