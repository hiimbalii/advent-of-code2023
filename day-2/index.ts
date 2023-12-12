const limits:{[name:string]:number}= {
  red:12,
  green:13,
  blue:14,
}

export const run = (input: string[]) => {
  const possible_lines: boolean[] = input
    .filter((str) => str.length)
    .map(solve);
  return possible_lines.reduce((prev, curr, currIdx) => prev + (curr ? currIdx+1 : 0), 0);
};

export const to_pairs = (line: string): string[][] =>
  line
    .slice(line.indexOf(':')+1)
    .split(";")
    .flatMap((line) => line.split(","))
    .map((pair) => pair.trim())
    .map((pair) => pair.split(" "))

export const is_pair_too_big = (pair: string[]): boolean => parseInt(pair[0])>limits[pair[1]]
export const contains_too_big_pairs = (pairs: string[][]): boolean =>
  pairs.map(is_pair_too_big).some((pair) => pair);
export const solve = (line: string) => !contains_too_big_pairs(to_pairs(line));
