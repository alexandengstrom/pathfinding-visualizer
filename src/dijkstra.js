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
  onUpdateVisited,
  visualizeSteps = true
) => {
  const isInsideGrid = (row, col) =>
    row >= 0 && col >= 0 && row < diameter && col < diameter;

  const sleep = async () => {
    if (visualizeSteps) {
      return new Promise((resolve) =>
        setTimeout(resolve, 100 - animationSpeed)
      );
    }
  };

  const distances = Array.from({ length: diameter }, () =>
    Array(diameter).fill(Infinity)
  );
  const visited = Array.from({ length: diameter }, () =>
    Array(diameter).fill(false)
  );

  const start = { row: 0, col: 0 };
  const target = { row: diameter - 1, col: diameter - 1 };
  distances[start.row][start.col] = 0;

  const neighbors = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  let prevNodeMap = {};

  const priorityQueue = new Heap((a, b) => a.distance - b.distance);
  priorityQueue.push(new Node(start.row, start.col, 0));

  while (!priorityQueue.empty()) {
    const currentNode = priorityQueue.pop();

    if (visited[currentNode.row][currentNode.col]) continue;

    if (currentNode.row === target.row && currentNode.col === target.col) {
      break;
    }

    visited[currentNode.row][currentNode.col] = true;
    if (visualizeSteps) {
      await onUpdateVisited(currentNode.row, currentNode.col);
    }
    await sleep();

    for (let [dx, dy] of neighbors) {
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
    let currentNode = target;
    const path = [];
    while (currentNode && (currentNode.row !== 0 || currentNode.col !== 0)) {
      path.push(currentNode);
      currentNode = prevNodeMap[`${currentNode.row},${currentNode.col}`];
    }
    path.push(start);
    return path;
  };

  return backtrackShortestPath(distances, prevNodeMap);
};
