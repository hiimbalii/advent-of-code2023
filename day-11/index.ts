export type Point = [number, number];

export const nextStartPoint = ([x1, y1]: Point, [x2, y2]: Point): Point => {
  return x2 - x1 >= y2 - y1 ? [x1 + 1, y1] : [x1, y1 + 1];
};

function printBoard(point1: Point, point2: Point) {
  //print a grid where the bottom right corner is point2 and the top left corner is 0,0
  // print a * at point1 and point2 a . at all other points
  let board = "";
  for (let y = 0; y <= point2[1]; y++) {
    for (let x = 0; x <= point2[0]; x++) {
      if (x === point1[0] && y === point1[1]) {
        board += "*";
      } else if (x === point2[0] && y === point2[1]) {
        board += "X";
      } else {
        board += ".";
      }
    }
    board += "\n";
  }
  return board;
}
export const distanceBetweenPoints = (point1: Point, point2: Point): number => {
  //return 0 if point1 is either directly above or to the left of point2
  if (
    (point1[0] === point2[0] && point1[1] === point2[1] + 1) ||
    (point1[1] === point2[1] && point1[0] === point2[0] - 1)
  ) {
    return 0;
  }
  return distanceBetweenPoints(nextStartPoint(point1, point2), point2) + 1;
};

export const run = (input: string[]) => {
  return 35;
};
