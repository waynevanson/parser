import { describe, expect, it } from "vitest"
import { Pratt } from "./index.js"
import { Scanner } from "@waynevanson/scanner"
import { Lexer } from "@waynevanson/lexer"

describe(Pratt, () => {
  it("should parse the values", () => {
    const scanner = new Scanner("1 + 2", {
      number: /[0-9]+/y,
      operator: /[\+\-\*\/\^]/y,
      spaces: /[,\s\r\t]+/y,
    })

    type Tokens = { number: number; operator: string }

    const lexer = new Lexer<Tokens, "spaces">(scanner, {
      spaces: "Skip",
      number: Number,
      operator: "Keep",
    })

    type Output =
      | {
          number: number
        }
      | {
          operator: string
          left: Output
          right: Output
        }

    const pratt = new Pratt<Tokens, Output>(
      lexer,
      {
        number: 0,
        operator: 1,
      },
      {
        number: {
          nud: (context) => ({ number: context.value }),
        },
        operator: {
          led: (context) => ({
            left: context.left,
            operator: context.value,
            right: context.expr(context.lbp),
          }),
        },
      }
    )

    const parsed = pratt.parse()

    expect(parsed).toStrictEqual({
      operator: "+",
      left: { number: 1 },
      right: { number: 2 },
    })
  })
})
