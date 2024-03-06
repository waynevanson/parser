export class Peekable<Value> implements IterableIterator<Value> {
  private buffer: Value | undefined

  constructor(private iterable: IterableIterator<Value>) {}

  peek(): IteratorResult<Value> {
    if (this.buffer !== undefined) {
      return { value: this.buffer }
    }

    const consumed = this.iterable.next()

    if (consumed.done) return consumed

    this.buffer = consumed.value

    return consumed
  }

  next(): IteratorResult<Value> {
    if (this.buffer !== undefined) {
      const value = this.buffer
      this.buffer = undefined
      return { value }
    }

    return this.iterable.next()
  }

  [Symbol.iterator]() {
    return new Peekable<Value>(this.iterable[Symbol.iterator]())
  }
}
