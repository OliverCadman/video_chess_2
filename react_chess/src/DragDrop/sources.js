import { ItemTypes } from "./constants";

const PieceSource = {
  beginDrag(props) {
    console.log(props);
    return {
      pieceID: props.pieceID,
    };
  },
};

export default PieceSource(ItemTypes.PIECE, PieceSource)();
