import { useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";
import Graph from "./Graph";

import { dijkstras } from "./dijkstra";
import { dfs } from "./dfs";
import { bfs } from "./bfs";

import { generateHeatmap, generateMaze, resetGraph } from "./graphGenerator";
import { resizeGraph } from "./resizeGraph";

import {
  LIGHT_GREEN,
  START_COLOR,
  FINISH_COLOR,
  colorToCostMapping,
} from "./colors";

function App() {
  const INITIAL_DIAMETER = 15;

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

  useEffect(() => {
    setGridstyle({
      display: "grid",
      gridTemplateColumns: `repeat(${diameter}, 1fr)`,
    });

    const resizedGraph = resizeGraph(graph, diameter);
    setGraph(resizedGraph);

    const initialVisited = Array(diameter)
      .fill(false)
      .map(() => Array(diameter).fill(false));
    setVisitedNodes(initialVisited);
  }, [diameter]);

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

  return (
    <>
      <div className="main-container">
        <h1>Pathfinding Visualizer</h1>
        <ControlPanel
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
          diameter={diameter}
          onDiameterChange={setDiameter}
          animationSpeed={animationSpeed}
          onSpeedChange={setAnimationSpeed}
          onGenerateMaze={() =>
            generateMaze(diameter, setShortestPathNodes, setGraph)
          }
          onGenerateTerrain={() =>
            generateHeatmap(diameter, setShortestPathNodes, setGraph)
          }
          onResetGraph={() =>
            resetGraph(diameter, setShortestPathNodes, setGraph)
          }
          animationRunning={animationRunning}
        />
        <button disabled={animationRunning} onClick={executeDijkstra}>
          Dijkstra's Algorithm
        </button>
        <button disabled={animationRunning} onClick={executeDFS}>
          Depth First Search
        </button>
        <button disabled={animationRunning} onClick={executeBFS}>
          Breadth First Search
        </button>
        <Graph
          diameter={diameter}
          gridStyle={gridStyle}
          graph={graph}
          visitedNodes={visitedNodes}
          shortestPathNodes={shortestPathNodes}
          handleVertexClick={handleVertexClick}
          setGridStyle={setGridstyle}
        />
        <div className="algorithm-info-container">
          <div className="algorithm-info">
            <h3>Dijkstra's Algorithm</h3>
            <p>
              Dijkstra's Algorithm is a graph search algorithm that finds the
              shortest path between a given source vertex and all other vertices
              in a weighted graph. It builds the path incrementally, favoring
              the nearest neighboring vertices first. The algorithm guarantees
              the shortest path for a graph with non-negative edge weights. In
              this visualization tool, you should choose "Create terrain" to
              craft a weighted graph. Without varying costs associated with
              reaching a node, Dijkstra's will perform identically to BFS.
            </p>
            <a
              className="info-link"
              href="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm"
            >
              Wikipedia
            </a>
          </div>

          <div className="algorithm-info">
            <h3>Depth-First Search (DFS):</h3>
            <p>
              DFS, or Depth-First Search, is a graph traversal algorithm that
              delves as far as possible along a branch before backtracking. From
              the initial vertex, it ventures deeper into the graph by visiting
              unexplored vertices and recursively diving further. While DFS
              doesn't guarantee the shortest path, it's instrumental in
              detecting cycles, classifying edges, and determining other graph
              properties. For an optimal visualization experience with DFS, opt
              for the "Create maze" option, as this algorithm cannot process
              weighted graphs effectively.
            </p>
            <a
              className="info-link"
              href="https://en.wikipedia.org/wiki/Depth-first_search"
            >
              Wikipedia
            </a>
          </div>

          <div className="algorithm-info">
            <h3>Breadth-First Search (BFS):</h3>
            <p>
              BFS, or Breadth-First Search, is a graph traversal algorithm that
              sequentially explores neighboring vertices based on their depth.
              Beginning from the source vertex, it evaluates all immediate
              neighbors before progressing to their respective neighbors, and so
              on. Notably, BFS assures the shortest path in unweighted graphs
              and serves to determine distances and identify cycles. For an
              insightful visualization of BFS in action, it's recommended to
              choose the "Create maze" option, especially since edge weights
              don't influence the BFS traversal pattern.
            </p>
            <a
              className="info-link"
              href="https://en.wikipedia.org/wiki/Breadth-first_search"
            >
              Wikipedia
            </a>
          </div>
        </div>
        <div className="footer">
          Designed and Developed by Alexander Engström, 2023
        </div>
      </div>
    </>
  );
}

export default App;
