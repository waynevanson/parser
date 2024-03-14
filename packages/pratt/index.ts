export type Token<TokenByIdentifier extends Record<string, unknown>> = {
  [Identifier in keyof TokenByIdentifier]: [
    Identifier,
    TokenByIdentifier[Identifier]
  ]
}[keyof TokenByIdentifier]

export interface Lexer<TokenByIdentifier extends Record<string, unknown>>
  extends IterableIterator<Token<TokenByIdentifier>> {
  peek(): IteratorResult<Token<TokenByIdentifier>>
  [Symbol.iterator](): Lexer<TokenByIdentifier>
}

export interface Nud<
  Identifier extends keyof any,
  TokenByIdentifier extends Record<Identifier, unknown>,
  Output
> {
  nud: (params: {
    lbp: number
    value: TokenByIdentifier[Identifier]
    expr: (rbp: number) => Output
    lexer: Lexer<TokenByIdentifier>
  }) => Output
}

export interface Led<
  Identifier extends keyof any,
  TokenByIdentifier extends Record<Identifier, unknown>,
  Output
> {
  led: (params: {
    lbp: number
    left: Output
    value: TokenByIdentifier[Identifier]
    expr: (rbp: number) => Output
    lexer: Lexer<TokenByIdentifier>
  }) => Output
}

export type Parsable<
  Identifier extends keyof any,
  TokenByIdentifier extends Record<Identifier, unknown>,
  Output
> =
  | Nud<Identifier, TokenByIdentifier, Output>
  | Led<Identifier, TokenByIdentifier, Output>

export type ParsableByIdentifier<
  TokenByIdentifier extends Record<string, unknown>,
  Output
> = {
  [Identifier in keyof TokenByIdentifier]: Parsable<
    Identifier,
    TokenByIdentifier,
    Output
  >
}

export class Pratt<TokenByIdentifier extends Record<string, unknown>, Output> {
  constructor(
    private lexer: Lexer<TokenByIdentifier>,
    private lbpByIdentifier: Record<keyof TokenByIdentifier, number>,
    private parsableByIdentifier: ParsableByIdentifier<
      TokenByIdentifier,
      Output
    >
  ) {}

  // only return if the peek token is done.
  parse(): Output {
    const output = this.expr(0)

    const peeked = this.lexer.peek()

    if (!peeked.done) {
      throw new Error(
        `Expected the next unconsumed token to be EOF but instead received ${peeked.value[0].toString()} ${
          peeked.value[1]
        } `
      )
    }

    return output
  }

  lbp(): number {
    const peeked = this.lexer.peek()

    if (peeked.done) return 0

    const identifier = peeked.value[0]

    const lbp = this.lbpByIdentifier[identifier]

    return lbp
  }

  expr(rbp: number): Output {
    let lefted = this.nud()

    while (rbp < this.lbp()) {
      lefted = this.led(lefted.value)

      if (lefted.done) {
        throw new Error(`Lefted should be a value, not EOF`)
      }
    }

    return lefted.value
  }

  nud(): IteratorResult<Output> {
    const tokened = this.lexer.next()

    if (tokened.done) return tokened

    const [identifier, value] = tokened.value

    const config = this.parsableByIdentifier[identifier]

    if (!("nud" in config)) {
      throw new Error(
        `Could not find nud in the config for the identifier ${identifier.toString()}`
      )
    }

    const lbp = this.lbpByIdentifier[identifier]

    const output = config.nud({
      lbp,
      value,
      lexer: this.lexer,
      expr: (rbp) => this.expr(rbp),
    })

    return { value: output }
  }

  led(left: Output): IteratorResult<Output, undefined> {
    const tokened = this.lexer.next()

    if (tokened.done) return tokened

    const [identifier, value] = tokened.value

    const config = this.parsableByIdentifier[identifier]

    if (!("led" in config)) {
      throw new Error(
        `Could not find led in the config for the identifier ${identifier.toString()} with value ${value}`
      )
    }

    const lbp = this.lbpByIdentifier[identifier]

    const output = config.led({
      lbp,
      value,
      lexer: this.lexer,
      expr: (rbp) => this.expr(rbp),
      left,
    })

    return { value: output }
  }
}
