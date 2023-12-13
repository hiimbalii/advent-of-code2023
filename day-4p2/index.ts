export type Line = {
  lineNumber: number;
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
export const splitLine = (line: string, lineNr: number) => ({
  lineNumber: lineNr,
  winning: getSection(line, 0),
  mine: getSection(line, 1),
});

export const run = (input: string[]) => {
  const lines: Line[] = input
    .filter((str) => str.length)
    .map((str, i) => splitLine(str, i + 1));

  return calculateCards(lines).length + lines.length;
};

export const findIntersectionLenght = ({ winning, mine }: Line): number =>
  mine.filter((curr) => winning.includes(curr)).length;

export const findNextN = (n: number, idx: number, array: Line[]): Line[] =>
  array.slice(idx + 1, idx + 1 + n);

const makeCardList = (line: Line, allLines: Line[]): Line[] =>
  findNextN(
    findIntersectionLenght(line),
    line.lineNumber - 1,
    allLines,
  ).flatMap((foundLine) => [foundLine, ...makeCardList(foundLine, allLines)]);

const calculateCards = (lines: Line[]): number[] =>
  lines
    .reduce(
      (accum, curr, _) => [...accum, ...makeCardList(curr, lines)],
      [] as Line[],
    )
    .map((line) => line.lineNumber);
