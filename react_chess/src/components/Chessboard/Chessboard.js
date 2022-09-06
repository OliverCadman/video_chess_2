import React from "react";
import "./Chessboard.css";

const horizontalAxisSquares = ["a", "b", "c", "d", "e", "f", "g", "h"];

const verticalAxisSquares = ["1", "2", "3", "4", "5", "6", "7", "8"];

const Chessboard = () => {

  let board = [];

  // Populate board with square co-ordinates.
  for (let i = 0; i < horizontalAxisSquares.length; i++) {
    for (let j = 0; j < verticalAxisSquares.length; j++) {
      const tileCount = j + i + 2;
      board.push({
        letter: horizontalAxisSquares[j],
        number: verticalAxisSquares[i],
        tileCount,
      });
    }
  }
  return (
    <div id="chessboard">
      {board.map((tile, index) => {
        return (
          <div
            key={index}
            className={tile.tileCount % 2 === 0 ? "tile light" : "tile dark"}
          >
            {/* Render letters on first rank only, and numbers on 'h' rank going up board. */}
            <span className="tile-content letter">
              {index < 8 && tile.letter}
            </span>
            <span className="tile-content number">
              {index % 8 === 7 && tile.number}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Chessboard;
