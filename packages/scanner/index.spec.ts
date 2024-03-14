import { describe, expect, it } from "vitest"
import { Scanner } from "./dist"

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
      ["Word", "Hello"],
      ["Punctuation", ","],
      ["Space", " "],
      ["Word", "World"],
      ["Punctuation", "!"],
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

  it("should peek twice and return the same token", () => {
    const text = "Hello, World!"
    const scanner = new Scanner(text, {
      Word: /\w+/y,
      Punctuation: /[\,\!]+/y,
      Space: /[\s\r\t]+/y,
    })

    expect(scanner.peek()).toStrictEqual({
      value: ["Word", "Hello"],
    })

    expect(scanner.peek()).toStrictEqual({
      value: ["Word", "Hello"],
    })

    expect(scanner.next()).toStrictEqual({
      value: ["Word", "Hello"],
    })

    expect(scanner.peek()).toStrictEqual({
      value: ["Punctuation", ","],
    })

    expect(scanner.peek()).toStrictEqual({
      value: ["Punctuation", ","],
    })

    expect(scanner.next()).toStrictEqual({
      value: ["Punctuation", ","],
    })

    expect(scanner.next()).toStrictEqual({
      value: ["Space", " "],
    })

    expect(scanner.next()).toStrictEqual({
      value: ["Word", "World"],
    })

    expect(scanner.next()).toStrictEqual({
      value: ["Punctuation", "!"],
    })

    expect(scanner.next()).toStrictEqual({
      done: true,
      value: undefined,
    })
  })
})
