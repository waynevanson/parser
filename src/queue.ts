export class Queue<Value> implements IterableIterator<Value> {
  constructor(private items: Array<Value> = []) {}

  push(...args: Array<Value>) {
    this.push(...args)
  }

  pull(count: number): Array<Value> {
    return this.items.splice(0, count)
  }

  peek(): IteratorResult<Value> {
    if (this.items.length <= 0) {
      return { value: undefined, done: true }
    }

    const value = this.items[0]!

    return { value }
  }

  next(): IteratorResult<Value> {
    const pulled = this.pull(1)

    if (pulled.length <= 0) {
      return { value: undefined, done: true }
    }

    const value = pulled[0]!

    return { value }
  }

  [Symbol.iterator]() {
    return new Queue<Value>(this.items.slice())
  }
}
