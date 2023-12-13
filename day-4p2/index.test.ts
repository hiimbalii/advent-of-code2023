import * as fs from "fs";
import {
  Line,
  findIntersectionLenght,
  findNextN,
  run,
  splitLine,
} from "./index";

const lines = fs.readFileSync("./input").toString().split("\n");
const lines_valid = fs.readFileSync("./input.validate").toString().split("\n");

it("should split lines", () => {
  const line = "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53";
  const result = splitLine(line, 1);
  expect(result).toEqual({
    lineNumber: 1,
    winning: [41, 48, 83, 86, 17],
    mine: [83, 86, 6, 31, 17, 9, 48, 53],
  });
});
it("should split lines 2", () => {
  const line = "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1";
  const result = splitLine(line, 3);
  expect(result).toEqual({
    lineNumber: 3,
    winning: [1, 21, 53, 59, 44],
    mine: [69, 82, 63, 72, 16, 21, 14, 1],
  });
});
describe("find intersection lenght", () => {
  it("card 1", () => {
    const line = splitLine(
      "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
      1,
    );
    expect(findIntersectionLenght(line)).toBe(4);
  });
  it("card 2", () => {
    const line = splitLine(
      "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
      1,
    );
    expect(findIntersectionLenght(line)).toBe(2);
  });
  it("card 3", () => {
    const line = splitLine(
      "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
      1,
    );
    expect(findIntersectionLenght(line)).toBe(2);
  });
  it("card 4", () => {
    const line = splitLine(
      "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
      1,
    );
    expect(findIntersectionLenght(line)).toBe(1);
  });
  it("card 5", () => {
    const line = splitLine(
      "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
      1,
    );
    expect(findIntersectionLenght(line)).toBe(0);
  });
  it("card 6", () => {
    const line = splitLine(
      "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
      1,
    );
    expect(findIntersectionLenght(line)).toBe(0);
  });
});
describe("findNextN", () => {
  const list = [1, 2, 3, 4] as unknown as Line[];
  it("0 => []", () => {
    expect(findNextN(0, 0, list)).toEqual([]);
  });
  it("1 => +1 item", () => {
    expect(findNextN(1, 0, list)).toEqual([2]);
  });
  it("2 => +2 items", () => {
    expect(findNextN(2, 0, list)).toEqual([2, 3]);
  });
  it("offset", () => {
    expect(findNextN(1, 1, list)).toEqual([3]);
  });
});

it("validate", () => {
  const result = run(lines_valid);
  expect(result).toBe(30);
  const solution = run(lines);
  console.log(solution);
});
