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

export type TokenConfig<Value> = Capture | Skip | Transform<Value>

export type TokenConfigByIdentifier<
  Identifier extends string,
  Token extends { identifier: Identifier; value: unknown }
> = {
  [I in Identifier]: I extends Token["identifier"]
    ? Token extends any
      ? Token["identifier"] extends I
        ? string extends Token["value"]
          ? Capture | Transform<string>
          : Transform<Token["value"]>
        : never
      : never
    : Skip
}

export class Lexer<
  Identifier extends string,
  Token extends { identifier: Identifier; value: unknown }
> implements IterableIterator<Token>
{
  constructor(
    private scanner: Scanner<Identifier>,
    private tokenConfigByIdentifer: TokenConfigByIdentifier<Identifier, Token>
  ) {}

  next() {
    let value: undefined | Token

    let lexeme = this.scanner.next()

    while (!value) {
      if (lexeme.done) return lexeme

      //@ts-ignore
      const tokenConfig = this.tokenConfigByIdentifer[
        lexeme.value.identifier
      ]! as TokenConfig<unknown>

      switch (tokenConfig.type) {
        case "Captured":
          value = lexeme.value as never
          break

        case "Transform":
          value = {
            identifier: lexeme.value.identifier,
            value: tokenConfig.transform(lexeme.value.characters),
          } as never
          break

        case "Skip":
          lexeme = this.scanner.next()
      }
    }

    return { value }
  }

  [Symbol.iterator]() {
    return new Lexer(this.scanner, this.tokenConfigByIdentifer)
  }
}

new Lexer<
  "Hello" | "World" | "Earth",
  // capture or transform
  | { identifier: "Hello"; value: string }
  // transform
  | { identifier: "Earth"; value: number }
  // skip world
>(new Scanner("", { Hello: /s/y, World: /y/y, Earth: /e/y }), {
  Hello: { type: "Captured" },
  World: { type: "Skip" },
  // should not be skip
  Earth: { type: "Transform", transform: Number },
})

type A = string extends string ? 1 : 2
