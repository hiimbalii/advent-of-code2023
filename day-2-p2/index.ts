type Colors = {
  red: number;
  green: number;
  blue: number;
};

export const power = (colors: Colors) => colors.red * colors.green * colors.blue;
export const run = (input: string[]) => {
  const largest_colors: Colors[] = input
    .filter((str) => str.length)
    .map(solve);
  console.log(largest_colors)
  return largest_colors.reduce((prev, curr) => prev + power(curr), 0);
};

type Pair = [number, keyof Colors];
export const to_pairs = (line: string): Pair[] =>
  line
    .slice(line.indexOf(":") + 1)
    .split(";")
    .flatMap((line) => line.split(","))
    .map((pair) => pair.trim())
    .map((pair) => pair.split(" "))
    .map((pair) => [parseInt(pair[0]), pair[1] as keyof Colors]);

export const filter_color = (color: keyof Colors, pairs: Pair[]): Pair[] =>
  pairs.filter(([_, curr_color]) => curr_color === color);

export const map_to_number = (pairs: Pair[]): number[] => pairs.map((pair) => pair[0]);


export const find_largest = (numbers: number[]) => Math.max(...numbers);

export const find_largest_of_each = (pairs: Pair[]): Colors => ({
  red: find_largest(map_to_number(filter_color("red", pairs))),
  green: find_largest(map_to_number(filter_color("green", pairs))),
  blue: find_largest(map_to_number(filter_color("blue", pairs))),
});

export const solve = (line: string) => find_largest_of_each(to_pairs(line));
