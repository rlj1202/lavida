/**
 * Convert union type to intersection type.
 */
export type UnionToIntersection<T> = (
  T extends any ? (i: T) => any : never
) extends (i: infer I) => any
  ? I
  : never;
