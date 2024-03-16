import { Scanner } from "@waynevanson/scanner"

const regexpByIdentifier = {
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
}

export function createScanner(text: string) {
  return new Scanner(text, regexpByIdentifier)
}
