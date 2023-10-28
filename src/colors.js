export const LIGHT_GREEN = "#90EE90";
export const MIL_GREEN = "#ACB334";
export const YELLOW = "#FAB733";
export const ORANGE = "#FF8E15";
export const LIGHT_RED = "#FF4E11";
export const DARK_RED = "#FF0D0D";
export const BLACK = "#000000";
export const START_COLOR = "#247AFD";
export const FINISH_COLOR = "#247AFD";

export const colors = [
  LIGHT_GREEN,
  MIL_GREEN,
  YELLOW,
  ORANGE,
  LIGHT_RED,
  DARK_RED,
  BLACK,
];

export const colorToCostMapping = {
  "#90EE90": 1,
  "#ACB334": 3,
  "#FAB733": 5,
  "#FF8E15": 7,
  "#FF4E11": 10,
  "#FF0D0D": 15,
  "#000000": Infinity,
  "#247AFD": 0,
  "#FF00FF": 0,
};

export const costToColorMapping = {
  1: "#90EE90",
  3: "#ACB334",
  5: "#FAB733",
  7: "#FF8E15",
  10: "#FF4E11",
  15: "#FF0D0D",
  Infinity: "#000000",
  0: "#247AFD",
  0: "#247AFD",
};
