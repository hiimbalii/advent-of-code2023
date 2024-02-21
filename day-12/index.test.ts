import * as fs from "fs";
import {
  createValidVariations,
  findCombinations,
  parseLine,
  replaceNextNIfPossible,
  replaceWithHash,
  run,
} from "./index";
import * as O from "fp-ts/Option";

const lines = fs.readFileSync("./input").toString().split("\n\n");
const lines_valid = fs
  .readFileSync("./input.validate")
  .toString()
  .split("\n\n");

it("should parse line", () => {
  expect(parseLine("#.#.### 1,1,3")).toEqual({
    pattern: "#.#.###",
    damagedSequences: [1, 1, 3],
  });
});

describe("findCombinations", () => {
  //   ???.### 1,1,3 - 1 arrangement
  // .??..??...?##. 1,1,3 - 4 arrangements
  // ?#?#?#?#?#?#?#? 1,3,1,6 - 1 arrangement
  // ????.#...#... 4,1,1 - 1 arrangement
  // ????.######..#####. 1,6,5 - 4 arrangements
  // ?###???????? 3,2,1 - 10 arrangements
  it("should work on example one", () => {
    const row = parseLine("???.### 1,1,3");
    expect(findCombinations(row)).toEqual(["#.#.###"]);
    expect(findCombinations(row).length).toBe(1);
  });
  it("should work on example two", () => {
    const row = parseLine(".??..??...?##. 1,1,3");
    expect(findCombinations(row).length).toBe(4);
  });
  it("should work on example three", () => {
    const row = parseLine("?#?#?#?#?#?#?#? 1,3,1,6");
    expect(findCombinations(row).length).toBe(1);
  });
  it("should work on example four", () => {
    const row = parseLine("????.#...#... 4,1,1");
    expect(findCombinations(row).length).toBe(1);
  });
  it("should work on example five", () => {
    const row = parseLine("????.######..#####. 1,6,5");
    expect(findCombinations(row).length).toBe(4);
  });
  it("should work on example six", () => {
    const row = parseLine("?###???????? 3,2,1");
    expect(findCombinations(row)).toEqual([
      ".###.##.#...",
      ".###.##..#..",
      ".###.##...#.",
      ".###.##....#",
      ".###..##.#..",
      ".###..##..#.",
      ".###..##...#",
      ".###...##.#.",
      ".###...##..#",
      ".###....##.#",
    ]);
    expect(findCombinations(row).length).toBe(10);
  });
});

describe("replaceNextNIfPossible", () => {
  it.each`
    pattern    | length | start | expected
    ${"???."}  | ${3}   | ${0}  | ${O.of(["###.", 3])}
    ${".???."} | ${3}   | ${1}  | ${O.of([".###.", 4])}
    ${"#??."}  | ${3}   | ${0}  | ${O.of(["###.", 3])}
    ${"#.?"}   | ${3}   | ${0}  | ${O.none}
    ${"#?."}   | ${3}   | ${0}  | ${O.none}
    ${"#?"}    | ${3}   | ${0}  | ${O.none}
  `(
    'should work on "$pattern" with length $length and start $start',
    ({ pattern, length, start, expected }) => {
      expect(replaceNextNIfPossible(pattern, length)(start)).toEqual(expected);
    }
  );
});

describe("replaceWithHash", () => {
  it.each`
    pattern    | start | length | expected
    ${"???."}  | ${0}  | ${3}   | ${"###."}
    ${".???."} | ${1}  | ${3}   | ${".###."}
  `(
    'should work on "$pattern" with start $start and length $length',
    ({ pattern, start, length, expected }) => {
      expect(replaceWithHash(pattern, start, length)).toEqual(expected);
    }
  );
});

describe("createValidVariations", () => {
  it.each`
    pattern    | len  | expected
    ${"???."}  | ${3} | ${[["###.", 3]]}
    ${".???."} | ${3} | ${[[".###.", 4]]}
    ${"#??."}  | ${3} | ${[["###.", 3]]}
  `('should work on "$pattern"', ({ pattern, expected }) => {
    expect(createValidVariations(3)(pattern)).toEqual(expected);
  });
});

describe('getAllFits', () => {
  it
})


it("validate", () => {
  const result = run(lines_valid);
  expect(result).toBe(21);
  const solution = run(lines);
  console.log(solution);
});
