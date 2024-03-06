import { Scanner } from "./scanner"

export interface Capture {
  type: "Captured"
}

export interface Skip {
  type: "Skip"
}

export interface Transform<Value> {
  type: "Transform"
  transform: (characters: string) => Value
}

export interface Token<Identifier extends string, Value> {
  identifier: Identifier
  value: Value
}

export type Tokenable<Value> = Capture | Skip | Transform<Value>

export type Tokenized<
  Identifier extends string,
  Tokenables extends Record<Identifier, Tokenable<unknown>>
> = {
  [P in keyof Tokenables]: Tokenables[P] extends Capture
    ? Token<Identifier, string>
    : Tokenables[P] extends Transform<infer Value>
    ? Token<Identifier, Value>
    : never
}[keyof Tokenables]

// could do one or two types for the Lexer, or use this API.
export class Lexer<Identifier extends string, Token>
  implements
    IterableIterator<
      Tokenized<Identifier, Record<Identifier, Tokenable<Token>>>
    >
{
  constructor(
    private scanner: Scanner<Identifier>,
    private tokenableByIdentifer: Record<Identifier, Tokenable<Token>>
  ) {}

  // todo
  peek() {}

  next(): IteratorResult<
    Tokenized<Identifier, Record<Identifier, Tokenable<Token>>>
  > {
    let value:
      | undefined
      | Tokenized<Identifier, Record<Identifier, Tokenable<Token>>>

    let lexeme = this.scanner.next()

    while (!value) {
      if (lexeme.done) return lexeme

      const tokenable = this.tokenableByIdentifer[lexeme.value.identifier]!

      switch (tokenable.type) {
        case "Captured":
          value = lexeme.value as never
          break

        case "Transform":
          value = {
            identifier: lexeme.value.identifier,
            value: tokenable.transform(lexeme.value.characters),
          } as never
          break

        case "Skip":
          lexeme = this.scanner.next()
      }
    }

    return { value }
  }

  [Symbol.iterator]() {
    return new Lexer(this.scanner, this.tokenableByIdentifer)
  }
}
