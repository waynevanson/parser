import { Lexer } from "."
import { Pratt } from "./pratt"
import { Scanner } from "./scanner"

type Variable =
  | "Null"
  | "String"
  | "Number"
  | "Boolean"
  | "Array"
  | "Object"
  | "Expref"

// check if I need to use negative lookahead/behind

const scanner = (text: string) =>
  new Scanner(text, {
    Identifier: /[a-zA-Z][a-zA-Z0-9]*/y,
    Dot: /\./y,
    Lbracket: /\[/y,
    Star: /\*/y,
    Pipe: /\|/y,
    At: /@/y,
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
    Ne: /!=/y,
    Not: /!/y,
    Number: /-?[0-9]+/y,
    _Spaces: /[\s\r\t]+/y,
  })

// let's use this syntax instead, I think it's easier to work with and we get guaranteed usage.
const lexer = (text: string) =>
  new Lexer<{ Identifier: string }, "__Spaces">(scanner(text), {})

// lets use dictionary syntax here too, just to simplify the process.
const parse = (text: string) => new Pratt(lexer(text), {}, {}).parse()
