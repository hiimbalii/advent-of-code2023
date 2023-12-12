const numbers: { [_: string]: number } = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
const numbers_array = Object.entries(numbers);
const numbers_regex = new RegExp(`(${Object.keys(numbers).join("|")})`);

const replaceFirstNumber = (line: string): string => {
  return numbers_array.reduce(
    ({ smallestIdx, curr }, [name, value]) => {
      return line.indexOf(name) >= 0 && line.indexOf(name) < smallestIdx
        ? {
            smallestIdx: line.indexOf(name),
            curr: line.replace(name, value.toString()),
          }
        : { smallestIdx, curr };
    },
    { smallestIdx: Number.MAX_VALUE, curr: line }
  ).curr;
};
const replaceLastNumber = (line: string): string => {
  return numbers_array.reduce(
    ({ largestIdx: largestIdx, curr }, [name, value]) => {
      return line.indexOf(name) > largestIdx
        ? {
            largestIdx: line.lastIndexOf(name),
            curr: replaceLastOccurance(line, name, value.toString()),
          }
        : { largestIdx, curr };
    },
    { largestIdx: -1, curr: line }
  ).curr;
};
// const replaceFirstNumber = (line: string): string => {
//   return (
//     numbers_array
//       .map(([name, value]) => ({
//         smallestIdx: line.indexOf(name),
//         withNumber: line.replace(name, value.toString()),
//       }))
//       .filter((x) => x.smallestIdx > -1)
//       .reduce(
//         (prev, curr) => (prev.smallestIdx > curr.smallestIdx ? curr : prev),
//         { smallestIdx: Number.MAX_VALUE, withNumber: line }
//       ).withNumber ?? line
//   );
// };

// const replaceLastNumber = (line: string): string => {
//   return (
//     numbers_array
//       .map(([name, value]) => ({
//         largestIndex: line.lastIndexOf(name),
//         withNumber: replaceLastOccurance(line, name, value.toString()),
//       }))
//       .filter((x) => x.largestIndex > -1)
//       .reduce(
//         (prev, curr) => (prev.largestIndex < curr.largestIndex ? curr : prev),
//         { largestIndex: -1, withNumber: line }
//       ).withNumber ?? line
//   );
// };

export const run = (input: string[]) => {
  const input_numbers: any[] = input
    .filter((str) => str.length)
    .map(replaceFirstNumber)
    .map(replaceLastNumber)
    .map((str) => str.replace(/\D/g, ""))
    .map((str) => `${str.at(0)}${str.at(-1)}`)
    .map((x) => parseInt(x));
  return input_numbers.reduce((prev, curr) => prev + curr, 0);
};

const reverseStr = (str: string) => str.split("").reverse().join("");
const replaceLastOccurance = (str: string, original: string, newStr: string) =>
  reverseStr(str).replace(reverseStr(original), reverseStr(newStr));
