import { option } from "fp-ts";
import { filterMapWithIndex, flatMap, map, reduce } from "fp-ts/Array";
import { pipe } from "fp-ts/function";
import { Option } from "fp-ts/Option";

type Row = {
  pattern: string;
  damagedSequences: number[];
};

/********
 * Parse input
 */
const makeSequence = (numbers: string): number[] =>
  numbers.split(",").map((str) => parseInt(str));
export const parseLine = (line: string): Row =>
  pipe(line.split(" "), ([pattern, numbers]) => ({
    pattern,
    damagedSequences: makeSequence(numbers),
  }));
const parseInput = (input: string[]) => pipe(input, map(parseLine));

/********
 * Solve problem
 */

// pattern and startIdx
type IterationValue = [string, number];

const changeIntoHash = (
  pattern: string,
  startIdx: number,
  seqLen: number
): string => {
  const hashSeq = "#".repeat(seqLen) + ".";
  return pipe(pattern, replaceAt(startIdx, hashSeq));
};

const replaceAt =
  (index: number, replacement: string) =>
  (input: string): string =>
    input.slice(0, index).replaceAll("?", ".") +
    replacement +
    input.slice(index + replacement.length);

const canReplace = (
  pattern: string,
  startIdx: number,
  endIdx: number,
  seqLen: number
) =>
  pipe(
    pattern.slice(startIdx, endIdx),
    (str) =>
      str.includes(".") ||
      str.length !== seqLen ||
      pattern.at(endIdx) === "#" ||
      (startIdx > 0 && pattern.at(startIdx - 1) === "#")
  );

const replaceFromIdx: (
  startIdx: number,
  pattern: string,
  seqLen: number
) => (currentIdx: number) => Option<IterationValue> =
  (startIdx, pattern, seqLen) => (currentIdx) =>
    canReplace(
      pattern,
      startIdx + currentIdx,
      startIdx + currentIdx + seqLen,
      seqLen
    )
      ? option.none
      : (() => {
          return option.of([
            changeIntoHash(pattern, startIdx + currentIdx, seqLen),
            startIdx + currentIdx + seqLen + 1, // skip one for a spearator dot
          ]);
        })();

const findAllVariations: (
  seqLen: number
) => ([pattern, start]: IterationValue) => IterationValue[] =
  (seqLen: number) =>
  ([pattern, start]) =>
    pipe(
      pattern.slice(start).split(""),
      filterMapWithIndex(replaceFromIdx(start, pattern, seqLen))
    );

const findPotentialCombinationsForDamagedSeq: (
  preaviousVariations: IterationValue[],
  sequenceLength: number
) => IterationValue[] = (previousVariatons, seqLen) =>
  pipe(previousVariatons, flatMap(findAllVariations(seqLen)));

export const makeValidCombinations: (row: Row) => IterationValue[] = (row) =>
  pipe(row, ({ pattern, damagedSequences }) =>
    damagedSequences.reduce(findPotentialCombinationsForDamagedSeq, [
      [pattern, 0] as IterationValue,
    ])
  );

const countValidCombinations: (row: Row) => number = (row) =>
  pipe(row, makeValidCombinations, (l: unknown[]) => l.length);

export const solve = (rows: Row[]) =>
  pipe(
    rows,
    map(countValidCombinations),
    reduce(0, (acc, num) => acc + num)
  );

/********
 * Run
 */
export const run = (input: string[]) => {
  return pipe(input, parseInput, solve);
};
