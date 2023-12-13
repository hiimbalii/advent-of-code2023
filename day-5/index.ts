type Input = { seeds: number[]; ranges: [number, number, number][][] };
type Solution = { seeds: number[]; map: Mapping };
type Mapping = { [key: number]: number };

const parseSeeds = (str: string) =>
  str
    .split(" ")
    .map((num) => parseInt(num))
    .filter((x) => !isNaN(x));
function log<T>(x: T, ...y: any[]): T {
  console.log(x, ...y);
  return x;
}
const parseInput = (seeds: string, ...input: string[]): Input => ({
  seeds: parseSeeds(seeds),
  ranges: input.map((group) =>
    group
      .split("\n")
      .filter((line) => !line.includes(":"))
      .filter((line) => line.trim().length)
      .map((line) => line.split(" ").map((num) => parseInt(num)))
      .map((line) => [line[0], line[1], line[2]]),
  ),
});

export const arrayOfIndexes = (len: number) =>
  Array.apply(null, Array(len)).map((_, i) => i);

export const within = (min: number, to: number, num: number) =>
  num >= min && num < min + to;
export const offsetValue = (src: number, dest: number, num: number) =>
  num + (dest - src);

export const mapSeed = (
  seed: number,
  [dest, src, to]: [number, number, number],
) => (within(src, to, seed) ? offsetValue(src, dest, seed) : seed);
export const reduceRanges = (
  seed: number,
  ranges: [number, number, number][],
) =>
  ranges.reduce(
    (acc, curr) => (mapSeed(seed, curr) === seed ? acc : mapSeed(seed, curr)),
    seed,
  );
export const fetchSeed = (seed: number, ranges: [number, number, number][][]) =>
  ranges.reduce(reduceRanges, seed);

export const run = (input: string[]) => {
  const { seeds, ranges }: Input = parseInput(
    input[0],
    ...input.slice(1).filter((str) => str.length),
  );

  return Math.min(...seeds.map((seed) => fetchSeed(seed, ranges)));
};
