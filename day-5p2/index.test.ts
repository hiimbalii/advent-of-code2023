import * as fs from "fs";
import {
  arrayOfIndexes,
  mapSeed,
  offsetValue,
  reduceRanges,
  run,
  within,
} from "./index";

const lines = fs.readFileSync("./input").toString().split("\n\n");
const lines_valid = fs
  .readFileSync("./input.validate")
  .toString()
  .split("\n\n");

describe("arrayOfIndexes", () => {
  it("should make list of 0", () => {
    expect(arrayOfIndexes(0)).toEqual([]);
  });
  it("should make list of 1", () => {
    expect(arrayOfIndexes(1)).toEqual([0]);
  });
  it("should make list of n", () => {
    expect(arrayOfIndexes(5)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe("within", () => {
  it("should have inclusive min", () => {
    expect(within(50, 2, 50)).toBe(true);
  });
  it("should have exclusive to", () => {
    expect(within(50, 2, 51)).toBe(true);
    expect(within(50, 2, 52)).toBe(false);
  });
});

describe("offset", () => {
  it("should offset correctly", () => {
    expect(offsetValue(98, 50, 98)).toBe(50);
    expect(offsetValue(98, 50, 99)).toBe(51);
  });
});

it("map", () => {
  expect(mapSeed(1, [10, 1, 5])).toBe(10);
  expect(mapSeed(2, [10, 1, 5])).toBe(11);
  expect(mapSeed(3, [10, 1, 5])).toBe(12);
  expect(mapSeed(4, [10, 1, 5])).toBe(13);
  expect(mapSeed(5, [10, 1, 5])).toBe(14);
  expect(mapSeed(6, [10, 1, 5])).toBe(6);
  expect(mapSeed(7, [10, 1, 5])).toBe(7);
  expect(mapSeed(8, [10, 1, 5])).toBe(8);
  expect(mapSeed(9, [10, 1, 5])).toBe(9);
  expect(mapSeed(10, [10, 1, 5])).toBe(10);
  expect(mapSeed(11, [10, 1, 5])).toBe(11);
  expect(mapSeed(97, [50, 98, 2])).toBe(97);
  expect(mapSeed(98, [50, 98, 2])).toBe(50);
  expect(mapSeed(99, [50, 98, 2])).toBe(51);
  expect(mapSeed(100, [50, 98, 2])).toBe(100);
});
it("reduceranges", () => {
  const ranges: [number, number, number][] = [
    [50, 98, 2],
    [52, 50, 48],
  ];
  expect(reduceRanges(0, ranges)).toBe(0);
  expect(reduceRanges(1, ranges)).toBe(1);
  expect(reduceRanges(2, ranges)).toBe(2);
  expect(reduceRanges(48, ranges)).toBe(48);
  expect(reduceRanges(49, ranges)).toBe(49);
  expect(reduceRanges(50, ranges)).toBe(52);
  expect(reduceRanges(51, ranges)).toBe(53);
  expect(reduceRanges(96, ranges)).toBe(98);
  expect(reduceRanges(97, ranges)).toBe(99);
  expect(reduceRanges(98, ranges)).toBe(50);
  expect(reduceRanges(99, ranges)).toBe(51);
});
it("validate", () => {
  const result = run(lines_valid);
  expect(result).toBe(46);
  const solution = run(lines);
  console.log(solution);
});
