import * as fs from "fs";
import { run, to_pairs, map_to_number, filter_color, power } from "./index";

const lines = fs.readFileSync("./input").toString().split("\n");
const lines_valid = fs.readFileSync("./input.validate").toString().split("\n");

describe("to_pairs", () => {
  it("should split a line into pairs of numbers and colours", () => {
    const line = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green";
    const result = to_pairs(line);
    expect(result).toEqual([
      [3, "blue"],
      [4, "red"],
      [1, "red"],
      [2, "green"],
      [6, "blue"],
      [2, "green"],
    ]);
  });
});
describe("power", ()=>{
  it("should take correct power", ()=>{
    const result = power({red:6, green: 3, blue: 2})
    expect(result).toBe(36)
  })
})

describe("filter_color", ()=>{
  it("should filter out every other colors", ()=>{
    const result = filter_color("red", [[2, "red"], [4, "blue"], [6, "red"], [5, "green"]])
    expect(result).toEqual([[2, "red"], [6, "red"]])
  })
})

describe('map_to_number', ()=>{
  it('should map each number color to a number', ()=>{
    const result = map_to_number([[2, "red"], [4, "red"], [6, "red"], [5, "red"]])
    expect(result).toEqual([2,4,6,5])
  })
})


it("validate", () => {
  const result = run(lines_valid);
  expect(result).toBe(2286);
  const solution = run(lines);
  console.log(solution);
});
