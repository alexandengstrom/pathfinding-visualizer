import {
  colorToCostMapping,
  LIGHT_GREEN,
  START_COLOR,
  FINISH_COLOR,
} from "./colors";

export const resizeGraph = (graph, diameter) => {
  let newGraph = [...graph];

  if (newGraph.length < diameter) {
    while (newGraph.length < diameter) {
      newGraph.push(new Array(diameter).fill(colorToCostMapping[LIGHT_GREEN]));
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
        newGraph[i][j] = colorToCostMapping[LIGHT_GREEN];
      }
    }
  }

  newGraph[0][0] = colorToCostMapping[START_COLOR];
  newGraph[diameter - 1][diameter - 1] = colorToCostMapping[FINISH_COLOR];

  return newGraph;
};
