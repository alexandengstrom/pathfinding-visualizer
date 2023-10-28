function Vertex({ color, onClick, isVisited, isOnShortestPath }) {
  const handleClick = () => {
    onClick && onClick();
  };

  return (
    <div
      className="grid-item"
      style={{ backgroundColor: color }}
      onClick={handleClick}
    >
      {isVisited && <div className="visited-indicator"></div>}
      {isOnShortestPath && <div className="shortest-path-indicator"></div>}
    </div>
  );
}

export default Vertex;
