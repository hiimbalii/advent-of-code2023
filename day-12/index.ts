import { pipe } from "fp-ts/function";
import {
  filterMap,
  filterMapWithIndex,
  flatMap,
  foldLeft,
  map,
  mapWithIndex,
  reduce,
  replicate,
} from "fp-ts/Array";
import { ap } from "fp-ts/lib/Apply";
import { fold } from "fp-ts/lib/Tree";
import * as O from "fp-ts/Option";

type Row = {
  pattern: string;
  damagedSequences: number[];
};
const splitString = (str: string): string[] => str.split("");
const tuplefy =
  <A, B>(fn: (a: A) => B) =>
  (input: A): [A, B] => {
    return [input, pipe(input, fn)];
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

export const replaceWithHash: (
  pattern: string,
  start: number,
  length: number
) => string = (pattern, start, length) =>
  pattern.slice(0, start) +
  replicate(length, "#").join("") +
  pattern.slice(start + length);

export const replaceNextNIfPossible: (
  pattern: string,
  length: number
) => (start: number) => O.Option<[string, number]> =
  (pattern, length) => (start) =>
    pipe(pattern.slice(start, start + length), (str) =>
      str.includes(".") || str.length !== length
        ? O.none
        : O.some([replaceWithHash(pattern, start, length), start + length])
    );

export const createValidVariations: (
  sequenceLength: number
) => (pattern: string) => [string, number][] = (sequenceLength) => (pattern) =>
  pipe(
    pattern,
    splitString,
    filterMapWithIndex(replaceNextNIfPossible(pattern, sequenceLength)),
    map(([pattern, index]) => [
      pattern.slice(0, index).replace("?", ".") + pattern.slice(index),
      index,
    ])
  );

export const getAllFits: (
  sequenceLength: number
) => (previous: [string, number][]) => [string, number][] =
  (sequenceLength) => (previous) =>
    map(([prevPattern, prevIndex]: [string, number]) =>
      pipe(
        prevPattern,
        (str: string) => str.slice(prevIndex),
        createValidVariations(sequenceLength)
      )
    )(previous);

export const findCombinations: (row: Row) => string[] = ({
  pattern,
  damagedSequences,
}) =>
  pipe(
    damagedSequences,
    reduce(
      [[pattern, 0] as [string, number]],
      (acc, sequenceLength: number) => {
        return pipe(acc, flatMap(getAllFits(sequenceLength)));
      }
    ),
    map(([pattern]) => pattern)
    // (list) => list.length
  );

/********
 * Run
 */
export const run = (input: string[]) => {
  return 35;
};
