import { Lexer } from "./lexer"
import { Scanner } from "./scanner"

export interface NUD<Token, Output> {
  type: "Nud"
  nud: (expr: (rbp: number) => Output, lexer: Lexer<any, Token>) => Output
}

export interface LED<Token, Output> {
  type: "Led"
  led: (
    left: Output,
    expr: (rbp: number) => Output,
    lexer: Lexer<any, Token>
  ) => Output
}


export type Parsable<Token, Output> = NUD<Token, Output> | LED<Token, Output>

export class Pratt<Identifier extends string, Token, Output> {
  constructor(
    private lexer: Lexer<Identifier, Token>,
    private lbps: Record<Identifier, number>,
    private parsables: Record<Identifier, Parsable<Token, Output>>
  ) {}

  parse(): Output {
    return this.expr(0)
  }

  // these always return tokens because EOF is a token that represents none.
  // our implementation uses iterator result.done to indicate this.
  //
  // should we have it here? How do we avoid exposing this to the user?
  // they only want to worry about converting token into output
  // and this is always Some.
  expr(rbp: number): IteratorResult<Output,Error> {
    const nud = this.nud()

    if (nud.done) {
      return {done:true,value:new Error("Nud should be a value")}
    }
    
    while (rbp < ) {
      ;[left, lbp] = this.led(left)
    }

    return left
  }

  nud(): IteratorResult<[Output, number],> {
    const token = this.lexer.next()

    if (token.done) return token

    const parsable = this.parsables[token.value.identifier]

    if (parsable.type !== "Nud") {
      throw new Error(`Token ${token.value.identifier} should be a nud`)
    }

    const output = parsable.nud((rbp) => this.expr(rbp), this.lexer)

    return { value: [output, this.lbps[token.value.identifier]] }
  }

  led(left: Output): IteratorResult<[Output, number]> {
    const token = this.lexer.next()

    if (token.done) return token

    const parsable = this.parsables[token.value.identifier]

    if (parsable.type !== "Led") {
      throw new Error(`Token ${token.value.identifier} should be a led`)
    }

    const output = parsable.led(left, (rbp) => this.expr(rbp), this.lexer)

    return { value: [output, this.lbps[token.value.identifier]] }
  }
}
