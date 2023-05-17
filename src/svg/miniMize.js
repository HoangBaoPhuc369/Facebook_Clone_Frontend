function MiniMize({ color }) {
  return (
    <svg width="26px" height="26px" viewBox="-4 -4 24 24">
      <line
        x1="2"
        x2="14"
        y1="8"
        y2="8"
        strokeLinecap="round"
        strokeWidth="2"
        stroke={color}
      ></line>
    </svg>
  );
}

export default MiniMize;
