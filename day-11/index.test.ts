import * as fs from "fs";
import { Point, distanceBetweenPoints, nextStartPoint, run } from "./index";
import exp from "constants";

const lines = fs.readFileSync("./input").toString().split("\n\n");
const lines_valid = fs
  .readFileSync("./input.validate")
  .toString()
  .split("\n\n");

describe("distanceBetweenPoints", () => {
  it("should return the distance between two points", () => {
    const point1: Point = [0, 0];
    const point2: Point = [5, 6];
    expect(distanceBetweenPoints(point1, point2)).toBe(9);
  });
  it("should return the distance between two points 3", () => {
    const point1: Point = [0, 0];
    const point2: Point = [1, 1];
    expect(distanceBetweenPoints(point1, point2)).toBe(1);
  });
  it("should return the distance between two points 4", () => {
    const point1: Point = [0, 0];
    const point2: Point = [1, 0];
    expect(distanceBetweenPoints(point1, point2)).toBe(0);
  });
  it("should return the distance between two points 5", () => {
    const point1: Point = [0, 0];
    const point2: Point = [0, 2];
    expect(distanceBetweenPoints(point1, point2)).toBe(1);
  });
  it("should return the distance between two points 5", () => {
    const point1: Point = [0, 0];
    const point2: Point = [0, 3];
    expect(distanceBetweenPoints(point1, point2)).toBe(2);
  });
  it("should return the distance between two points 5", () => {
    const point1: Point = [0, 0];
    const point2: Point = [1, 3];
    expect(distanceBetweenPoints(point1, point2)).toBe(2);
  });
});
describe("nextStartPoint", () => {
  it("should return the next start point", () => {
    const point1: Point = [0, 0];
    const point2: Point = [5, 6];
    expect(nextStartPoint(point1, point2)).toEqual([0, 1]);
  });
  it("should return the next start point 2", () => {
    const point1: Point = [0, 1];
    const point2: Point = [5, 6];
    expect(nextStartPoint(point1, point2)).toEqual([1, 1]);
  });
  it("should return the next start point 3", () => {
    const point1: Point = [1, 1];
    const point2: Point = [5, 6];
    expect(nextStartPoint(point1, point2)).toEqual([1, 2]);
  });
  it("should return the next start point 4", () => {
    const point1: Point = [1, 2];
    const point2: Point = [5, 6];
    expect(nextStartPoint(point1, point2)).toEqual([2, 2]);
  });
});

it("validate", () => {
  const result = run(lines_valid);
  expect(result).toBe(374);
  const solution = run(lines);
  console.log(solution);
});
