export const dfs = async (graph, diameter, animationSpeed, onUpdateVisited) => {
  const sleep = () => {
    return new Promise((resolve) => setTimeout(resolve, 100 - animationSpeed));
  };

  const visited = Array(diameter)
    .fill(false)
    .map(() => Array(diameter).fill(false));
  const prevNodeMap = {};

  const stack = [];
  stack.push({ row: 0, col: 0 });

  const isInsideGrid = (row, col) =>
    row >= 0 && col >= 0 && row < diameter && col < diameter;

  const neighbors = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  while (stack.length) {
    await sleep();
    const currentNode = stack.pop();

    if (visited[currentNode.row][currentNode.col]) continue;

    visited[currentNode.row][currentNode.col] = true;
    await onUpdateVisited(currentNode.row, currentNode.col);

    for (let [dx, dy] of neighbors) {
      const newRow = currentNode.row + dx;
      const newCol = currentNode.col + dy;

      if (
        isInsideGrid(newRow, newCol) &&
        !visited[newRow][newCol] &&
        graph[newRow][newCol] !== Infinity
      ) {
        stack.push({ row: newRow, col: newCol });
        prevNodeMap[`${newRow},${newCol}`] = currentNode;
      }
    }

    if (currentNode.row === diameter - 1 && currentNode.col === diameter - 1) {
      break;
    }
  }

  const path = [];
  let node = { row: diameter - 1, col: diameter - 1 };
  while (node) {
    path.push(node);
    node = prevNodeMap[`${node.row},${node.col}`];
  }

  return path;
};
