const EMPTY = Symbol("Empty")

export class Queue<Value> implements IterableIterator<Value> {
  constructor(private value: typeof EMPTY | Value = EMPTY) {}

  add(value: Value) {
    this.value = value
  }

  delete() {
    this.value = EMPTY
  }

  peek(): IteratorResult<Value> {
    if (this.value === EMPTY) {
      return { done: true, value: undefined }
    }

    return { value: this.value }
  }

  next(): IteratorResult<Value> {
    if (this.value === EMPTY) {
      return { done: true, value: undefined }
    }

    const value = this.value

    this.value = EMPTY

    return { value }
  }

  [Symbol.iterator]() {
    return new Queue<Value>(this.value)
  }
}
