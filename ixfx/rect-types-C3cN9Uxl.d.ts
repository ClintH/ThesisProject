import { i as Point3d, r as Point } from "./point-type-DLbh1Hzz.js";

//#region ../packages/geometry/src/rect/rect-types.d.ts
/**
 * Rectangle as array: `[width, height]`
 */
type RectArray = readonly [width: number, height: number];
/**
 * Positioned rectangle as array: `[x, y, width, height]`
 */
type RectPositionedArray = readonly [x: number, y: number, width: number, height: number];
type Rect = {
  readonly width: number;
  readonly height: number;
};
type Rect3d = Rect & {
  readonly depth: number;
};
type RectPositioned = Point & Rect;
type Rect3dPositioned = Point3d & Rect3d;
//#endregion
export { RectPositioned as a, RectArray as i, Rect3d as n, RectPositionedArray as o, Rect3dPositioned as r, Rect as t };