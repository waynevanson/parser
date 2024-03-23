export type Json = JsonPrimitive | JsonArray | JsonObject

export type JsonPrimitive = string | boolean | number | null

export type JsonArray = Array<Json>

export interface JsonObject {
  [key: string]: Json
}

export interface JsonOptics {
  get: (json: Json) => Json
  setter: () => (json: Json, value: Json) => Json
}
