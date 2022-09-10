export const collect = (connect, monitor) => {
  return {
    highlighted: monitor.canDrop(),
    hovered: monitor.isOver(),
    connectDropTarget: connect.dropTarget(),
  };
};
