import fs from "node:fs"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { identity, interpret } from "../src/index.js"
import { parse } from "@waynevanson/jmespath-parser"

interface Suite {
  given: unknown
  cases: Array<{ expression: string; result: unknown }>
}

const fixturesDir = path.join(import.meta.dirname, "../fixtures")
const fixturesName = fs
  .readdirSync(fixturesDir)
  .map((name) => path.basename(name, ".json"))

describe.each(fixturesName)("%s", (fixtureName) => {
  const filePath = path.join(fixturesDir, `${fixtureName}.json`)

  const json = JSON.parse(fs.readFileSync(filePath, "utf8")) as Array<Suite>
  const suites = json.map(
    (suite) =>
      [
        suite.given,
        suite.cases.map((case_) => [case_.expression, case_.result] as const),
      ] as const
  )

  describe.each(suites)("%s", (given, cases) => {
    test.each(cases)("%s => %s", (expression, result) => {
      const ast = parse(expression)

      const interpreted = interpret(ast, identity)

      const outcome = interpreted.get(given as never)

      expect(outcome).toStrictEqual(result)
    })
  })
})
