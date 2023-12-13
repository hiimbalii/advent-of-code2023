import * as fs from "fs";
import {
  calculateScore,
  findIntersectionLenght,
  run,
  splitLine,
} from "./index";

const lines = fs.readFileSync("./input").toString().split("\n");
const lines_valid = fs.readFileSync("./input.validate").toString().split("\n");

it("should split lines", () => {
  const line = "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53";
  const result = splitLine(line);
  expect(result).toEqual({
    winning: [41, 48, 83, 86, 17],
    mine: [83, 86, 6, 31, 17, 9, 48, 53],
  });
});
it("should split lines 2", () => {
  const line = "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1";
  const result = splitLine(line);
  expect(result).toEqual({
    winning: [1, 21, 53, 59, 44],
    mine: [69, 82, 63, 72, 16, 21, 14, 1],
  });
});
describe("find intersection lenght", () => {
  it("card 1", () => {
    const line = splitLine("Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53");
    expect(findIntersectionLenght(line)).toBe(4);
  });
  it("card 2", () => {
    const line = splitLine("Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19");
    expect(findIntersectionLenght(line)).toBe(2);
  });
  it("card 3", () => {
    const line = splitLine("Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1");
    expect(findIntersectionLenght(line)).toBe(2);
  });
  it("card 4", () => {
    const line = splitLine("Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83");
    expect(findIntersectionLenght(line)).toBe(1);
  });
  it("card 5", () => {
    const line = splitLine("Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36");
    expect(findIntersectionLenght(line)).toBe(0);
  });
  it("card 6", () => {
    const line = splitLine("Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11");
    expect(findIntersectionLenght(line)).toBe(0);
  });
});
describe("calculate score", () => {
  it("0 numbers = 0 points", () => {
    expect(calculateScore(0)).toBe(0);
  });
  it("1 numbers = 1 points", () => {
    expect(calculateScore(1)).toBe(1);
  });
  it("2 numbers = 2 points", () => {
    expect(calculateScore(2)).toBe(2);
  });
  it("3 numbers = 4 points", () => {
    expect(calculateScore(3)).toBe(4);
  });
  it("4 numbers = 8 points", () => {
    expect(calculateScore(4)).toBe(8);
  });
  it("5 numbers = 16 points", () => {
    expect(calculateScore(5)).toBe(16);
  });
});

it("validate", () => {
  const result = run(lines_valid);
  expect(result).toBe(13);
  const solution = run(lines);
  expect(solution).toBeGreaterThan(21942); //first run
  console.log(solution);
});
