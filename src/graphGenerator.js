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
    const dirs = [
      [0, 2],
      [2, 0],
      [0, -2],
      [-2, 0],
    ];
    const neighbors = [];
    for (let dir of dirs) {
      const newX = x + dir[0];
      const newY = y + dir[1];
      if (
        isCellValid(newX, newY) &&
        newGraph[newY][newX] === colorToCostMapping[BLACK]
      ) {
        neighbors.push([newX, newY]);
      }
    }
    return neighbors;
  };

  const stack = [];
  const startX = 0;
  const startY = 0;
  newGraph[startY][startX] = colorToCostMapping[LIGHT_GREEN];
  stack.push([startX, startY]);

  while (stack.length > 0) {
    const [x, y] = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(x, y);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const randomNeighborIndex = Math.floor(Math.random() * neighbors.length);
      const [nx, ny] = neighbors[randomNeighborIndex];

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

  const numberOfClusters = Math.floor(Math.random() * (diameter / 2) + 5);

  const safeDistance = diameter / 6;

  for (let i = 0; i < numberOfClusters; i++) {
    let x, y;

    do {
      x = Math.floor(Math.random() * diameter);
      y = Math.floor(Math.random() * diameter);
    } while (
      Math.sqrt(x * x + y * y) < safeDistance ||
      Math.sqrt(
        (diameter - x) * (diameter - x) + (diameter - y) * (diameter - y)
      ) < safeDistance
    );

    const clusterRadius = Math.floor(Math.random() * (diameter / 5) + 2);

    for (let dx = -clusterRadius; dx <= clusterRadius; dx++) {
      for (let dy = -clusterRadius; dy <= clusterRadius; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < diameter && ny < diameter) {
          const distanceToCenter = Math.sqrt(dx * dx + dy * dy);

          if (distanceToCenter <= clusterRadius / 4) {
            terrain[ny][nx] = DARK_RED;
          } else if (distanceToCenter <= (2 * clusterRadius) / 4) {
            terrain[ny][nx] = LIGHT_RED;
          } else if (distanceToCenter <= (3 * clusterRadius) / 4) {
            terrain[ny][nx] = ORANGE;
          } else if (distanceToCenter < clusterRadius) {
            terrain[ny][nx] = YELLOW;
          }
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

  const initialVisited = Array(diameter)
    .fill(false)
    .map(() => Array(diameter).fill(false));
  setVisitedNodes(initialVisited);

  const initialPath = Array(diameter)
    .fill(false)
    .map(() => Array(diameter).fill(false));
  setShortestPathNodes(initialPath);
};
