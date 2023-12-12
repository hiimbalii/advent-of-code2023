import * as fs from "fs";
import { run } from "./index";

const lines = fs.readFileSync("./input").toString().split("\n");
const lines_valid = fs.readFileSync("./input.validate").toString().split("\n");

it("validate", () => {
  const result = run(lines_valid);
  expect(result).toBe(281);
  const solution = run(lines);
  console.log(solution);
});
