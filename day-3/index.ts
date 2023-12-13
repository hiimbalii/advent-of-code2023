import { string } from "fp-ts";

export const run = (input: string[]) => {
  const characters: Matrix = input
    .filter((str) => str.length)
    .map((str) => str.split(""));

  return findNumbers(characters).reduce((prev, curr) => prev + curr, 0);
};

export type Matrix = string[][];
export type Index = [number, number];
type WalkHistory = {
  number: string;
  blocked: number[];
  lastIndex: number;
};

// I am aware it's indices, but this is way more readable
type IndexesWithMatrix = [Index[], Matrix];

const isSymbol = (char: string) => isNaN(parseInt(char)) && char !== ".";
// Not happy with the name but it's late lol
const symbolsToIndexes = (row: string[], outerIndex: number): Index[] =>
  row
    .map((item, innerIndex): [string, Index] => [
      item,
      [outerIndex, innerIndex],
    ])
    .filter(([char]) => isSymbol(char))
    .map(([_, index]) => index);
export const findSymbols = (input: Matrix): IndexesWithMatrix => [
  input.flatMap(symbolsToIndexes),
  input,
];

const upAndDown = (...indexes: Index[]) =>
  indexes.flatMap(([outerIndex, innerIndex]): Index[] => [
    [outerIndex - 1, innerIndex],
    [outerIndex + 1, innerIndex],
  ]);
const leftAndRight = (...indexes: Index[]) =>
  indexes.flatMap(([outerIndex, innerIndex]): Index[] => [
    [outerIndex, innerIndex - 1],
    [outerIndex, innerIndex + 1],
  ]);
const findNeighbours = (index: Index, max: [number, number]) =>
  [
    ...upAndDown(index),
    ...leftAndRight(index),
    ...leftAndRight(...upAndDown(index)),
  ]
    .filter(([outerIndex, _]) => outerIndex > -1 && outerIndex < max[0])
    .filter(([_, innerIndex]) => innerIndex > -1 && innerIndex < max[1]);
const getIndexes = (indexes: Index[], board: Matrix): [string, Index][] =>
  indexes.map(([outerIndex, innerIndex]) => [
    board[outerIndex][innerIndex],
    [outerIndex, innerIndex],
  ]);
const findMax = (board: Matrix) =>
  [board.length, board[0]?.length] as [number, number];
const isNumber = (char: string) => !isNaN(parseInt(char));
export const findDigitsAroundIndex = (index: Index, board: Matrix) =>
  getIndexes(findNeighbours(index, findMax(board)), board)
    .filter(([char]) => isNumber(char))
    .map(([_, index]) => index);
export const findDigitsAroundIndexes = ([
  indexes,
  board,
]: IndexesWithMatrix): IndexesWithMatrix => [
  indexes.flatMap((index) => findDigitsAroundIndex(index, board)),
  board,
];

const walkToEnd = (
  [index, sum]: [number, number],
  line: string[],
): [number, number] =>
  isNumber(line[index + 1])
    ? walkToEnd([index + 1, sum * 10 + parseInt(line[index])], line)
    : [-1, sum * 10 + parseInt(line[index])];
const findStart = (index: number, line: string[]): number =>
  isNumber(line[index - 1]) ? findStart(index - 1, line) : index;
export const walkNumber = (index: number, line: string[]): [number, number] => [
  walkToEnd([findStart(index, line), 0], line)[1],
  findStart(index, line),
];

const deduplicate = () => {};
export const walkAllNumbers = ([indexes, board]: IndexesWithMatrix): number[] =>
  indexes
    .map(([vertical, horizontal]): [[number, number], number] => [
      walkNumber(horizontal, board[vertical]),
      vertical,
    ])
    .filter(
      ([[_, innerCurr], outerCurr], index, array) =>
        array.findIndex(
          ([[_, inner], outer]) => outer === outerCurr && inner === innerCurr,
        ) === index,
    )
    .map((x) => x[0][0]);

export const findNumbers = (input: Matrix): number[] =>
  walkAllNumbers(findDigitsAroundIndexes(findSymbols(input)));
