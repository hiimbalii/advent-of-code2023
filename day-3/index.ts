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

const isNumber = (char: string) => !isNaN(parseInt(char));
const isSymbol = (char: string) => {
  return ["+", "-"].includes(char) && !isNumber(char) && char !== ".";
};
// Not happy with the name but it's late lol
const symbolToIndex = (row: string[], outerIndex: number): Index[] =>
  row
    .map((char, innerIndex): [string, number, number] => [
      char,
      outerIndex,
      innerIndex,
    ])
    .filter(([char]) => isSymbol(char))
    .map(([_, ...indexes]) => indexes);
export const findSymbols = (input: Matrix): IndexesWithMatrix => [
  input.flatMap(symbolToIndex),
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
