import { Json, JsonPrimitive } from "./types.js"

export function isJsonPrimitive(value: Json): value is JsonPrimitive {
  return ["string", "object", "boolean"].includes(typeof value)
}

export function isNumber(value: Json): value is number {
  return typeof value === "number"
}
