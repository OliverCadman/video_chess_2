import React from 'react';
import './Chessboard.css'

const Overlay = ({color}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        zIndex: 1,
        opacity: 0.6,
        display: "grid",
        placeItems: "center"
      }}
    >
        <div className="circle">

        </div>
    </div>
  );
}

export default Overlay