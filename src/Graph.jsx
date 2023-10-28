import { useEffect, useState } from "react";
import Vertex from "./Vertex";
import ControlPanel from "./ControlPanel";

import { dijkstras } from "./dijkstra";
import { dfs } from "./dfs";
import { bfs } from "./bfs";
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
  costToColorMapping,
} from "./colors";

function Graph() {
  const INITIAL_DIAMETER = 25;

  const [diameter, setDiameter] = useState(INITIAL_DIAMETER);
  const [gridStyle, setGridstyle] = useState();
  const [animationRunning, setAnimationRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [selectedColor, setSelectedColor] = useState(LIGHT_GREEN);

  const initializeArray = (value) =>
    Array(diameter)
      .fill()
      .map(() => Array(diameter).fill(value));

  const [graph, setGraph] = useState(() => {
    let initialGraph = initializeArray(colorToCostMapping[LIGHT_GREEN]);
    initialGraph[0][0] = colorToCostMapping[START_COLOR];
    initialGraph[INITIAL_DIAMETER - 1][INITIAL_DIAMETER - 1] =
      colorToCostMapping[FINISH_COLOR];
    return initialGraph;
  });

  const [visitedNodes, setVisitedNodes] = useState(() =>
    initializeArray(false)
  );
  const [shortestPathNodes, setShortestPathNodes] = useState(() =>
    initializeArray(false)
  );

  const createExecutionAlgorithm = (algorithm) => async () => {
    setAnimationRunning(true);
    setShortestPathNodes(initializeArray(false));

    const shortestPath = await algorithm(
      graph,
      diameter,
      animationSpeed,
      async (row, col) => {
        return new Promise((resolve) => {
          setVisitedNodes((prevState) => {
            const newState = [...prevState];
            newState[row][col] = true;
            resolve(newState);
            return newState;
          });
        });
      }
    );

    setVisitedNodes(initializeArray(false));
    await displayShortestPath(shortestPath);
    setAnimationRunning(false);
  };

  const executeDijkstra = createExecutionAlgorithm(dijkstras);
  const executeDFS = createExecutionAlgorithm(dfs);
  const executeBFS = createExecutionAlgorithm(bfs);

  const displayShortestPath = async (shortestPath) => {
    for (let node of shortestPath) {
      await new Promise((resolve) => {
        setShortestPathNodes((prevPath) => {
          const newPath = [...prevPath];
          newPath[node.row][node.col] = true;
          resolve();
          return newPath;
        });
      });
      await new Promise((resolve) => setTimeout(resolve, 100 - animationSpeed));
    }
  };

  useEffect(() => {
    setGridstyle({
      display: "grid",
      gridTemplateColumns: `repeat(${diameter}, 1fr)`,
    });

    let newGraph = [...graph];

    if (newGraph.length < diameter) {
      while (newGraph.length < diameter) {
        newGraph.push(
          new Array(diameter).fill(colorToCostMapping[LIGHT_GREEN])
        );
      }
      newGraph.forEach((row) => {
        while (row.length < diameter) {
          row.push(colorToCostMapping[LIGHT_GREEN]);
        }
      });
    } else if (newGraph.length > diameter) {
      while (newGraph.length > diameter) {
        newGraph.pop();
      }
      newGraph.forEach((row) => {
        while (row.length > diameter) {
          row.pop();
        }
      });
    }

    for (let i = 0; i < newGraph.length; i++) {
      for (let j = 0; j < newGraph[i].length; j++) {
        if (
          newGraph[i][j] === colorToCostMapping[START_COLOR] ||
          newGraph[i][j] === colorToCostMapping[FINISH_COLOR]
        ) {
          newGraph[i][j] = colorToCostMapping["#99ff99"];
        }
      }
    }

    newGraph[0][0] = colorToCostMapping[START_COLOR];
    newGraph[diameter - 1][diameter - 1] = colorToCostMapping[FINISH_COLOR];

    setGraph(newGraph);

    const initialVisited = Array(diameter)
      .fill(false)
      .map(() => Array(diameter).fill(false));
    setVisitedNodes(initialVisited);
  }, [diameter]);

  const handleVertexClick = (row, col) => {
    if (
      (row === 0 && col === 0) ||
      (row === diameter - 1 && col === diameter - 1)
    ) {
      return;
    }
    const newGraph = [...graph];
    newGraph[row] = [...graph[row]];
    newGraph[row][col] = colorToCostMapping[selectedColor];
    setGraph(newGraph);
  };

  const generateMaze = () => {
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
        const randomNeighborIndex = Math.floor(
          Math.random() * neighbors.length
        );
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

  const generateHeatmap = () => {
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

  const resetGraph = () => {
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

  return (
    <div className="main-container">
      <h1>Pathfinding Visualizer</h1>
      <ControlPanel
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
        diameter={diameter}
        onDiameterChange={setDiameter}
        animationSpeed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
        onGenerateMaze={generateMaze}
        onGenerateTerrain={generateHeatmap}
        onResetGraph={resetGraph}
        animationRunning={animationRunning}
      />
      <button disabled={animationRunning} onClick={executeDijkstra}>
        Dijkstra's Algorithm
      </button>
      <button disabled={animationRunning} onClick={executeBFS}>
        Breadth First Search
      </button>
      <button disabled={animationRunning} onClick={executeDFS}>
        Depth First Search
      </button>
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
      <div className="footer">
        Designed and Developed by Alexander Engström, 2023
      </div>
    </div>
  );
}

export default Graph;
