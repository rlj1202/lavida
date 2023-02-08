/**
 * Merge all property keys into one object type.
 */
export type MergeIntersection<T> = { [K in keyof T]: T[K] };
