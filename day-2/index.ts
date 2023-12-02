export const run = (input: string[])=>{
  const input_numbers:number[] = input.filter(str=>str.length)
    .map(str=>str.replace(/\D/g, ''))
    .map(str=>`${str.at(0)}${str.at(-1)}`)
    .map(str=>parseInt(str))
  console.log(input_numbers)
  return input_numbers.reduce((prev, curr)=>prev+curr, 0)
}
