import { Pratt } from "@waynevanson/pratt"
import { TokenByIdentifier, Variable, createLexer } from "./lexer.js"
import { Sum } from "./utils.js"

type VariableType =
  | "Null"
  | "String"
  | "Number"
  | "Boolean"
  | "Array"
  | "Object"

export type Comparator =
  | "Equal"
  | "NotEqual"
  | "LessThan"
  | "LessThanEqual"
  | "GreaterThan"
  | "GreaterThanEqual"

export type Ast = Sum<{
  Comparison: { comparator: Comparator; lhs: Ast; rhs: Ast }
  Condition: { predicate: Ast; then: Ast }
  Identity: void
  Expref: { ast: Ast }
  Flatten: { node: Ast }
  Function: { name: string; args: Array<Ast> }
  Field: { name: string }
  Index: { idx: number }
  Literal: { value: Variable }
  Multilist: { elements: Array<Ast> }
  MultiHash: { elements: Array<{ key: string; value: Ast }> }
  Not: { node: Ast }
  Projection: { lhs: Ast; right: Ast }
  ObjectValues: { lhs: Ast; right: Ast }
  And: { lhs: Ast; right: Ast }
  Or: { lhs: Ast; right: Ast }
  Slice: { start: number | null; stop: number | null; step: number }
  Subexpr: { lhs: Ast; right: Ast }
}>

const lbps = {
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
}

export const parse = (text: string) =>
  new Pratt<TokenByIdentifier, Ast>(createLexer(text), lbps, {
    At: {
      nud: ({ value }) => ({ type: "Identity", value }),
    },
    Identifier: {
      nud: ({ value }) => ({ type: "Field", value: { name: value } }),
    },
    QuotedIdentifier: {
      nud: ({ value, lexer }) => {
        if (lexer.peek().value === "(") {
          throw new Error("Quoted strings can't be function name")
        }

        return { type: "Field", value: { name: value } }
      },
    },
    //@ts-ignore
    Star: {},
    Literal: { nud: ({ value }) => ({ type: "Literal", value: { value } }) },
  }).parse()
