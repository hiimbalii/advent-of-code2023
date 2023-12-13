import { string } from "fp-ts";

export const run = (input: string[]) => {
  const characters: Matrix = input
    .filter((str) => str.length)
    .map((str) => str.split(""));

  return findNumbers(characters).reduce((prev, curr) => prev + curr, 0);
};

export type Matrix = string[][];
export type Index = [number, number];
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

export const findDigits = ([
  indexes,
  board,
]: IndexesWithMatrix): IndexesWithMatrix => [indexes, board];

export const walkNumbers = ([indexes, board]: IndexesWithMatrix): number[] => [
  0,
];

export const findNumbers = (input: Matrix): number[] =>
  walkNumbers(findDigits(findSymbols(input)));
