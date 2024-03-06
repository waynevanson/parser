import { Queue } from "./queue"

export interface Lexeme<Identifier> {
  identifier: Identifier
  characters: string
}

export class Scanner<Identifier extends string>
  implements IterableIterator<Lexeme<Identifier>>
{
  private identifiers: Array<Identifier>

  constructor(
    private text: string,
    private regexpByIdentifier: Record<Identifier, RegExp>,
    private index = 0,
    private queue = new Queue<Lexeme<Identifier>>()
  ) {
    this.identifiers = Object.keys(regexpByIdentifier) as Array<Identifier>

    const unstickies = Object.entries(regexpByIdentifier).filter(
      ([_, regexp]) => !(regexp as RegExp).sticky
    )

    if (unstickies.length > 0) {
      throw new Error(
        `The following regular expressions must be sticky: containing the "y" flag:\n ${JSON.stringify(
          unstickies,
          null,
          2
        )}`
      )
    }
  }

  peek(): IteratorResult<Lexeme<Identifier>> {
    const queued = this.queue.peek()

    if (!queued.done) {
      return queued
    }

    if (this.index >= this.text.length) {
      return { value: undefined, done: true }
    }

    const nexted = this.next()

    if (nexted.done) return nexted

    this.queue.push(nexted.value)

    return nexted
  }

  next(): IteratorResult<Lexeme<Identifier>> {
    if (this.index >= this.text.length) {
      return { value: undefined, done: true }
    }

    for (const identifier of this.identifiers) {
      const regexp = this.regexpByIdentifier[identifier]!

      regexp.lastIndex = this.index

      const match = regexp.exec(this.text)

      if (match === null) continue

      const value = { identifier, characters: match[0] }

      this.index = regexp.lastIndex

      return { value }
    }

    throw new Error("Lexeme matching regular expressions not found")
  }

  [Symbol.iterator]() {
    return new Scanner(
      this.text,
      this.regexpByIdentifier,
      this.index,
      this.queue[Symbol.iterator]()
    )
  }
}
