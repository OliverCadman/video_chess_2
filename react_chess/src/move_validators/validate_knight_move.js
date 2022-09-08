export const isKnightMoveValid = (x, y, toX, toY) => {
    console.log("x:",x,"y:", y, "toX:", toX, "toY:", toY)
  const dx = toX - x;
  const dy = toY - y;

  console.log(dx, dy)

  return (
    (Boolean(Math.abs(dx) === 2 && Math.abs(dy) === 1)) ||
    (Boolean(Math.abs(dy === 2) && Math.abs(dx) === 1))
  );
};
