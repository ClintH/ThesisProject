//#region ../packages/core/src/ts-utility.d.ts
/**
 * Remaps `TShape` so each field has type `TFieldValue`.
 * Recursive.
 */
type RecursiveReplace<TShape, TFieldValue> = { [P in keyof TShape]: TShape[P] extends (infer U)[] ? RecursiveReplace<U, TFieldValue>[] : TShape[P] extends number | string | symbol | undefined ? TFieldValue : RecursiveReplace<TShape[P], TFieldValue> };
/**
 * A type where every property is partial (recursive)
 */
type RecursivePartial<T> = { [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object | undefined ? RecursivePartial<T[P]> : T[P] };
type ReadonlyRemapObjectPropertyType<OriginalType, PropertyType> = { readonly [Property in keyof OriginalType]: PropertyType };
type RemapObjectPropertyType<OriginalType, PropertyType> = { [Property in keyof OriginalType]: PropertyType };
/**
 * Removes readonly from all properties (non-recursive)
 */
type Writeable<T> = { -readonly [P in keyof T]: T[P] };
/**
 * Removes readonly from all properties (recursive)
 */
type RecursiveWriteable<T> = { -readonly [P in keyof T]: RecursiveWriteable<T[P]> };
/**
 * Makes a type such that only one of the provided properties is required.
 * RequireOnlyOne<someType, 'prop1'|'prop2'>
 */
type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & { [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>> }[Keys];
type Rest<T extends any[]> = T extends [infer A, ...infer R] ? R : never;
//#endregion
export { RemapObjectPropertyType as a, Writeable as c, RecursiveWriteable as i, RecursivePartial as n, RequireOnlyOne as o, RecursiveReplace as r, Rest as s, ReadonlyRemapObjectPropertyType as t };