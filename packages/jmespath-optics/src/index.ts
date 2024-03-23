import { Ast } from "@waynevanson/jmespath-parser"
import { createCompare } from "./createCompare.js"
import { JsonOptics } from "./types.js"
import { isJsonPrimitive } from "./utils.js"

export const identity: JsonOptics = {
  get: (json) => json,
  setter: () => (json, value) => value,
}

export function interpret(ast: Ast, optics: JsonOptics): JsonOptics {
  switch (ast.type) {
    case "Identity":
      return optics

    case "Comparison":
      const { comparator, lhs, rhs } = ast.value

      const left = interpret(lhs, optics)

      const compare = createCompare(comparator)

      const right = interpret(rhs, optics)

      return {
        get: (json) => compare(left.get(json), right.get(json)),

        setter: () => {
          throw new Error("Expected setter not to be used for Comparison")
        },
      }

    case "Field": {
      const { name } = ast.value

      return {
        get: (json) => {
          if (typeof json !== "object") {
            throw new Error("Expected json to be an object")
          }

          if (typeof json === null) {
            throw new Error("Expected json to not be null")
          }

          return (json as never)[name]
        },

        setter: () => (json, value) => {
          if (typeof json !== "object") {
            throw new Error("Expected json to be an object")
          }

          if (typeof json === null) {
            throw new Error("Expected json to not be null")
          }

          return { ...json, [name]: value }
        },
      }
    }

    case "Index": {
      const { idx } = ast.value

      return {
        get: (json) => {
          if (!Array.isArray(json)) {
            throw new Error("Expected json to be an array")
          }

          return json[idx]
        },

        setter: () => (json, value) => {
          if (!Array.isArray(json)) {
            throw new Error("Expected json to be an array")
          }

          const array = json.slice()

          array.splice(idx, 1, value)

          return array
        },
      }
    }

    case "And": {
      const { lhs, right: rhs } = ast.value

      const left = interpret(lhs, optics)

      const right = interpret(rhs, optics)

      return {
        get: (json) => {
          const l = left.get(json)

          if (!isJsonPrimitive(l)) {
            throw new Error("Expected left to be a json primitive")
          }

          const r = right.get(json)

          if (!isJsonPrimitive(r)) {
            throw new Error("Expected right to be a json primitive")
          }

          return l && r
        },

        setter: () => {
          throw new Error("Expected set not be called for And")
        },
      }
    }

    case "Condition": {
      const { predicate, then } = ast.value

      const boolean = interpret(predicate, optics)

      return { get: (json) => {} }
    }
  }
}

export function optics(ast: Ast) {
  const { get, setter } = interpret(ast, identity)

  const set = setter()

  return { get, set }
}
