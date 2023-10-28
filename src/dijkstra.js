import Heap from "heap";

class Node {
  constructor(row, col, distance) {
    this.row = row;
    this.col = col;
    this.distance = distance;
  }
}

export const dijkstras = async (
  graph,
  diameter,
  animationSpeed,
  onUpdateVisited
) => {
  const isInsideGrid = (row, col) =>
    row >= 0 && col >= 0 && row < diameter && col < diameter;

  const sleep = () => {
    return new Promise((resolve) => setTimeout(resolve, 100 - animationSpeed));
  };

  let distances = Array(diameter)
    .fill(Infinity)
    .map(() => Array(diameter).fill(Infinity));
  let visited = Array(diameter)
    .fill(false)
    .map(() => Array(diameter).fill(false));

  const start = { row: 0, col: 0 };
  const target = { row: diameter - 1, col: diameter - 1 };
  distances[start.row][start.col] = 0;
  let prevNodeMap = {};

  const neighbors = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const priorityQueue = new Heap((a, b) => a.distance - b.distance);
  priorityQueue.push(new Node(start.row, start.col, 0));

  while (!priorityQueue.empty()) {
    await sleep();

    const currentNode = priorityQueue.pop();

    if (visited[currentNode.row][currentNode.col]) continue;

    if (currentNode.row === target.row && currentNode.col === target.col) {
      break;
    }

    visited[currentNode.row][currentNode.col] = true;
    await onUpdateVisited(currentNode.row, currentNode.col);
    await sleep();

    for (let i = 0; i < neighbors.length; i++) {
      const [dx, dy] = neighbors[i];
      const newRow = currentNode.row + dx;
      const newCol = currentNode.col + dy;

      if (isInsideGrid(newRow, newCol) && !visited[newRow][newCol]) {
        const newDistance =
          distances[currentNode.row][currentNode.col] + graph[newRow][newCol];
        if (newDistance < distances[newRow][newCol]) {
          distances[newRow][newCol] = newDistance;
          prevNodeMap[`${newRow},${newCol}`] = currentNode;
          priorityQueue.push(new Node(newRow, newCol, newDistance));
        }
      }
    }
  }

  const backtrackShortestPath = (distances, prevNodeMap) => {
    let currentNode = { row: diameter - 1, col: diameter - 1 };
    const path = [];
    while (currentNode && (currentNode.row !== 0 || currentNode.col !== 0)) {
      path.push(currentNode);
      currentNode = prevNodeMap[`${currentNode.row},${currentNode.col}`];
    }
    path.push({ row: 0, col: 0 });
    return path;
  };

  const shortestPath = backtrackShortestPath(distances, prevNodeMap);
  return shortestPath;
};
