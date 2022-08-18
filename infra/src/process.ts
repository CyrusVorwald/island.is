import { reformatYaml } from './dsl/serialize-to-yaml'

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

const content: string[] = []

rl.on('line', function (line: string) {
  content.push(line)
})

rl.on('close', async function () {
  console.log(reformatYaml(content.join('\n')))
})
