type Line = {
  winning: number[];
  mine: number[];
};
const getSection = (line: string, sectionNr: number) =>
  line
    //.replaceAll(/\s+/g, " ")
    .substring(line.indexOf(":") + 1)
    .split(" | ")
    .map((section) => section.trim().split(" "))
    [sectionNr].map((num) => parseInt(num))
    .filter((num) => !isNaN(num));
export const splitLine = (line: string) => ({
  winning: getSection(line, 0),
  mine: getSection(line, 1),
});

function log<T>(value: T, ...args: any[]) {
  console.log(...args);
  return value;
}
export const run = (input: string[]) => {
  const lines: Line[] = input
    .filter((str) => str.length)
    .map((x) => log(x, x, splitLine(x)))
    .map((str) => splitLine(str));

  return calculateScores(lines).reduce((prev, curr) => prev + curr, 0);
};
export const findIntersectionLenght = ({ winning, mine }: Line): number =>
  mine.filter((curr) => winning.includes(curr)).length;

export const calculateScore = (winningNumbers: number) =>
  winningNumbers !== 0 ? Math.pow(2, winningNumbers - 1) : 0;

const calculateScores = (lines: Line[]): number[] =>
  lines.map(findIntersectionLenght).map(calculateScore);
