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
    rbp: number
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
    rbp: number
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

export class Pratt<
  TokenByIdentifier extends Record<string, unknown>,
  EOF extends keyof TokenByIdentifier,
  Output
> {
  constructor(
    private lexer: Lexer<TokenByIdentifier>,
    private lbpByIdentifier: Record<
      Exclude<keyof TokenByIdentifier, EOF>,
      number
    >,
    private parsableByIdentifier: ParsableByIdentifier<
      TokenByIdentifier,
      Output
    >,
    // we need to omit this from the parsable config
    private EOF: EOF
  ) {}

  // how to represent EOF in type system?
  parse() {
    this.expr(0)
  }

  expr(rbp: number) {
    const first = this.nud()
  }

  nud(): IteratorResult<Output> {}

  led(left): IteratorResult<Output> {}
}
