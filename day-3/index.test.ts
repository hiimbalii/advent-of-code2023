import * as fs from "fs";
import {
  Index,
  Matrix,
  findDigitsAroundIndex,
  findSymbols,
  run,
  walkAllNumbers,
  walkNumber,
} from "./index";

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
  it("should find +, - ", () => {
    const symbols: Index[] = [
      [1, 1],
      [1, 3],
    ];
    const [result] = findSymbols(input);
    expect(result).toEqual(expect.arrayContaining(symbols));
  });
  it("should find other symbols", () => {
    const symbols: Index[] = [
      [0, 3],
      [1, 2],
    ];
    const [result] = findSymbols(input);
    expect(result).toEqual(expect.arrayContaining(symbols));
  });
  it("should return the matrix", () => {
    const [_, matrix] = findSymbols(input);
    expect(matrix).toEqual(input);
  });
});

describe("getDigitsAroundIndex", () => {
  const matrix: Matrix = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];
  it("should find all 8 neighbours", () => {
    const index: Index = [1, 1];
    const result = findDigitsAroundIndex(index, matrix);
    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
      ]),
    );
    expect(result.length).toBe(8);
  });
  it("should not overflow (-)", () => {
    const index: Index = [0, 0];
    const result = findDigitsAroundIndex(index, matrix);
    expect(result).toEqual(
      expect.arrayContaining([
        [0, 1],
        [1, 0],
        [1, 1],
      ]),
    );
    expect(result.length).toBe(3);
  });
  it("should not overflow (+)", () => {
    const index: Index = [2, 2];
    const result = findDigitsAroundIndex(index, matrix);
    expect(result).toEqual(
      expect.arrayContaining([
        [1, 1],
        [1, 2],
        [2, 1],
      ]),
    );
    expect(result.length).toBe(3);
  });
  it("should work in larger matrixes", () => {
    const largeMatrix = [
      ["1", "2", "3", "4", "5"],
      ["6", "7", "8", "9", "0"],
      ["1", "2", "3", "4", "5"],
      ["6", "7", "8", "9", "0"],
      ["1", "2", "3", "4", "5"],
    ];
    const index: Index = [3, 3];
    const result = findDigitsAroundIndex(index, largeMatrix);
    expect(result).toEqual(
      expect.arrayContaining([
        [2, 2],
        [2, 3],
        [2, 4],
        [3, 2],
        [3, 4],
        [4, 2],
        [4, 3],
        [4, 4],
      ]),
    );
    expect(result.length).toBe(8);
  });
  it("should only only find numbers", () => {
    const matrixWithSymbols = [
      ["1", "$", "+"],
      ["-", "*", "$"],
      ["*", ",", "3"],
    ];
    const index: Index = [1, 1];
    const result = findDigitsAroundIndex(index, matrixWithSymbols);
    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0],
        [2, 2],
      ]),
    );
    expect(result.length).toBe(2);
  });
});

describe("walkNumber", () => {
  it("should find full number", () => {
    const line = ["*", "1", "2", "3", ".", "3", "."];
    const [result] = walkNumber(2, line);
    expect(result).toBe(123);
  });
});
describe("walkAllNumbers", () => {
  it("should find correct numbers", () => {
    const matrix = [
      [".", "$", "1", "2", "3", "."],
      [".", "4", "5", "6", "7", "."],
    ];
    const result = walkAllNumbers([
      [
        [0, 2],
        [1, 1],
      ],
      matrix,
    ]);
    expect(result).toEqual(expect.arrayContaining([123, 4567]));
    expect(result.length).toEqual(2);
  });
  it("should find each numbers only once", () => {
    const matrix = [
      [".", "$", "1", "2", "3", "."],
      [".", ".", "4", "5", "6", "7"],
    ];
    const result = walkAllNumbers([
      [
        [0, 2],
        [1, 2],
        [1, 3],
      ],
      matrix,
    ]);
    expect(result).toEqual(expect.arrayContaining([123, 4567]));
    expect(result.length).toEqual(2);
  });
});
it("validate", () => {
  const result = run(lines_valid);
  expect(result).toBe(4361);
  const solution = run(lines);
  console.log(solution);
});
