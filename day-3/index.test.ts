import * as fs from "fs";
import { Index, Matrix, findSymbols, run } from "./index";

const lines = fs.readFileSync("./input").toString().split("\n");
const lines_valid = fs.readFileSync("./input.validate").toString().split("\n");

describe("findSymbols", () => {
  const input: Matrix = [
    [".", ".", "3", "*", "."],
    ["4", "-", "$", "+", "."],
  ];
  it("should not find numbers", () => {
    const numbers: Index[] = [
      [0, 2],
      [1, 0],
    ];
    const [result] = findSymbols(input);
    expect(result).not.toEqual(expect.arrayContaining(numbers));
  });
  it("should not find dots", () => {
    const dots: Index[] = [
      [0, 0],
      [0, 1],
      [0, 4],
      [1, 4],
    ];
    const [result] = findSymbols(input);
    expect(result).not.toEqual(expect.arrayContaining(dots));
  });
  it("should find everything else", () => {
    const symbols: Index[] = [
      [0, 2],
      [1, 1],
      [1, 2],
      [1, 3],
    ];
    const [result] = findSymbols(input);
    expect(result).toEqual(expect.arrayContaining(symbols));
  });
  it("should return the matrix", () => {
    const [_, matrix] = findSymbols(input);
    expect(matrix).toEqual(input);
  });
});

it("validate", () => {
  const result = run(lines_valid);
  expect(result).toBe(4361);
  const solution = run(lines);
  console.log(solution);
});
