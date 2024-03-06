import { Lexer, captured, skip, transform } from "./lexer"
import { Pratt } from "./pratt"

type Variable =
  | "Null"
  | "String"
  | "Number"
  | "Boolean"
  | "Array"
  | "Object"
  | "Expref"

// check if I need to use negative lookahead/behind

const lexer = new Lexer({
  Identifier: captured(/[a-zA-Z][a-zA-Z0-9]*/y),
  Dot: captured(/\./y),
  Lbracket: captured(/\[/y),
  Star: captured(/\*/y),
  Pipe: captured(/\|/y),
  At: captured(/@/y),
  Rbracket: captured(/]/y),
  Lbrace: captured(/{/y),
  Rbrace: captured(/}/y),
  And: captured(/&&/y),
  Ampersand: captured(/&/y),
  Lparen: captured(/\(/y),
  Rparen: captured(/)/y),
  Comma: captured(/,/y),
  Colon: captured(/:/y),
  QuotedIdentifier: captured(/(?<=").+(?=")/y),
  // raw string, literal
  Literal: captured(/(?<=').+(?=')|(?<=`).+(?=`)/y),
  Eq: captured(/==/y),
  Gte: captured(/>=/y),
  Gt: captured(/>/y),
  Lte: captured(/<=/y),
  Ne: captured(/!=/y),
  Not: captured(/!/y),
  Number: transform(/-?[0-9]+/y, Number),
  _Spaces: skip(/[\s\r\t]+/y),
})

const tokenized = lexer.tokenize("jmespath")

export type Tokens = typeof tokenized extends Array<infer T> ? T : never

const pratt = new Pratt<Tokens, undefined>({
  Lbracket: { lbp: 2, nud: (expr, next) => undefined },
})
