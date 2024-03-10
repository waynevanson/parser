import { TokenConfigByIdentifier } from "./lexer"

export interface Lexer<TokenByIdentifier extends Record<string, unknown>>
  extends IterableIterator<Token<TokenByIdentifier>> {
  peek(): IteratorResult<Token<TokenByIdentifier>>
}

export interface Nud<
  Identifier extends string,
  TokenByIdentifier extends Record<Identifier, unknown>,
  Output
> {
  nud: (params: {
    rbp: number
    value: TokenByIdentifier[Identifier]
    expr: (rbp: number) => Output
    lexer: Lexer<TokenByIdentifier>
  }) => Output
}

export interface Led<
  Identifier extends string,
  TokenByIdentifier extends Record<Identifier, unknown>,
  Output
> {
  led: (params: {
    rbp: number
    left: Output
    value: TokenByIdentifier[Identifier]
    expr: (rbp: number) => Output
    lexer: Lexer<TokenByIdentifier>
  }) => Output
}

export type Parsable<
  Identifier extends string,
  TokenByIdentifier extends Record<Identifier, unknown>,
  Output
> =
  | Nud<Identifier, TokenByIdentifier, Output>
  | Led<Identifier, TokenByIdentifier, Output>

export type Token<TokenByIdentifier extends Record<string, unknown>> = {
  [Identifier in keyof TokenByIdentifier]: [
    Identifier,
    TokenByIdentifier[Identifier]
  ]
}[keyof TokenByIdentifier]

export class Pratt<TokenByIdentifier extends Record<string, unknown>, Output> {
  constructor(
    private lexer: Lexer<TokenByIdentifier>,
    private lbps: Record<keyof TokenByIdentifier, number>,
    private parsables: {
      [Identifier in keyof TokenByIdentifier]: Parsable<
        Identifier & string,
        TokenByIdentifier,
        Output
      >
    }
  ) {}

  parse(): Output {
    const output = this.expr(0)

    if (!this.lexer.peek().done) {
      throw new Error("Did not reach EOF")
    }

    return output
  }

  // nud first, led for rest
  expr(rbp: number): Output {
    let current = this.nud()

    let peeked = this.lexer.peek()

    if (peeked.done) {
      //?
      throw new Error("done")
    }

    let lbp = this.lbps[peeked.value[0]]

    while (rbp < lbp) {
      current = this.led(current[1])
    }

    return current[1]
  }

  nud(): [keyof TokenByIdentifier, Output] {
    const token = this.lexer.next()

    if (token.done) {
      throw new Error("nuddy")
    }

    const [identifier, value] = token.value

    const parsable = this.parsables[identifier]

    if (!("nud" in parsable)) {
      throw new Error(`Token ${token.value} should be a nud`)
    }

    const output = parsable.nud({
      expr: (rbp: number) => this.expr(rbp),
      lexer: this.lexer,
      rbp: this.lbps[identifier],
      value: value as never,
    })

    return [identifier, output]
  }

  led(left: Output): [keyof TokenByIdentifier, Output] {
    const token = this.lexer.next()

    if (token.done) {
      throw new Error("leddy")
    }

    const [identifier, value] = token.value
    const parsable = this.parsables[identifier]

    if (!("led" in parsable)) {
      throw new Error(`Token ${token.value} should be a led`)
    }

    const output = parsable.led({
      expr: (rbp) => this.expr(rbp),
      left,
      lexer: this.lexer,
      rbp: this.lbps[identifier],
      value: value as never,
    })

    return [identifier, output]
  }
}
