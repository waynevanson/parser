import { Lexer } from "@waynevanson/lexer"
import { Pratt } from "@waynevanson/pratt"
import { Scanner } from "@waynevanson/scanner"

type Variable = "Null" | "String" | "Number" | "Boolean" | "Array" | "Object"

// check if I need to use negative lookahead/behind

const scanner = (text: string) =>
  new Scanner(text, {
    Identifier: /[a-zA-Z][a-zA-Z0-9]*/y,
    Dot: /\./y,
    Flatten: /\[\]/y,
    Lbracket: /\[/y,
    Star: /\*/y,
    Or: /\|\|/y,
    Pipe: /\|/y,
    At: /\@/y,
    Rbracket: /]/y,
    Lbrace: /{/y,
    Rbrace: /}/y,
    And: /&&/y,
    Ampersand: /&/y,
    Lparen: /\(/y,
    Rparen: /)/y,
    Comma: /,/y,
    Colon: /:/y,
    QuotedIdentifier: /(?<=").+(?=")/y,
    // raw string, literal
    Literal: /(?<=')(.?)+(?=')|(?<=`).+(?=`)/sy,
    Eq: /==/y,
    Gte: />=/y,
    Gt: />/y,
    Lte: /<=/y,
    Lt: /</y,
    Ne: /!=/y,
    Not: /!/y,
    Number: /-?[0-9]+/y,
    Filter: /\[\?/y,
    _Spaces: /[\s\r\t]+/y,
  })

type TokenByIdentifier = {
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
const lexer = (text: string) =>
  new Lexer<TokenByIdentifier>(scanner(text), {
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

export type Output = {}

// lets use dictionary syntax here too, just to simplify the process.
const parse = (text: string) =>
  new Pratt<TokenByIdentifier, Output>(
    lexer(text),
    {
      Pipe: 1,
      Or: 2,
      And: 3,
      Eq: 5,
      Gt: 5,
      Lt: 5,
      Lte: 5,
      Gte: 5,
      Ne: 5,
      Flatten: 9,
      Star: 20,
      Filter: 21,
      Dot: 40,
      Not: 45,
      Lbrace: 50,
      Lbracket: 55,
      Lparen: 60,
      Ampersand: 0,
      At: 0,
      Colon: 0,
      Comma: 0,
      Identifier: 0,
      Literal: 0,
      Number: 0,
      QuotedIdentifier: 0,
      Rbrace: 0,
      Rbracket: 0,
      Rparen: 0,
    },
    {}
  ).parse()
