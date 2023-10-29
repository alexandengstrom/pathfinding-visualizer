import Vertex from "./Vertex";
import { costToColorMapping } from "./colors";

function Graph({
  diameter,
  gridStyle,
  graph,
  visitedNodes,
  shortestPathNodes,
  handleVertexClick,
}) {
  return (
    <div className="grid-board" style={gridStyle}>
      {Array.from({ length: diameter * diameter }).map((_, index) => {
        const row = Math.floor(index / diameter);
        const col = index % diameter;
        const vertexColor = graph[row] && costToColorMapping[graph[row][col]];
        const isVisited = visitedNodes[row] && visitedNodes[row][col];
        const isOnShortestPath =
          shortestPathNodes[row] && shortestPathNodes[row][col];

        return (
          <Vertex
            key={index}
            color={vertexColor}
            isVisited={isVisited}
            isOnShortestPath={isOnShortestPath}
            onClick={() => handleVertexClick(row, col)}
          />
        );
      })}
    </div>
  );
}

export default Graph;
