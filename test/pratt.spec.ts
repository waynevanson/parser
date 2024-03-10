import { describe, expect, it } from "vitest"
import { Pratt } from "../src/pratt"
import { Scanner } from "../src/scanner"
import { Lexer } from "../src/lexer"

describe(Pratt, () => {
  it("should parse the values", () => {
    const scanner = new Scanner("first, 324", {
      First: /first/y,
      Second: /[0-9]+/y,
      __SKIP__: /[,\s\r\t]+/y,
    })

    type Tokens = { First: string; Second: number }
    const lexer = new Lexer<Tokens, "__SKIP__">(scanner, {
      __SKIP__: "Skip",
      First: "Keep",
      Second: Number,
    })
    const pratt = new Pratt<Tokens, Array<string | number>>(
      lexer,
      {
        First: 0,
        Second: 1,
      },
      {
        First: { nud: (context) => [context.value] },
        Second: { led: (context) => context.left.concat([context.value]) },
      }
    )

    const parsed = pratt.parse()

    expect(parsed).toStrictEqual(["first", "324"])
  })
})
