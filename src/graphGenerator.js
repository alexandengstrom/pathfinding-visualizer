import {
  LIGHT_GREEN,
  START_COLOR,
  FINISH_COLOR,
  BLACK,
  DARK_RED,
  LIGHT_RED,
  ORANGE,
  YELLOW,
  colorToCostMapping,
} from "./colors";

export const generateMaze = (diameter, setShortestPathNodes, setGraph) => {
  const newGraph = Array(diameter)
    .fill()
    .map(() => Array(diameter).fill(colorToCostMapping[BLACK]));

  const initialPath = Array(diameter)
    .fill(false)
    .map(() => Array(diameter).fill(false));

  setShortestPathNodes(initialPath);

  const isCellValid = (x, y) =>
    x >= 0 && y >= 0 && x < diameter && y < diameter;

  const getUnvisitedNeighbors = (x, y) => {
    const directions = [
      [0, 2],
      [2, 0],
      [0, -2],
      [-2, 0],
    ];
    return directions
      .map((dir) => [x + dir[0], y + dir[1]])
      .filter(
        ([nx, ny]) =>
          isCellValid(nx, ny) && newGraph[ny][nx] === colorToCostMapping[BLACK]
      );
  };

  const stack = [[0, 0]];
  newGraph[0][0] = colorToCostMapping[LIGHT_GREEN];

  while (stack.length > 0) {
    const [x, y] = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(x, y);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];

      newGraph[y + (ny - y) / 2][x + (nx - x) / 2] =
        colorToCostMapping[LIGHT_GREEN];
      newGraph[ny][nx] = colorToCostMapping[LIGHT_GREEN];
      stack.push([nx, ny]);
    }
  }

  newGraph[0][0] = colorToCostMapping[START_COLOR];
  newGraph[diameter - 1][diameter - 1] = colorToCostMapping[FINISH_COLOR];
  setGraph(newGraph);
};

export const generateHeatmap = (diameter, setShortestPathNodes, setGraph) => {
  const terrain = Array(diameter)
    .fill()
    .map(() => Array(diameter).fill(LIGHT_GREEN));

  const initialPath = Array(diameter)
    .fill(false)
    .map(() => Array(diameter).fill(false));

  setShortestPathNodes(initialPath);

  const clusterCount = Math.floor(Math.random() * (diameter / 2) + 5);
  const minDistance = diameter / 6;

  for (let i = 0; i < clusterCount; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * diameter);
      y = Math.floor(Math.random() * diameter);
    } while (
      Math.sqrt(x * x + y * y) < minDistance ||
      Math.sqrt((diameter - x) ** 2 + (diameter - y) ** 2) < minDistance
    );

    const clusterRadius = Math.floor(Math.random() * (diameter / 5) + 2);

    for (let dx = -clusterRadius; dx <= clusterRadius; dx++) {
      for (let dy = -clusterRadius; dy <= clusterRadius; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);

        if (nx >= 0 && ny >= 0 && nx < diameter && ny < diameter) {
          if (distanceToCenter <= clusterRadius / 4) terrain[ny][nx] = DARK_RED;
          else if (distanceToCenter <= (2 * clusterRadius) / 4)
            terrain[ny][nx] = LIGHT_RED;
          else if (distanceToCenter <= (3 * clusterRadius) / 4)
            terrain[ny][nx] = ORANGE;
          else if (distanceToCenter < clusterRadius) terrain[ny][nx] = YELLOW;
        }
      }
    }
  }

  const terrainCosts = terrain.map((row) =>
    row.map((color) => colorToCostMapping[color])
  );
  terrainCosts[0][0] = colorToCostMapping[START_COLOR];
  terrainCosts[diameter - 1][diameter - 1] = colorToCostMapping[FINISH_COLOR];

  setGraph(terrainCosts);
};

export const resetGraph = (diameter, setShortestPathNodes, setGraph) => {
  const initialGraph = Array(diameter)
    .fill()
    .map(() => Array(diameter).fill(colorToCostMapping[LIGHT_GREEN]));
  setGraph(initialGraph);

  initialGraph[0][0] = colorToCostMapping[START_COLOR];
  initialGraph[diameter - 1][diameter - 1] = colorToCostMapping[FINISH_COLOR];

  const initialVisitedNodes = Array(diameter)
    .fill(false)
    .map(() => Array(diameter).fill(false));

  const initialPath = Array(diameter)
    .fill(false)
    .map(() => Array(diameter).fill(false));

  setShortestPathNodes(initialPath);
};
