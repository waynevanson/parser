import { describe, expect, it } from "vitest"
import { Option } from "../packages/option"

describe(Option, () => {
  it("should be good bruc", () => {
    const queue = new Option()

    const done = { done: true, value: undefined }

    expect(queue.peek()).toStrictEqual(done)
    expect(queue.next()).toStrictEqual(done)
    expect(queue.next()).toStrictEqual(done)
    expect(queue.peek()).toStrictEqual(done)
    expect(queue.next()).toStrictEqual(done)
    expect(queue.peek()).toStrictEqual(done)
  })

  it("should be okay", () => {
    const value = 20
    const queue = new Option(value)

    const done = { done: true, value: undefined }
    const progress = { value }

    expect(queue.peek()).toStrictEqual(progress)
    expect(queue.peek()).toStrictEqual(progress)
    expect(queue.next()).toStrictEqual(progress)
    expect(queue.next()).toStrictEqual(done)
    expect(queue.peek()).toStrictEqual(done)
    expect(queue.next()).toStrictEqual(done)
    expect(queue.peek()).toStrictEqual(done)

    queue.add(value)

    expect(queue.peek()).toStrictEqual(progress)
    expect(queue.peek()).toStrictEqual(progress)
    expect(queue.next()).toStrictEqual(progress)
    expect(queue.next()).toStrictEqual(done)
  })
})
