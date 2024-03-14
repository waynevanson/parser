import { describe, expect, it } from "vitest"
import { Lexer } from "../Lexer"
import { Scanner } from "../packages/scanner"

describe(Lexer, () => {
  it("should peek at the next token", () => {
    const scanner = new Scanner("first, 324", {
      First: /first/y,
      Second: /[0-9]+/y,
      __SKIP__: /[,\s\r\t]+/y,
    })

    const lexer = new Lexer<{ First: string; Second: number }, "__SKIP__">(
      scanner,
      {
        __SKIP__: "Skip",
        First: "Keep",
        Second: Number,
      }
    )

    expect(lexer.peek()).toStrictEqual({ value: ["First", "first"] })
    expect(lexer.peek()).toStrictEqual({ value: ["First", "first"] })
    expect(lexer.next()).toStrictEqual({ value: ["First", "first"] })
    expect(lexer.next()).toStrictEqual({ value: ["Second", 324] })
  })

  it("should go through tokens", () => {
    const scanner = new Scanner("first, 324", {
      First: /first/y,
      Second: /[0-9]+/y,
      __SKIP__: /[,\s\r\t]+/y,
    })

    const lexer = new Lexer<{ First: string; Second: number }, "__SKIP__">(
      scanner,
      { __SKIP__: "Skip", First: "Keep", Second: Number }
    )

    const tokens = Array.from(lexer)

    expect(tokens).toStrictEqual([
      ["First", "first"],
      ["Second", 324],
    ])
  })
})
