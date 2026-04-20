//#region ../packages/geometry/src/point/point-type.d.ts
/**
 * A point, consisting of x, y and maybe z fields.
 */
type Point = {
  readonly x: number;
  readonly y: number;
  readonly z?: number;
};
type Point3d = Point & {
  readonly z: number;
};
/**
 * Placeholder point: `{ x: NaN, y: NaN }`
 * Use `isPlaceholder` to check if a point is a placeholder.
 * Use `Placeholder3d` get a point with `z` property.
 */
declare const Placeholder: Point;
/**
 * Placeholder point: `{x: NaN, y:NaN, z:NaN }`
 * Use `isPlaceholder` to check if a point is a placeholder.
 * Use `Placeholder` to get a point without `z` property.
 */
declare const Placeholder3d: Point3d;
//#endregion
export { Point3d as i, Placeholder3d as n, Point as r, Placeholder as t };