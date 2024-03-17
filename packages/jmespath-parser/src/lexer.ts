import { Lexer } from "@waynevanson/lexer"
import { createScanner } from "./scanner.js"
import { Sum } from "./utils.js"
import { Ast } from "./index.js"

export type Variable = Sum<{
  Null: void
  String: string
  Bool: boolean
  Number: number
  Array: Array<Variable>
  Object: Record<string, Variable>
  Expref: Ast
}>

export type TokenByIdentifier = {
  Identifier: string
  QuotedIdentifier: string
  Number: number
  Literal: Variable
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
    Literal: (text: string) => {
      const replaced = text.replaceAll("\\`", "`")

      const A = Symbol("Resolved")

      const value = JSON.parse(text, (_, value: unknown): Variable => {
        switch (typeof value) {
          case "bigint":
            return { type: "Number", value: Number(value) }

          case "number":
            return { type: "Number", value }

          case "boolean":
            return { type: "Bool", value }

          case "string":
            return { type: "String", value }

          // this object will always be a Variable, as JSON.parse starts from deepest first.
          // and Variables are objects
          case "object":
            if (value == null) break

            // todo - fix
            //@ts-ignore
            return { type: "Object", value: value as Variable }
        }

        throw new Error("")
      })

      return value
    },
    Lparen: undefined,
    Rparen: undefined,
    Or: undefined,
    Lt: undefined,
    Flatten: undefined,
    Filter: undefined,
  })
}
