import { Option } from "@waynevanson/option"

export interface Scanner<Identifier>
  extends IterableIterator<[Identifier, string]> {
  peek(): IteratorResult<[Identifier, string]>
  next(): IteratorResult<[Identifier, string]>
  [Symbol.iterator](): Scanner<Identifier>
}

export type Keep = undefined
export type Transform<Value> = (characters: string) => Value

export type TokenConfig<Value> = Keep | Transform<Value>

export type TokenConfigByIdentifier<
  ValueByIdentifier extends Record<string, unknown>
> = {
  [Identifier in keyof ValueByIdentifier]: void extends ValueByIdentifier[Identifier]
    ? Keep
    : string extends ValueByIdentifier[Identifier]
    ? Keep | Transform<ValueByIdentifier[Identifier]>
    : Transform<ValueByIdentifier[Identifier]>
}

export type Token<TokenByIdentifier extends Record<string, unknown>> = {
  [Identifier in keyof TokenByIdentifier]: [
    Identifier,
    TokenByIdentifier[Identifier]
  ]
}[keyof TokenByIdentifier]

export class Lexer<ValueByIdentifier extends Record<string, unknown>>
  implements IterableIterator<Token<ValueByIdentifier>>
{
  constructor(
    private scanner: Scanner<keyof ValueByIdentifier | string>,
    private tokenConfigByIdentifer: TokenConfigByIdentifier<ValueByIdentifier>,
    private queue: Option<Token<ValueByIdentifier>> = new Option()
  ) {}

  peek(): IteratorResult<Token<ValueByIdentifier>> {
    const queue = this.queue.peek()

    if (!queue.done) return queue

    const next = this.next()

    if (next.done) return next

    this.queue.add(next.value)

    return next
  }

  next(): IteratorResult<Token<ValueByIdentifier>> {
    const peeked = this.queue.peek()

    if (!peeked.done) {
      this.queue.delete()
      return peeked
    }

    let lexeme = this.scanner.next()

    let token: Token<ValueByIdentifier> | undefined

    while (!token) {
      if (lexeme.done) return lexeme

      const [identifier, characters] = lexeme.value

      const config: TokenConfig<unknown> = this.tokenConfigByIdentifer[
        identifier
      ] as never

      // not sure why config isn't having its type constrained..
      if (typeof config === "function") {
        //@ts-ignore
        token = [identifier as keyof ValueByIdentifier, config(characters)]

        break
      }

      if (config === "Keep") {
        //@ts-ignore
        token = [identifier as keyof ValueByIdentifier, characters]

        break
      }

      lexeme = this.scanner.next()
    }

    return { value: token! }
  }

  [Symbol.iterator]() {
    return new Lexer<ValueByIdentifier>(
      this.scanner[Symbol.iterator](),
      this.tokenConfigByIdentifer,
      this.queue[Symbol.iterator]()
    )
  }
}
