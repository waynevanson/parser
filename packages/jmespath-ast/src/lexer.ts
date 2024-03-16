import { Lexer } from "@waynevanson/lexer"
import { createScanner } from "./scanner.js"

export type TokenByIdentifier = {
  Identifier: string
  QuotedIdentifier: string
  Number: number
} & Record<
  | "Dot"
  | "Lbracket"
  | "Star"
  | "Pipe"
  | "At"
  | "Rbracket"
  | "Lbrace"
  | "Rbrace"
  | "Comma"
  | "Eq"
  | "Lte"
  | "Ne"
  | "Not"
  | "Gte"
  | "And"
  | "Ampersand"
  | "Lparen"
  | "Rparen"
  | "Gt"
  | "Or"
  | "Lt"
  | "Literal"
  | "Colon"
  | "Filter"
  | "Flatten",
  void
>

// let's use this syntax instead, I think it's easier to work with and we get guaranteed usage.
export function createLexer(text: string) {
  return new Lexer<TokenByIdentifier>(createScanner(text), {
    At: undefined,
    Comma: undefined,
    Dot: undefined,
    Eq: undefined,
    Gt: undefined,
    Gte: undefined,
    Lbrace: undefined,
    Identifier: undefined,
    Lbracket: undefined,
    Lte: undefined,
    Ne: undefined,
    Not: undefined,
    Pipe: undefined,
    Star: undefined,
    Rbracket: undefined,
    Rbrace: undefined,
    Number,
    QuotedIdentifier: undefined,
    And: undefined,
    Ampersand: undefined,
    Colon: undefined,
    Literal: undefined,
    Lparen: undefined,
    Rparen: undefined,
    Or: undefined,
    Lt: undefined,
    Flatten: undefined,
    Filter: undefined,
  })
}
