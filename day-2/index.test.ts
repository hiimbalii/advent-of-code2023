import { run } from "./index"
import * as fs from 'fs'

const lines= fs.readFileSync("./input").toString().split('\n')
const lines_valid = fs.readFileSync("./input.validate").toString().split('\n')

it('validate', ()=>{
  const result = run(lines_valid)
  expect(result).toBe(142)
})

it('solve', ()=>{
  const result = run(lines)
  console.log(result)
})

