declare global {
  type JsonValueType<
    D extends number = typeof Number.POSITIVE_INFINITY, // max depth
    A extends Array<0> = [] // accumulator
  > =
    | null | boolean | number | string |
    (A['length'] extends D ? unknown : Array<JsonValueType<D, [0, ...A]>>) | // arrays
    (A['length'] extends D ? unknown : { [k: string]: JsonValueType<D, [0, ...A]> }) // objects

  type JsonType = Record<string, JsonValueType>

  namespace HousekeepingTypes {
    export type { JsonType }
  }
}

export {}
