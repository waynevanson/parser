import { describe, expect, it } from "vitest"
import { Scanner } from "../src/scanner"

describe(Scanner, () => {
  it("should scan some text", () => {
    const text = "Hello, World!"
    const scanner = new Scanner(text, {
      Word: /\w+/y,
      Punctuation: /[\,\!]+/y,
      Space: /[\s\r\t]+/y,
    })

    const lexemes = Array.from(scanner)

    expect(lexemes).toStrictEqual([
      {
        identifier: "Word",
        characters: "Hello",
      },
      {
        identifier: "Punctuation",
        characters: ",",
      },
      { identifier: "Space", characters: " " },
      {
        identifier: "Word",
        characters: "World",
      },
      {
        identifier: "Punctuation",
        characters: "!",
      },
    ])
  })

  it("should throw when a regex is not sticky", () => {
    expect(
      () =>
        new Scanner("", {
          Word: /\w+/y,
          Punctuation: /[\,\!]+/,
          Space: /[\s\r\t]+/y,
        })
    ).toThrowError()
  })
})
