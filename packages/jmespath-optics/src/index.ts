import { Ast } from "@waynevanson/jmespath-parser"

export type Json = JsonPrimitive | JsonArray | JsonObject

export type JsonPrimitive = string | boolean | number | null

export type JsonArray = Array<Json>

export interface JsonObject {
  [key: string]: Json
}

export function createOptics<Inner extends Json>(ast: Ast) {
  const get = (json: Json): Inner => {
    return undefined as never
  }

  const set = (json: Json, inner: Inner): Json => {
    return undefined as never
  }

  return { get, set }
}
