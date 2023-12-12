import * as fs from "fs";
import {
  contains_too_big_pairs,
  run,
  to_pairs,
} from "./index";

const lines = fs.readFileSync("./input").toString().split("\n");
const lines_valid = fs.readFileSync("./input.validate").toString().split("\n");

describe("to_pairs", () => {
  it("should split a line into pairs of numbers and colours", () => {
    const line = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green";
    const result = to_pairs(line);
    expect(result).toEqual([
      ["3", "blue"],
      ["4", "red"],
      ["1", "red"],
      ["2", "green"],
      ["6", "blue"],
      ["2", "green"],
    ]);
  });
});
describe("contains_too_big_pairs", () => {
  it("should return true if there is a pair with more than 12 red", () => {
    const line = [['50', 'green']];
    const result = contains_too_big_pairs(line);
    expect(result).toBe(true);
  });
  it("should return true if there is a pair with more than 13 green", () => {
    const line = [['50', 'green']];
    const result = contains_too_big_pairs(line);
    expect(result).toBe(true);
  });
  it("should return true if there is a pair with more than 14 blue", () => {
    const line = [['50', 'green']];
    const result = contains_too_big_pairs(line);
    expect(result).toBe(true);
  });
  it("should otherwise return false", () => {
    const line = [['12', 'green'], ["11","red"], ["13", "blue"]];
    const result = contains_too_big_pairs(line);
    expect(result).toBe(false);
  });
  it("should return false if the pairs are the exact limits", () => {
    const line = [["12", "red"], ["13", "green"], ["14", "blue"]]
    const result = contains_too_big_pairs(line);
    expect(result).toBe(false);
  });
  it("should return false if there is less than 3 pairs in the list", () => {
    const line = [["10", "green"], ["1", "blue"]];
    const result = contains_too_big_pairs(line);
    expect(result).toBe(false);
  });
});

it("validate", () => {
  const result = run(lines_valid);
  expect(result).toBe(8);
  const solution = run(lines);
  console.log(solution);
});
