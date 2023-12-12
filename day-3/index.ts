//
// take all the numbers and their x,ys
// take the sybolds and their x,ys
// find all numbers with a symbold neraby?
export const run = (input: string[]) => {
  const part_number: number[] = input
    .filter((str) => str.length)
    .map(solve);
  console.log(largest_colors)
  return largest_colors.reduce((prev, curr) => prev + curr , 0);
};

export const solve = (line: string) => 
//
