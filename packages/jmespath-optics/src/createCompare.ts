import { Comparator } from "@waynevanson/jmespath-parser"
import { Json, JsonPrimitive } from "./types.js"
import { isJsonPrimitive, isNumber } from "./utils.js"

export function createCompare(
  comparator: Comparator
): (lhs: Json, rhs: Json) => boolean {
  switch (comparator) {
    case "Equal":
      return (lhs, rhs) => {
        if (!isJsonPrimitive(lhs)) {
          throw new Error(`lhs is not primitive`)
        }

        if (!isJsonPrimitive(rhs)) {
          throw new Error(`rhs is not primitive`)
        }

        return lhs === rhs
      }

    case "GreaterThan":
      return (lhs, rhs) => {
        if (!isNumber(lhs)) {
          throw new Error(`Expected lhs to be a number`)
        }

        if (!isNumber(rhs)) {
          throw new Error(`Expected rhs to be a number`)
        }

        return lhs > rhs
      }

    case "GreaterThanEqual":
      return (lhs, rhs) => {
        if (!isNumber(lhs)) {
          throw new Error(`Expected lhs to be a number`)
        }

        if (!isNumber(rhs)) {
          throw new Error(`Expected rhs to be a number`)
        }

        return lhs >= rhs
      }

    case "LessThan":
      return (lhs, rhs) => {
        if (!isNumber(lhs)) {
          throw new Error(`Expected lhs to be a number`)
        }

        if (!isNumber(rhs)) {
          throw new Error(`Expected rhs to be a number`)
        }

        return lhs < rhs
      }

    case "LessThanEqual":
      return (lhs, rhs) => {
        if (!isNumber(lhs)) {
          throw new Error(`Expected lhs to be a number`)
        }

        if (!isNumber(rhs)) {
          throw new Error(`Expected rhs to be a number`)
        }

        return lhs <= rhs
      }

    case "NotEqual":
      return (lhs, rhs) => {
        if (!isNumber(lhs)) {
          throw new Error(`Expected lhs to be a number`)
        }

        if (!isNumber(rhs)) {
          throw new Error(`Expected rhs to be a number`)
        }

        return lhs != rhs
      }
  }
}
