import { Queue } from "./queue"

export interface Scanner<Identifier extends string>
  extends IterableIterator<[Identifier, string]> {
  peek(): IteratorResult<[Identifier, string]>
  next(): IteratorResult<[Identifier, string]>
  [Symbol.iterator](): Scanner<Identifier>
}

export type Keep = "Keep"
export type Skip = "Skip"
export type Transform<Value> = (characters: string) => Value

export type TokenConfig<Value> = Keep | Skip | Transform<Value>

export type TokenConfigByIdentifier<
  ValueByIdentifier extends Record<string, unknown>,
  Skippable extends string
> = {
  [Identifier in keyof ValueByIdentifier]: string extends ValueByIdentifier[Identifier]
    ? Keep | Transform<ValueByIdentifier[Identifier]>
    : Transform<ValueByIdentifier[Identifier]>
} & Record<Skippable, Skip>

export type Token<TokenByIdentifier extends Record<string, unknown>> = {
  [Identifier in keyof TokenByIdentifier]: [
    Identifier,
    TokenByIdentifier[Identifier]
  ]
}[keyof TokenByIdentifier]

export class Lexer<
  ValueByIdentifier extends Record<string, unknown>,
  Skippable extends string
> implements IterableIterator<Token<ValueByIdentifier>>
{
  constructor(
    private scanner: Scanner<(string & keyof ValueByIdentifier) | Skippable>,
    private tokenConfigByIdentifer: TokenConfigByIdentifier<
      ValueByIdentifier,
      Skippable
    >,
    private queue: Queue<Token<ValueByIdentifier>> = new Queue()
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
    return new Lexer<ValueByIdentifier, Skippable>(
      this.scanner[Symbol.iterator](),
      this.tokenConfigByIdentifer,
      this.queue[Symbol.iterator]()
    )
  }
}
