import * as fs from "fs";
import { parseLine, run } from "./index";

const lines = fs.readFileSync("./input").toString().split("\n");
const lines_valid = fs.readFileSync("./input.validate").toString().split("\n");

it("should parse line", () => {
  expect(parseLine("#.#.### 1,1,3")).toEqual({
    pattern: "#.#.###",
    damagedSequences: [1, 1, 3],
  });
});

it("validate", () => {
  const result = run(lines_valid);
  expect(result).toBe(21);
  const solution = run(lines);
  console.log(solution);
});
