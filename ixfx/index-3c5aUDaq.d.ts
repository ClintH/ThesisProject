import { n as Result } from "./types-CSh98G0p.js";
import { t as ISetMutable } from "./ISetMutable-C1FvKxbn.js";
import { i as Point3d, n as Placeholder3d, r as Point, t as Placeholder$1 } from "./point-type-DLbh1Hzz.js";
import { a as averager, i as average, n as PointAverager, r as PointAveragerKinds, t as PointAverageKinds } from "./averager-Ccipf-pP.js";
import { a as RectPositioned, i as RectArray, n as Rect3d, o as RectPositionedArray, r as Rect3dPositioned, t as Rect } from "./rect-types-C3cN9Uxl.js";
import { a as RandomSource } from "./types-B4a9qJv9.js";
import { a as TimestampedObject, c as TrimReason, n as ObjectTracker, s as TrackedValueOpts, t as TrackedValueMap } from "./tracked-value-Cpuv4L6f.js";

//#region ../packages/geometry/src/point/abs.d.ts
declare function abs(pt: Point3d): Point3d;
declare function abs(pt: Point): Point;
//#endregion
//#region ../packages/geometry/src/point/angle.d.ts
/**
 * Returns the angle in radians between `a` and `b`.
 *
 * Eg if `a` is the origin, and `b` is another point,
 * in degrees one would get 0 to -180 when `b` was above `a`.
 *  -180 would be `b` in line with `a`.
 * Same for under `a`.
 *
 * Providing a third point `c` gives the interior angle, where `b` is the middle point.
 *
 * See also {@link angleRadianCircle} which returns coordinates on 0..Math.Pi*2
 * range. This avoids negative numbers.
 *
 * @example Calculate angle between a middle of canvas and the cursor
 * ```js
 * const canvasEl = document.querySelector('canvas');
 * const middle = { x: canvasEl.width/2, y: canvasEl.height /2 }
 *
 * canvasEl.addEventListener(`pointermove`, event => {
 *  const cursor = {
 *    x: event.offsetX,
 *    y: event.offsetY
 *  }
 *  const a = G.Points.angleRadian(middle, cursor);
 *});
 * ```
 * @param a
 * @param b
 * @param c
 * @returns
 */
declare const angleRadian: (a: Point, b?: Point, c?: Point) => number;
/**
 * Returns the angle between point(s) using a radian circle system.
 * ```
 *       90deg
 *       Pi/2
 *        |
 * Pi  ---+--- 0
 * 180    |
 *       3PI/2
 *       270deg
 * ```
 * @param a
 * @param b
 * @param c
 * @returns
 */
declare const angleRadianCircle: (a: Point, b?: Point, c?: Point) => number;
/**
 * Return the angle of a wedge, defined by a, b and C points, where 'b'
 * could be thought of as the origin or pivot.
 *
 * @param a
 * @param b
 * @param c
 * @returns
 */
declare const angleRadianThreePoint: (a: Point, b: Point, c: Point) => number;
//#endregion
//#region ../packages/geometry/src/point/apply.d.ts
type PointApplyFn = (v: number, field: `x` | `y`) => number;
type Point3dApplyFn = (v: number, field: `x` | `y` | `z`) => number;
declare function apply(pt: Point3d, fn: Point3dApplyFn): Point3d;
declare function apply(pt: Point, fn: PointApplyFn): Point;
//#endregion
//#region ../packages/geometry/src/point/bbox.d.ts
/**
 * Returns the minimum rectangle that can enclose all provided points
 * @param points
 * @returns
 */
declare const bbox: (...points: ReadonlyArray<Point>) => RectPositioned;
declare const bbox3d: (...points: ReadonlyArray<Point3d>) => Rect3dPositioned;
//#endregion
//#region ../packages/geometry/src/point/centroid.d.ts
/**
 * Calculates the [centroid](https://en.wikipedia.org/wiki/Centroid#Of_a_finite_set_of_points) of a set of points
 * Undefined values are skipped over. Calculation and return value is 2D.
 *
 * ```js
 * // Find centroid of a list of points
 * const c1 = centroid(p1, p2, p3, ...);
 *
 * // Find centroid of an array of points
 * const c2 = centroid(...pointsArray);
 * ```
 * @param points
 * @returns A single point
 */
declare const centroid: (...points: readonly (Point | undefined)[]) => Point;
//#endregion
//#region ../packages/geometry/src/point/clamp.d.ts
declare function clamp(a: Point, min?: number, max?: number): Point;
declare function clamp(a: Point3d, min?: number, max?: number): Point3d;
//#endregion
//#region ../packages/geometry/src/point/compare.d.ts
/**
 * Returns -2 if both x & y of a is less than b
 * Returns -1 if either x/y of a is less than b
 *
 * Returns 2 if both x & y of a is greater than b
 * Returns 1 if either x/y of a is greater than b's x/y
 *
 * Returns 0 if x/y of a and b are equal
 * @param a
 * @param b
 * @returns
 */
declare const compare: (a: Point, b: Point) => number;
/**
 * Compares points based on x value. Y value is ignored.
 *
 * Return values:
 * * 0: If a.x === b.x
 * * 1: a is to the right of b (ie. a.x > b.x)
 * * -1: a is to the left of b (ie. a.x < b.x)
 *
 * @example Sorting by x
 * ```js
 * arrayOfPoints.sort(Points.compareByX);
 * ```
 *
 * @param a
 * @param b
 * @returns
 */
declare const compareByX: (a: Point, b: Point) => number;
/**
 * Compares points based on Y value. X value is ignored.
 *
 * Return values:
 * * 0: If a.y === b.y
 * * 1: A is below B (ie. a.y > b.y)
 * * -1: A is above B (ie. a.y < b.y)
 *
 * @example Sorting by Y
 * ```js
 * arrayOfPoints.sort(Points.compareByY);
 * ```
 * @param a
 * @param b
 * @returns
 */
declare const compareByY: (a: Point, b: Point) => number;
/**
 * Compares points based on Z value. XY values are ignored.
 *
 * Return values:
 * * 0: If a.z === b.z
 * * 1: A is below B (ie. a.z > b.z)
 * * -1: A is above B (ie. a.z < b.z)
 *
 * @example Sorting by Y
 * ```js
 * arrayOfPoints.sort(Points.compareByZ);
 * ```
 * @param a
 * @param b
 * @returns
 */
declare const compareByZ: (a: Point3d, b: Point3d) => number;
//#endregion
//#region ../packages/geometry/src/point/convex-hull.d.ts
/**
 * Simple convex hull impementation. Returns a set of points which
 * enclose `pts`.
 *
 * For more power, see something like [Hull.js](https://github.com/AndriiHeonia/hull)
 * @param pts
 * @returns
 */
declare const convexHull: (...pts: ReadonlyArray<Point>) => ReadonlyArray<Point>;
//#endregion
//#region ../packages/geometry/src/point/distance.d.ts
declare function distance(a: Point, b?: Point): number;
declare function distance(a: Point, x: number, y: number): number;
/**
 * As {@link distance} but always compares by x,y only.
 * @param a
 * @param xOrB
 * @param y
 * @returns
 */
declare function distance2d(a: Point, xOrB?: Point | number, y?: number): number;
//#endregion
//#region ../packages/geometry/src/circle/circle-type.d.ts
/**
 * A circle
 */
type Circle = {
  readonly radius: number;
};
type CircleToSvg = {
  (circleOrRadius: Circle | number, sweep: boolean, origin: Point): readonly string[];
  (circle: CirclePositioned, sweep: boolean): readonly string[];
};
/**
 * A {@link Circle} with position
 */
type CirclePositioned = Point & Circle;
type CircleRandomPointOpts = {
  /**
   * Algorithm to calculate random values.
   * Default: 'uniform'
   */
  readonly strategy: `naive` | `uniform`;
  /**
   * Random number source.
   * Default: Math.random
   */
  readonly randomSource: () => number;
  /**
   * Margin within shape to start generating random points
   * Default: 0
   */
  readonly margin: number;
};
//#endregion
//#region ../packages/geometry/src/line/line-type.d.ts
/**
 * A line, which consists of an `a` and `b` {@link Point}.
 */
type Line = {
  readonly a: Point;
  readonly b: Point;
};
/**
 * A PolyLine, consisting of more than one line.
 */
type PolyLine = readonly Line[];
//#endregion
//#region ../packages/geometry/src/shape/shape-type.d.ts
type ShapePositioned = CirclePositioned | RectPositioned;
type ContainsResult = `none` | `contained`;
type Sphere = Point3d & {
  readonly radius: number;
};
type PointCalculableShape = PolyLine | Line | RectPositioned | Point | CirclePositioned;
//#endregion
//#region ../packages/geometry/src/shape/arrow.d.ts
type ArrowOpts = {
  readonly arrowSize?: number;
  readonly tailLength?: number;
  readonly tailThickness?: number;
  readonly angleRadian?: number;
};
/**
 * Returns the points forming an arrow.
 *
 * @example Create an arrow anchored by its tip at 100,100
 * ```js
 * const opts = {
 *  tailLength: 10,
 *  arrowSize: 20,
 *  tailThickness: 5,
 *  angleRadian: degreeToRadian(45)
 * }
 * const arrow = Shapes.arrow({x:100, y:100}, `tip`, opts); // Yields an array of points
 *
 * // Eg: draw points
 * Drawing.connectedPoints(ctx, arrow, {strokeStyle: `red`, loop: true});
 * ```
 *
 * @param origin Origin of arrow
 * @param from Does origin describe the tip, tail or middle?
 * @param opts Options for arrow
 * @returns
 */
declare const arrow: (origin: Point, from: `tip` | `tail` | `middle`, opts?: ArrowOpts) => ReadonlyArray<Point>;
//#endregion
//#region ../packages/geometry/src/triangle/triangle-type.d.ts
type Triangle = {
  readonly a: Point;
  readonly b: Point;
  readonly c: Point;
};
type BarycentricCoord = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
};
//#endregion
//#region ../packages/geometry/src/shape/etc.d.ts
type ShapeRandomPointOpts = {
  readonly randomSource: RandomSource;
};
/**
 * Returns a random point within a shape.
 * `shape` can be {@link Circles.CirclePositioned} or {@link Rects.RectPositioned}
 * @param shape
 * @param opts
 * @returns
 */
declare const randomPoint$1: (shape: ShapePositioned, opts?: Partial<ShapeRandomPointOpts>) => Point;
/**
 * Returns the center of a shape
 * Shape can be: rectangle, triangle, circle
 * @param shape
 * @returns
 */
declare const center$1: (shape?: Rect | Triangle | Circle) => Point;
//#endregion
//#region ../packages/geometry/src/shape/is-intersecting.d.ts
/**
 * Returns the intersection result between a and b.
 * `a` can be a {@link Circles.CirclePositioned} or {@link Rects.RectPositioned}
 * `b` can be as above or a {@link Point}.
 * @param a
 * @param b
 */
declare const isIntersecting$1: (a: ShapePositioned, b: ShapePositioned | Point) => boolean;
//#endregion
//#region ../packages/geometry/src/shape/starburst.d.ts
/**
 * Generates a starburst shape, returning an array of points. By default, initial point is top and horizontally-centred.
 *
 * ```
 * // Generate a starburst with four spikes
 * const pts = starburst(4, 100, 200);
 * ```
 *
 * `points` of two produces a lozenge shape.
 * `points` of three produces a triangle shape.
 * `points` of five is the familiar 'star' shape.
 *
 * Note that the path will need to be closed back to the first point to enclose the shape.
 *
 * @example Create starburst and draw it. Note use of 'loop' flag to close the path
 * ```
 * const points = starburst(4, 100, 200);
 * Drawing.connectedPoints(ctx, pts, {loop: true, fillStyle: `orange`, strokeStyle: `red`});
 * ```
 *
 * Options:
 * * initialAngleRadian: angle offset to begin from. This overrides the `-Math.PI/2` default.
 *
 * @param points Number of points in the starburst. Defaults to five, which produces a typical star
 * @param innerRadius Inner radius. A proportionally smaller inner radius makes for sharper spikes. If unspecified, 50% of the outer radius is used.
 * @param outerRadius Outer radius. Maximum radius of a spike to origin
 * @param opts Options
 * @param origin Origin, or `{ x:0, y:0 }` by default.
 */
declare const starburst: (outerRadius: number, points?: number, innerRadius?: number, origin?: Point, opts?: {
  readonly initialAngleRadian?: number;
}) => readonly Point[];
declare namespace index_d_exports$6 {
  export { ArrowOpts, ContainsResult, PointCalculableShape, ShapePositioned, ShapeRandomPointOpts, Sphere, arrow, center$1 as center, isIntersecting$1 as isIntersecting, randomPoint$1 as randomPoint, starburst };
}
//#endregion
//#region ../packages/geometry/src/point/distance-to-center.d.ts
/**
 * Returns the distance from point `a` to the center of `shape`.
 * @param a Point
 * @param shape Point, or a positioned Rect or Circle.
 * @returns
 */
declare const distanceToCenter: (a: Point, shape: PointCalculableShape) => number;
//#endregion
//#region ../packages/geometry/src/point/distance-to-exterior.d.ts
/**
 * Returns the distance from point `a` to the exterior of `shape`.
 *
 * @example Distance from point to rectangle
 * ```
 * const distance = distanceToExterior(
 *  {x: 50, y: 50},
 *  {x: 100, y: 100, width: 20, height: 20}
 * );
 * ```
 *
 * @example Find closest shape to point
 * ```
 * import {minIndex} from '../data/arrays.js';
 * const shapes = [ some shapes... ]; // Shapes to compare against
 * const pt = { x: 10, y: 10 };       // Comparison point
 * const distances = shapes.map(v => distanceToExterior(pt, v));
 * const closest = shapes[minIndex(...distances)];
 * ```
 * @param a Point
 * @param shape Point, or a positioned Rect or Circle.
 * @returns
 */
declare const distanceToExterior: (a: Point, shape: PointCalculableShape) => number;
//#endregion
//#region ../packages/geometry/src/point/divider.d.ts
declare function divide$2(a: Point, b: Point): Point;
declare function divide$2(a: Point3d, b: Point3d): Point3d;
declare function divide$2(a: Point, x: number, y: number): Point;
declare function divide$2(a: Point3d, x: number, y: number, z: number): Point3d;
declare function divide$2(ax: number, ay: number, bx: number, by: number): Point;
declare function divide$2(ax: number, ay: number, az: number, bx: number, by: number, bz: number): Point3d;
/**
 * Returns a function that divides a point:
 * ```js
 * const f = divider(100, 200);
 * f(50,100); // Yields: { x: 0.5, y: 0.5 }
 * ```
 *
 * Input values can be Point, separate x,y and optional z values or an array:
 * ```js
 * const f = divider({ x: 100, y: 100 });
 * const f = divider( 100, 100 );
 * const f = divider([ 100, 100 ]);
 * ```
 *
 * Likewise the returned function an take these as inputs:
 * ```js
 * f({ x: 100, y: 100});
 * f( 100, 100 );
 * f([ 100, 100 ]);
 * ```
 *
 * Function throws if divisor has 0 for any coordinate (since we can't divide by 0)
 * @param a Divisor point, array of points or x
 * @param b Divisor y value
 * @param c Divisor z value
 * @returns
 */
declare function divider(a: Point3d | Point | number | number[], b?: number, c?: number): (aa: Point3d | Point | number | number[], bb?: number, cc?: number) => Point;
//#endregion
//#region ../packages/geometry/src/point/dot-product.d.ts
declare const dotProduct$1: (...pts: readonly Point[]) => number;
/**
 * Returns the cross-product:
 * ```
 * ax * by - ay * bx
 * ```
 * @param a
 * @param b
 * @returns
 */
declare function cross(a: Point, b: Point): number;
/**
 * Returns the cross-product:
 * ```
 * ax * by - ay * bx
 * ```
 * @param ax
 * @param ay
 * @param bx
 * @param by
 * @returns
 */
declare function crossProductRaw(ax: number, ay: number, bx: number, by: number): number;
//#endregion
//#region ../packages/geometry/src/point/empty.d.ts
/**
 * An empty point of `{ x: 0, y: 0 }`.
 *
 * Use `isEmpty` to check if a point is empty.
 * Use `Empty3d` to get an empty point with `z`.
 */
declare const Empty$1: Point;
/**
 * Returns { x:1, y:1 }
 */
declare const Unit: Point;
/**
 * An empty Point of `{ x: 0, y: 0, z: 0}`
 * Use `isEmpty` to check if a point is empty.
 * Use `Empty` to get an empty point without `z`.
 */
declare const Empty3d: Point3d;
/**
 * Returns { x:1,y:1,z:1 }
 */
declare const Unit3d: Point3d;
//#endregion
//#region ../packages/geometry/src/point/find-minimum.d.ts
declare function findMinimum(comparer: (a: Point, b: Point) => Point, ...points: ReadonlyArray<Point>): Point;
declare function findMinimum(comparer: (a: Point3d, b: Point3d) => Point3d, ...points: ReadonlyArray<Point3d>): Point3d;
//#endregion
//#region ../packages/geometry/src/point/from.d.ts
declare function from(x: number, y: number, z: number): Point3d;
declare function from(x: number, y: number): Point;
declare function from(array: [x: number, y: number, z: number]): Point3d;
declare function from(array: [x: number, y: number]): Point;
/**
 * Parses a point as a string, in the form 'x,y' or 'x,y,z'.
 * eg '10,15' will be returned as `{ x: 10, y: 15 }`.
 *
 * Throws an error if `str` is not a string.
 *
 * ```js
 * Points.fromString(`10,15`);  // { x:10, y:15 }
 * Points.fromString(`a,10`);   // { x:NaN, y:10 }
 * ```
 *
 * Use {@link Points.isNaN} to check if returned point has NaN for either coordinate.
 * @param string_
 */
declare const fromString: (string_: string) => Point;
/**
 * Returns an array of points from an array of numbers.
 *
 * Array can be a continuous series of x, y values:
 * ```
 * [1,2,3,4] would yield: [{x:1, y:2}, {x:3, y:4}]
 * ```
 *
 * Or it can be an array of arrays:
 * ```
 * [[1,2], [3,4]] would yield: [{x:1, y:2}, {x:3, y:4}]
 * ```
 * @param coords
 * @returns
 */
declare const fromNumbers$1: (...coords: readonly (readonly number[])[] | readonly number[]) => readonly Point[];
//#endregion
//#region ../packages/geometry/src/point/get-point-parameter.d.ts
declare function getTwoPointParameters(a: Point, b: Point): [a: Point, b: Point];
declare function getTwoPointParameters(a: Point3d, b: Point3d): [a: Point3d, b: Point3d];
declare function getTwoPointParameters(a: Point, x: number, y: number): [a: Point, b: Point];
declare function getTwoPointParameters(a: Point3d, x: number, y: number, z: number): [a: Point3d, b: Point3d];
declare function getTwoPointParameters(ax: number, ay: number, bx: number, by: number): [a: Point, b: Point];
declare function getTwoPointParameters(ax: number, ay: number, az: number, bx: number, by: number, bz: number): [a: Point3d, b: Point3d];
/**
 * Returns a Point form of either a point, x,y params or x,y,z params.
 * If parameters are undefined, an empty point is returned (0, 0)
 * @ignore
 * @param a
 * @param b
 * @returns
 */
declare function getPointParameter(a?: Point3d | Point | number | Array<number> | ReadonlyArray<number>, b?: number | boolean, c?: number): Point | Point3d;
//#endregion
//#region ../packages/geometry/src/point/guard.d.ts
/**
 * Returns true if xy (and z, if present) are _null_.
 * @param p
 * @returns
 */
declare const isNull: (p: Point) => boolean;
/***
 * Returns true if either x, y, z isNaN.
 */
declare const isNaN: (p: Point) => boolean;
declare function test(p: Point, name?: string, extraInfo?: string): Result<Point, string>;
/**
 * Throws an error if point is invalid
 * @param p
 * @param name
 */
declare function guard$2(p: Point, name?: string, info?: string): void;
/**
 * Throws if parameter is not a valid point, or either x or y is 0
 * @param pt
 * @returns
 */
declare const guardNonZeroPoint: (pt: Point | Point3d, name?: string) => boolean;
/**
 * Returns _true_ if `p` has x & y properties.
 * Returns _false_ if `p` is undefined, null or does not contain properties.
 * Use {@link isPoint3d} to check further check for `z`.
 * @param p
 * @returns
 */
declare function isPoint(p: number | unknown): p is Point;
/**
 * Returns _true_ if `p` has x, y, & z properties.
 * Returns _false_ if `p` is undefined, null or does not contain properties.
 * @param p
 * @returns
 */
declare const isPoint3d: (p: Point | unknown) => p is Point3d;
/**
 * Returns true if both xy (and z, if present) are 0.
 * Use `Points.Empty` to return an empty point.
 * @param p
 * @returns
 */
declare const isEmpty$1: (p: Point) => boolean;
/**
 * Returns true if point is a placeholder, where xy (and z, if present)
 * are `NaN`.
 *
 * Use Points.Placeholder to return a placeholder point.
 * @param p
 * @returns
 */
declare const isPlaceholder$1: (p: Point) => boolean;
//#endregion
//#region ../packages/geometry/src/point/interpolate.d.ts
/**
 * Returns a relative point between two points.
 *
 * ```js
 * interpolate(0.5, { x:0, y:0 }, { x:10, y:10 }); // Halfway { x, y }
 * ```
 *
 * Alias for Lines.interpolate(amount, a, b);
 *
 * @param amount Relative amount, 0-1
 * @param a
 * @param b
 * @param allowOverflow If true, length of line can be exceeded for `amount` of below 0 and above `1`.
 * @returns {@link Point}
 */
declare const interpolate: (amount: number, a: Point, b: Point, allowOverflow?: boolean) => Point;
//#endregion
//#region ../packages/geometry/src/point/invert.d.ts
/**
 * Inverts one or more axis of a point
 * ```js
 * invert({x:10, y:10}); // Yields: {x:-10, y:-10}
 * invert({x:10, y:10}, `x`); // Yields: {x:-10, y:10}
 * ```
 * @param pt Point to invert
 * @param what Which axis. If unspecified, both axies are inverted
 * @returns
 */
declare const invert$1: (pt: Point | Point3d, what?: `both` | `x` | `y` | `z`) => Point;
//#endregion
//#region ../packages/geometry/src/point/is-equal.d.ts
/**
 * Returns _true_ if the points have identical values
 *
 * ```js
 * const a = {x: 10, y: 10};
 * const b = {x: 10, y: 10;};
 * a === b        // False, because a and be are different objects
 * isEqual(a, b)   // True, because a and b are same value
 * ```
 * @param p Points
 * @returns _True_ if points are equal
 */
declare const isEqual$2: (...p: ReadonlyArray<Point>) => boolean;
//#endregion
//#region ../packages/geometry/src/point/magnitude.d.ts
/**
 * Clamps the magnitude of a point.
 * This is useful when using a Point as a vector, to limit forces.
 * @param pt
 * @param max Maximum magnitude (1 by default)
 * @param min Minimum magnitude (0 by default)
 * @returns
 */
declare const clampMagnitude$1: (pt: Point, max?: number, min?: number) => Point;
//#endregion
//#region ../packages/geometry/src/point/most.d.ts
/**
 * Returns the left-most of the provided points.
 *
 * Same as:
 * ```js
 * findMinimum((a, b) => {
 *  if (a.x <= b.x) return a;
 *  return b;
 *}, ...points)
 * ```
 *
 * @param points
 * @returns
 */
declare const leftmost: (...points: ReadonlyArray<Point>) => Point;
/**
 * Returns the right-most of the provided points.
 *
 * Same as:
 * ```js
 * findMinimum((a, b) => {
 *  if (a.x >= b.x) return a;
 *  return b;
 *}, ...points)
 * ```
 *
 * @param points
 * @returns
 */
declare const rightmost: (...points: ReadonlyArray<Point>) => Point;
//#endregion
//#region ../packages/geometry/src/point/multiply.d.ts
declare function multiply$2(a: Point, b: Point): Point;
declare function multiply$2(a: Point3d, b: Point3d): Point3d;
declare function multiply$2(a: Point, x: number, y: number): Point;
declare function multiply$2(a: Point3d, x: number, y: number, z: number): Point3d;
declare function multiply$2(ax: number, ay: number, bx: number, by: number): Point;
declare function multiply$2(ax: number, ay: number, az: number, bx: number, by: number, bz: number): Point3d;
/**
 * Multiplies all components by `v`.
 * Existing properties of `pt` are maintained.
 *
 * ```js
 * multiplyScalar({ x:2, y:4 }, 2);
 * // Yields: { x:4, y:8 }
 * ```
 * @param pt Point
 * @param v Value to multiply by
 * @returns
 */
declare const multiplyScalar$1: (pt: Point | Point3d, v: number) => Point | Point3d;
//#endregion
//#region ../packages/geometry/src/point/normalise.d.ts
/**
 * Normalise point as a unit vector.
 *
 * ```js
 * normalise({x:10, y:20});
 * normalise(10, 20);
 * ```
 * @param ptOrX Point, or x value
 * @param y y value if first param is x
 * @returns
 */
declare const normalise$1: (ptOrX: Point | number, y?: number) => Point;
//#endregion
//#region ../packages/geometry/src/point/normalise-by-rect.d.ts
/**
 * Normalises a point by a given width and height
 *
 * ```js
 * normaliseByRect({ x: 10, y: 10 }, 20, 40 }); // { x: 0.5, y: 0.2 }
 * ```
 * @param point Point
 * @param width Width
 * @param height Height
 */
declare function normaliseByRect(point: Point, width: number, height: number): Point;
/**
 * Normalises a point by a given rect's width and height
 *
 * ```js
 * normaliseByRect({ x: 10, y: 10, width: 20, height: 40 }); // { x: 0.5, y: 0.2 }
 * ```
 * @param pt
 * @param rect
 */
declare function normaliseByRect(pt: Point, rect: Rect): Point;
/**
 * Normalises x,y by width and height so it is on a 0..1 scale
 *
 * ```js
 * normaliseByRect(10, 10, 20, 40); // { x: 0.5, y: 0.2 }
 * ```
 * @param x
 * @param y
 * @param width
 * @param height
 */
declare function normaliseByRect(x: number, y: number, width: number, height: number): Point;
//#endregion
//#region ../packages/geometry/src/point/pipeline.d.ts
/**
 * Runs a sequential series of functions on `pt`. The output from one feeding into the next.
 *
 * ```js
 * const p = Points.pipelineApply(somePoint, Points.normalise, Points.invert);
 * ```
 *
 * If you want to make a reusable pipeline of functions, consider {@link pipeline} instead.
 * @param point
 * @param pipelineFns
 * @returns
 */
declare const pipelineApply: (point: Point, ...pipelineFns: readonly ((pt: Point) => Point)[]) => Point;
/**
 * Returns a pipeline function that takes a point to be transformed through a series of functions
 * ```js
 * // Create pipeline
 * const p = Points.pipeline(Points.normalise, Points.invert);
 *
 * // Now run it on `somePoint`.
 * // First we normalised, and then invert
 * const changedPoint = p(somePoint);
 * ```
 *
 * If you don't want to create a pipeline, use {@link pipelineApply}.
 * @param pipeline Pipeline of functions
 * @returns
 */
declare const pipeline: (...pipeline: readonly ((pt: Point) => Point)[]) => (pt: Point) => Point;
//#endregion
//#region ../packages/geometry/src/point/point-relation-types.d.ts
type PointRelation = (a: Point | number, b?: number) => PointRelationResult;
type PointRelationResult = {
  /**
   * Angle from start
   */
  readonly angle: number;
  /**
   * Distance from start
   */
  readonly distanceFromStart: number;
  /**
   * Distance from last compared point
   */
  readonly distanceFromLast: number;
  /**
   * Center point from start
   */
  readonly centroid: Point;
  /**
   * Average of all points seen
   * This is calculated by summing x,y and dividing by total points
   */
  readonly average: Point;
  /**
   * Speed. Distance/millisecond from one sample to the next.
   */
  readonly speed: number;
};
//#endregion
//#region ../packages/geometry/src/polar/types.d.ts
/**
 * Converts to Cartesian coordiantes
 */
type PolarToCartesian = {
  (point: Coord, origin?: Point): Point;
  (distance: number, angleRadians: number, origin?: Point): Point;
};
/**
 * A polar ray allows you to express a line in polar coordinates
 * rather than two x,y points.
 *
 * It consists of an angle (in radians) with a given offset and length.
 * This way of defining a line makes some manipulations really easy, for example, to
 * make a set of lines that radiate out from a point in a circular direction, and then animate
 * them inwards and outwards.
 *
 * An alternative is  {@link PolarLine} which defines a line as two {@link Coord}s with a common origin.
 *
 * Properties
 * * angleRadian: Angle of line
 * * offset: distance from the polar origin (default: 0)
 * * length: length of ray
 * * origin: Start Cartesian coordinate of line
 */
type PolarRay = Readonly<{
  /**
   * Angle of ray in radian
   */
  angleRadian: number;
  /**
   * Starting point of a ray, defined as an
   * offset from the polar origin.
   */
  offset?: number;
  /**
   * Length of ray
   */
  length: number;
  /**
   * Optional origin point of ray (ie. start)
   */
  origin?: Point;
}>;
type PolarRayWithOrigin = PolarRay & Readonly<{
  origin: Point;
}>;
/**
 * Expresses a line as two angles and offset from a
 * common origin.
 *
 * Alternatives:
 * * {@link PolarRay}: Defines a line along a single ray
 * * {@link Line}: Defines a line by two Cartesian (x,y) pairs
 */
type PolarLine = Readonly<{
  a: Coord;
  b: Coord;
}>;
/**
 * Polar coordinate, made up of a distance and angle in radians.
 * Most computations involving PolarCoord require an `origin` as well.
 */
type Coord = Readonly<{
  distance: number;
  angleRadian: number;
}>;
//#endregion
//#region ../packages/geometry/src/polar/angles.d.ts
/**
 * Returns a rotated coordinate
 * @param c Coordinate
 * @param amountRadian Amount to rotate, in radians
 * @returns
 */
declare const rotate$1: (c: Coord, amountRadian: number) => Coord;
/**
 * Inverts the direction of coordinate. Ie if pointing north, will point south.
 * @param p
 * @returns
 */
declare const invert: (p: Coord) => Coord;
/**
 * Returns true if PolarCoords have same magnitude but opposite direction
 * @param a
 * @param b
 * @returns
 */
declare const isOpposite: (a: Coord, b: Coord) => boolean;
/**
 * Returns true if Coords have the same direction, regardless of magnitude
 * @param a
 * @param b
 * @returns
 */
declare const isParallel$1: (a: Coord, b: Coord) => boolean;
/**
 * Returns true if coords are opposite direction, regardless of magnitude
 * @param a
 * @param b
 * @returns
 */
declare const isAntiParallel: (a: Coord, b: Coord) => boolean;
/**
 * Returns a rotated coordinate
 * @param c Coordinate
 * @param amountDeg Amount to rotate, in degrees
 * @returns
 */
declare const rotateDegrees: (c: Coord, amountDeg: number) => Coord;
//#endregion
//#region ../packages/geometry/src/polar/conversions.d.ts
/**
 * Converts a polar coordinate to a Line.
 *
 * ```js
 * const line = toLine({ angleRadian: Math.Pi, distance: 0.5 }, { x: 0.2, y: 0.1 });
 * // Yields { a: { x, y}, b: { x, y } }
 * ```
 *
 * The 'start' parameter is taken to be the origin of the Polar coordinate.
 * @param c
 * @param start
 * @returns
 */
declare const toLine: (c: Coord, start: Point) => Line;
/**
 * Converts to Cartesian coordinate from polar.
 *
 * ```js
 *
 * const origin = { x: 50, y: 50}; // Polar origin
 * // Yields: { x, y }
 * const polar = Polar.toCartesian({ distance: 10, angleRadian: 0 }, origin);
 * ```
 *
 * Distance and angle can be provided as numbers intead:
 *
 * ```
 * // Yields: { x, y }
 * const polar = Polar.toCartesian(10, 0, origin);
 * ```
 *
 * @param a
 * @param b
 * @param c
 * @returns
 */
declare const toCartesian$1: PolarToCartesian;
type FromCartesianOptions = {
  /**
   * Rounding to apply to distance and angle calculations
   */
  digits: number;
  /**
   * If false, returns angle on half-circle basis
   * such that negative angles are possible (0..PI..-PI).
   * By default uses (0..2*PI) range.
   */
  fullCircle: boolean;
};
/**
 * Converts a Cartesian coordinate to polar
 *
 * ```js
 *
 * // Yields: { angleRadian, distance }
 * const polar = Polar.fromCartesian({x: 50, y: 50}, origin);
 * ```
 *
 * Any additional properties of `point` are copied to object.
 *
 * Options:
 * * fullCircle: If _true_ (default) returns values on 0..2PI range. If _false_, 0....PI..-PI range.
 * * digits: Rounding to apply
 * @param point Point
 * @param origin Origin. If unspecified, {x:0,y:0} is used
 * @param options Options
 * @returns
 */
declare const fromCartesian: (point: Point, origin?: Point, options?: Partial<FromCartesianOptions>) => Coord;
/**
 * Returns a human-friendly string representation `(distance, angleDeg)`.
 * If `precision` is supplied, this will be the number of significant digits.
 * @param p
 * @returns
 */
declare const toString$2: (p: Coord, digits?: number) => string;
declare const toPoint: (v: Coord, origin?: Point) => Point;
type ToPolarLineOptions = FromCartesianOptions & {
  orderBy: `none` | `angle-min` | `angle-max` | `distance`;
};
declare function toPolarLine(line: Line, origin: Point, opts?: Partial<ToPolarLineOptions>): PolarLine;
declare function toPolarLine(lines: Line[] | readonly Line[], origin: Point, opts?: Partial<ToPolarLineOptions>): PolarLine[];
/**
 * Returns a string representation of a PolarLine
 * @param line
 * @param digits
 * @returns
 */
declare function polarLineToString(line: PolarLine, digits?: number): string;
declare function lineToCartesian(line: PolarLine, origin: Point): Line;
declare function lineToCartesian(lines: PolarLine[], origin: Point): Line[];
//#endregion
//#region ../packages/geometry/src/polar/guard.d.ts
/**
 * Returns true if `p` seems to be a {@link Polar.Coord} (ie has both distance & angleRadian fields)
 * @param p
 * @returns True if `p` seems to be a PolarCoord
 */
declare const isPolarCoord: (p: unknown) => p is Coord;
/**
 * Throws an error if Coord is invalid
 * @param p
 * @param name
 */
declare const guard$1: (p: Coord, name?: string) => void;
//#endregion
//#region ../packages/geometry/src/polar/math.d.ts
declare const normalise: (c: Coord) => Coord;
/**
 * Clamps the magnitude of a vector
 * @param v
 * @param max
 * @param min
 * @returns
 */
declare const clampMagnitude: (v: Coord, max?: number, min?: number) => Coord;
/**
 * Calculate dot product of two PolarCoords.
 *
 * Eg, power is the dot product of force and velocity
 *
 * Dot products are also useful for comparing similarity of
 *  angle between two unit PolarCoords.
 * @param a
 * @param b
 * @returns
 */
declare const dotProduct: (a: Coord, b: Coord) => number;
/**
 * Multiplies the magnitude of a coord by `amt`.
 * Direction is unchanged.
 * @param v
 * @param amt
 * @returns
 */
declare const multiply$1: (v: Coord, amt: number) => Coord;
/**
 * Divides the magnitude of a coord by `amt`.
 * Direction is unchanged.
 * @param v
 * @param amt
 * @returns
 */
declare const divide$1: (v: Coord, amt: number) => Coord;
/**
 * Returns _true_ if `check` is between `start` and `end` angles.
 * @param start
 * @param end
 * @param check
 * @returns
 */
declare const between: (check: {
  angleRadian: number;
}, start: {
  angleRadian: number;
}, end: {
  angleRadian: number;
}) => boolean;
declare namespace ray_d_exports {
  export { fromLine, isParallel, toCartesian, toString$1 as toString };
}
declare function toCartesian(rays: PolarRay[], origin?: Point): Line[];
declare function toCartesian(ray: PolarRay, origin?: Point): Line;
declare const isParallel: (a: PolarRay, b: PolarRay) => boolean;
/**
 * Returns a string representation of the ray, useful for debugging.
 *
 * ```js
 * "PolarRay(angle: ... offset: ... len: ... origin: ...)"
 * ```
 * @param ray
 * @returns
 */
declare const toString$1: (ray: PolarRay) => string;
declare function fromLine(line: Line[] | PolyLine, origin?: Point): PolarRay[];
declare function fromLine(line: Line, origin?: Point): PolarRay;
//#endregion
//#region ../packages/geometry/src/polar/spiral.d.ts
declare function spiral(smoothness: number, zoom: number): IterableIterator<Coord & {
  readonly step: number;
}>;
/**
 * Produces an Archimedian spiral with manual stepping.
 * @param step Step number. Typically 0, 1, 2 ...
 * @param smoothness 0.1 pretty rounded, at around 5 it starts breaking down
 * @param zoom At smoothness 0.1, zoom starting at 1 is OK
 * @returns
 */
declare const spiralRaw: (step: number, smoothness: number, zoom: number) => Coord;
//#endregion
//#region ../packages/geometry/src/polar/intersects.d.ts
type IntersectionDistanceCompute = {
  compute: (angleRadian: number) => Generator<{
    distance: number;
    line: PolarLine;
  }>;
  visibilityPolygon: (feather: number) => Coord[];
};
/**
 * Returns a generator function that checks for intersections with a static set of lines.
 * The generator yields values of `{ distance: number, line: PolarLine }`. Lines which have no
 * intersecton are not returned.
 *
 * ```js
 * const c = intersectionDistanceCompute(line1, line2, line3);
 *
 * // Get all results for angle 0.2 as an array
 * const computed = [...c.compute(0.2)]
 *
 * // Sort array by distance (ascending)
 * computed.sort((a, b) => a.distance - b.distance);
 * ```
 * @param lines
 * @returns
 */
declare const intersectionDistanceCompute: (...lines: PolarLine[]) => IntersectionDistanceCompute;
/**
 * Returns the distance at which a line from `angleRadian` hits `line`. Returns `Infinity`
 * if there's no intersection.
 *
 * Calculations assume that all angles etc are in relation to a common origin point.
 * If repeatedly comparing against the same line (or set of lines), use {@link intersectionDistanceCompute} for
 * improved performance.
 *
 * @param angleRadian
 * @param line
 * @returns
 */
declare const intersectionDistance: (angleRadian: number, line: PolarLine) => number;
declare namespace index_d_exports$5 {
  export { Coord, FromCartesianOptions, IntersectionDistanceCompute, PolarLine, PolarRay, PolarRayWithOrigin, PolarToCartesian, ray_d_exports as Ray, ToPolarLineOptions, between, clampMagnitude, divide$1 as divide, dotProduct, fromCartesian, guard$1 as guard, intersectionDistance, intersectionDistanceCompute, invert, isAntiParallel, isOpposite, isParallel$1 as isParallel, isPolarCoord, lineToCartesian, multiply$1 as multiply, normalise, polarLineToString, rotate$1 as rotate, rotateDegrees, spiral, spiralRaw, toCartesian$1 as toCartesian, toLine, toPoint, toPolarLine, toString$2 as toString };
}
//#endregion
//#region ../packages/geometry/src/point/point-tracker.d.ts
/**
 * Information about seen points
 */
type PointTrack = PointRelationResult & {};
/**
 * Results of point tracking
 */
type PointTrackerResults = Readonly<{
  /**
   * Relation of last point to previous point
   */
  fromLast: PointTrack;
  /**
   * Relation of last point to 'initial' point.
   * This will be the oldest point in the buffer of the tracker.
   */
  fromInitial: PointTrack;
  /**
   * Relation of last point to a 'mark' point,
   * which is manually set.
   *
   * Will give _undefined_ if `.mark()` has not been called on tracker.
   */
  fromMark: PointTrack | undefined;
  values: readonly Point[];
}>;
/**
 * A tracked point. Mutable. Useful for monitoring how
 * it changes over time. Eg. when a pointerdown event happens, to record the start position and then
 * track the pointer as it moves until pointerup.
 *
 * See also
 * * [Playground](https://clinth.github.io/ixfx-play/data/point-tracker/index.html)
 * * {@link PointsTracker}: Track several points, useful for multi-touch.
 * * [ixfx Guide to Point Tracker](https://ixfx.fun/geometry/tracking/)
 *
 * ```js
 * // Create a tracker on a pointerdown
 * const t = new PointTracker();
 *
 * // ...and later, tell it when a point is seen (eg. pointermove)
 * const nfo = t.seen({x: evt.x, y:evt.y});
 * // nfo gives us some details on the relation between the seen point, the start, and points inbetween
 * // nfo.angle, nfo.centroid, nfo.speed etc.
 * ```
 *
 * Compute based on last seen point
 * ```js
 * t.angleFromStart();
 * t.distanceFromStart();
 * t.x / t.y
 * t.length; // Total length of accumulated points
 * t.elapsed; // Total duration since start
 * t.lastResult; // The PointSeenInfo for last seen point
 * ```
 *
 * Housekeeping
 * ```js
 * t.reset(); // Reset tracker
 * ```
 *
 * By default, the tracker only keeps track of the initial point and
 * does not store intermediate 'seen' points. To use the tracker as a buffer,
 * set `storeIntermediate` option to _true_.
 *
 * ```js
 * // Keep only the last 10 points
 * const t = new PointTracker({
 *  sampleLimit: 10
 * });
 *
 * // Store all 'seen' points
 * const t = new PointTracker({
 *  storeIntermediate: true
 * });
 *
 * // In this case, the whole tracker is automatically
 * // reset after 10 samples
 * const t = new PointTracker({
 *  resetAfterSamples: 10
 * })
 * ```
 *
 * When using a buffer limited by `sampleLimit`, the 'initial' point will be the oldest in the
 * buffer, not actually the very first point seen.
 */
declare class PointTracker<TPoint extends Point = Point> extends ObjectTracker<TPoint, PointTrackerResults> {
  initialRelation: PointRelation | undefined;
  markRelation: PointRelation | undefined;
  lastResult: PointTrackerResults | undefined;
  constructor(opts?: TrackedValueOpts);
  /**
   * Notification that buffer has been knocked down to `sampleLimit`.
   *
   * This will reset the `initialRelation`, which will use the new oldest value.
   */
  onTrimmed(_reason: TrimReason): void;
  /**
   * @ignore
   */
  onReset(): void;
  /**
   * Makes a 'mark' in the tracker, allowing you to compare values
   * to this point.
   */
  mark(): void;
  /**
   * Tracks a point, returning data on its relation to the
   * initial point and the last received point.
   *
   * @param _p Point
   */
  computeResults(_p: TimestampedObject<Point>[]): PointTrackerResults;
  /**
   * Returns a polyline representation of stored points.
   * Returns an empty array if points were not saved, or there's only one.
   */
  get line(): PolyLine;
  /**
   * Returns a vector of the initial/last points of the tracker.
   * Returns as a polar coordinate
   */
  get vectorPolar(): Coord;
  /**
   * Returns a vector of the initial/last points of the tracker.
   * Returns as a Cartesian coordinate
   */
  get vectorCartesian(): Point;
  /**
   * Returns a line from initial point to last point.
   *
   * If there are less than two points, Lines.Empty is returned
   */
  get lineStartEnd(): Line;
  /**
   * Returns distance from latest point to initial point.
   * If there are less than two points, zero is returned.
   *
   * This is the direct distance from initial to last,
   * not the accumulated length. Use {@link lengthTotal} for that.
   * @param force2d If _true_ distance is calculated only in 2d
   * @returns Distance
   */
  distanceFromStart(force2d?: boolean): number;
  /**
   * Returns the speed (over milliseconds) based on accumulated travel distance.
   *
   * If there's no initial point, 0 is returned.
   * @param force2d If _true_, speed is calculated with x,y only
   * @returns
   */
  speedFromStart(force2d?: boolean): number;
  speedFromLast(force2d?: boolean): number;
  /**
   * Difference between last point and the initial point, calculated
   * as a simple subtraction of x,y & z.
   *
   * `Points.Placeholder` is returned if there's only one point so far.
   */
  difference(): Point | Point3d;
  /**
   * Returns angle (in radians) from latest point to the initial point
   * If there are less than two points, undefined is return.
   * @returns Angle in radians
   */
  angleFromStart(): number | undefined;
  /**
   * Returns the total distance from accumulated points.
   * Returns 0 if points were not saved, or there's only one.
   *
   * Use {@link lengthAverage} to get the average length for all segments
   * @param force2d If _true_ length is calculated using x&y only
   */
  lengthTotal(force2d?: boolean): number;
  /**
   * Adds up the accumulated length of all points (using {@link lengthTotal})
   * dividing by the total number of points.
   * @param force2d
   * @returns
   */
  lengthAverage(force2d?: boolean): number;
  /**
  * Returns the last x coord
  */
  get x(): number;
  /**
   * Returns the last y coord
   */
  get y(): number;
  /**
   * Returns the last z coord (or _undefined_ if not available)
   */
  get z(): number | undefined;
}
/**
 * A {@link TrackedValueMap} for points. Uses {@link PointTracker} to
 * track added values.
 */
declare class PointsTracker<TPoint extends Point = Point> extends TrackedValueMap<TPoint, PointTracker<TPoint>, PointTrackerResults> {
  constructor(opts?: TrackedValueOpts);
  get(id: string): PointTracker<TPoint> | undefined;
}
declare class UserPointerTracker extends PointTracker {
  /**
   * Adds a PointerEvent along with its
   * coalesced events, if available.
   * @param p
   * @returns
   */
  seenEvent(p: PointerEvent | MouseEvent): PointTrackerResults;
}
declare class UserPointersTracker extends TrackedValueMap<Point, PointTracker, PointTrackerResults> {
  constructor(opts?: TrackedValueOpts);
  get(id: string): UserPointerTracker | undefined;
  /**
  * Track a PointerEvent
  * @param event
  */
  seenEvent(event: PointerEvent): Promise<PointTrackerResults[]>;
}
//#endregion
//#region ../packages/geometry/src/point/progress-between.d.ts
/**
 * Computes the progress between two waypoints, given `position`.
 *
 * [Source](https://www.habrador.com/tutorials/math/2-passed-waypoint/?s=09)
 * @param position Current position
 * @param waypointA Start
 * @param waypointB End
 * @returns
 */
declare const progressBetween: (position: Point | Point3d, waypointA: Point | Point3d, waypointB: Point | Point3d) => number;
//#endregion
//#region ../packages/geometry/src/point/project.d.ts
/**
 * Project `origin` by `distance` and `angle` (radians).
 *
 * To figure out rotation, imagine a horizontal line running through `origin`.
 * * Rotation = 0 deg puts the point on the right of origin, on same y-axis
 * * Rotation = 90 deg/3:00 puts the point below origin, on the same x-axis
 * * Rotation = 180 deg/6:00 puts the point on the left of origin on the same y-axis
 * * Rotation = 270 deg/12:00 puts the point above the origin, on the same x-axis
 *
 * ```js
 * // Yields a point 100 units away from 10,20 with 10 degrees rotation (ie slightly down)
 * const a = Points.project({x:10, y:20}, 100, degreeToRadian(10));
 * ```
 * @param origin
 * @param distance
 * @param angle
 * @returns
 */
declare const project: (origin: Point, distance: number, angle: number) => Point;
//#endregion
//#region ../packages/geometry/src/point/quantise.d.ts
declare function quantiseEvery(pt: Point3d, snap: Point3d, middleRoundsUp?: boolean): Point3d;
declare function quantiseEvery(pt: Point, snap: Point, middleRoundsUp?: boolean): Point;
//#endregion
//#region ../packages/geometry/src/point/random.d.ts
/**
 * Returns a random 2D point on a 0..1 scale.
 * ```js
 * import { Points } from "@ixfx/geometry.js";
 * const pt = Points.random(); // eg {x: 0.2549012, y:0.859301}
 * ```
 *
 * A custom source of randomness can be provided:
 * ```js
 * import { Points } from "@ixfx/geometry.js";
 * import { weightedSource } from "@ixfx/random.js"
 * const pt = Points.random(weightedSource(`quadIn`));
 * ```
 * @param rando
 * @returns
 */
declare const random$1: (rando?: RandomSource) => Point;
/**
 * Returns a random 3D point on a 0..1 scale.
 * ```js
 * import { Points } from "@ixfx/geometry";
 * const pt = Points.random(); // eg {x: 0.2549012, y:0.859301}
 * ```
 *
 * A custom source of randomness can be provided:
 * ```js
 * import { Points } from "@ixfx/geometry";
 * import { weightedSource } from "@ixfx/random.js"
 * const pt = Points.random(weightedSource(`quadIn`));
 * ```
 * @param rando
 * @returns
 */
declare const random3d: (rando?: RandomSource) => Point3d;
//#endregion
//#region ../packages/geometry/src/point/reduce.d.ts
/**
 * Reduces over points, treating _x_ and _y_ separately.
 *
 * ```
 * // Sum x and y values
 * const total = Points.reduce(points, (p, acc) => {
 *  return {x: p.x + acc.x, y: p.y + acc.y}
 * });
 * ```
 * @param pts Points to reduce
 * @param fn Reducer
 * @param initial Initial value, uses `{ x:0, y:0 }` by default
 * @returns
 */
declare const reduce: (pts: ReadonlyArray<Point>, fn: (p: Point, accumulated: Point) => Point, initial?: Point) => Point;
//#endregion
//#region ../packages/geometry/src/point/relation.d.ts
/**
 * Tracks the relation between two points.
 *
 * 1. Call `Points.relation` with the initial reference point
 * 2. You get back a function
 * 3. Call the function with a new point to compute relational information.
 *
 * It computes angle, average, centroid, distance and speed.
 *
 * ```js
 * // Reference point: 50,50
 * const t = Points.relation({x:50,y:50}); // t is a function
 *
 * // Invoke the returned function with a point
 * const relation = t({ x:0, y:0 }); // Juicy relational data
 * ```
 *
 * Or with destructuring:
 *
 * ```js
 * const { angle, distanceFromStart, distanceFromLast, average, centroid, speed } = t({ x:0,y:0 });
 * ```
 *
 * x & y coordinates can also be used as parameters:
 * ```js
 * const t = Points.relation(50, 50);
 * const result = t(0, 0);
 * // result.speed, result.angle ...
 * ```
 *
 * Note that intermediate values are not stored. It keeps the initial
 * and most-recent point. If you want to compute something over a set
 * of prior points, you may want to use {@link PointsTracker}
 * @param a Initial point, or x value
 * @param b y value, if first option is a number.
 * @returns
 */
declare const relation: (a: Point | number, b?: number) => PointRelation;
//#endregion
//#region ../packages/geometry/src/point/rotate.d.ts
/**
 * Rotate a single point by a given amount in radians
 * @param pt
 * @param amountRadian
 * @param origin
 */
declare function rotate(pt: Point, amountRadian: number, origin?: Point): Point;
/**
 * Rotate several points by a given amount in radians
 * @param pt Points
 * @param amountRadian Amount to rotate in radians. If 0 is given, a copy of the input array is returned
 * @param origin Origin to rotate around. Defaults to 0,0
 */
declare function rotate(pt: readonly Point[], amountRadian: number, origin?: Point): readonly Point[];
//#endregion
//#region ../packages/geometry/src/point/rotate-point-array.d.ts
declare const rotatePointArray: (v: ReadonlyArray<ReadonlyArray<number>>, amountRadian: number) => Array<Array<number>>;
//#endregion
//#region ../packages/geometry/src/point/round.d.ts
/**
 * Round the point's _x_ and _y_ to given number of digits
 * @param ptOrX
 * @param yOrDigits
 * @param digits
 * @returns
 */
declare const round: (ptOrX: Point | number, yOrDigits?: number, digits?: number) => Point;
//#endregion
//#region ../packages/geometry/src/point/subtract.d.ts
declare function subtract$1(a: Point, b: Point): Point;
declare function subtract$1(a: Point3d, b: Point3d): Point3d;
declare function subtract$1(a: Point, x: number, y: number): Point;
declare function subtract$1(a: Point3d, x: number, y: number, z: number): Point3d;
declare function subtract$1(ax: number, ay: number, bx: number, by: number): Point;
declare function subtract$1(ax: number, ay: number, az: number, bx: number, by: number, bz: number): Point3d;
//#endregion
//#region ../packages/geometry/src/point/sum.d.ts
declare function sum$1(a: Point, b: Point): Point;
declare function sum$1(a: Point3d, b: Point3d): Point3d;
declare function sum$1(a: Point, x: number, y: number): Point;
declare function sum$1(a: Point3d, x: number, y: number, z: number): Point3d;
declare function sum$1(ax: number, ay: number, bx: number, by: number): Point;
declare function sum$1(ax: number, ay: number, az: number, bx: number, by: number, bz: number): Point3d;
//#endregion
//#region ../packages/geometry/src/point/to.d.ts
/**
 * Returns a point with rounded x,y coordinates. By default uses `Math.round` to round.
 * ```js
 * toIntegerValues({x:1.234, y:5.567}); // Yields: {x:1, y:6}
 * ```
 *
 * ```js
 * toIntegerValues(pt, Math.ceil); // Use Math.ceil to round x,y of `pt`.
 * ```
 * @param pt Point to round
 * @param rounder Rounding function, or Math.round by default
 * @returns
 */
declare const toIntegerValues: (pt: Point, rounder?: (x: number) => number) => Point;
/**
 * Returns a copy of `pt` with `z` field omitted.
 * If it didn't have one to begin within, a copy is still returned.
 * @param pt
 * @returns
 */
declare const to2d: (pt: Point) => Point;
/**
 * Returns a copy of `pt` with a `z` field set.
 * Defaults to a z value of 0.
 * @param pt Point
 * @param z Z-value, defaults to 0
 * @returns
 */
declare const to3d: (pt: Point, z?: number) => Point3d;
/**
 * Returns a human-friendly string representation `(x, y)`.
 * If `precision` is supplied, this will be the number of significant digits.
 * @param p
 * @returns
 */
declare function toString(p: Point, digits?: number): string;
//#endregion
//#region ../packages/geometry/src/point/to-array.d.ts
/**
 * Returns point as an array in the form [x,y]. This can be useful for some libraries
 * that expect points in array form.
 *
 * ```
 * const p = {x: 10, y:5};
 * const p2 = toArray(p); // yields [10,5]
 * ```
 * @param p
 * @returns
 */
declare const toArray$1: (p: Point) => ReadonlyArray<number>;
//#endregion
//#region ../packages/geometry/src/point/within-range.d.ts
/**
 * Returns true if two points are within a specified range on both axes.
 *
 * Provide a point for the range to set different x/y range, or pass a number
 * to use the same range for both axis.
 *
 * Note this simply compares x,y values it does not calcuate distance.
 *
 * @example
 * ```js
 * withinRange({x:100,y:100}, {x:101, y:101}, 1); // True
 * withinRange({x:100,y:100}, {x:105, y:101}, {x:5, y:1}); // True
 * withinRange({x:100,y:100}, {x:105, y:105}, {x:5, y:1}); // False - y axis too far
 * ```
 * @param a
 * @param b
 * @param maxRange
 * @returns
 */
declare const withinRange: (a: Point, b: Point, maxRange: Point | number) => boolean;
//#endregion
//#region ../packages/geometry/src/point/wrap.d.ts
/**
 * Wraps a point to be within `ptMin` and `ptMax`.
 * Note that max values are _exclusive_, meaning the return value will always be one less.
 *
 * Eg, if a view port is 100x100 pixels, wrapping the point 150,100 yields 50,99.
 *
 * ```js
 * // Wraps 150,100 to on 0,0 -100,100 range
 * wrap({x:150,y:100}, {x:100,y:100});
 * ```
 *
 * Wrap normalised point:
 * ```js
 * wrap({x:1.2, y:1.5}); // Yields: {x:0.2, y:0.5}
 * ```
 * @param pt Point to wrap
 * @param ptMax Maximum value, or `{ x:1, y:1 }` by default
 * @param ptMin Minimum value, or `{ x:0, y:0 }` by default
 * @returns Wrapped point
 */
declare const wrap$2: (pt: Point, ptMax?: Point, ptMin?: Point) => Point;
declare namespace index_d_exports$4 {
  export { Empty$1 as Empty, Empty3d, Placeholder$1 as Placeholder, Placeholder3d, Point, Point3d, Point3dApplyFn, PointApplyFn, PointAverageKinds, PointAverager, PointAveragerKinds, PointRelation, PointRelationResult, PointTrack, PointTracker, PointTrackerResults, PointsTracker, Unit, Unit3d, UserPointerTracker, UserPointersTracker, abs, angleRadian, angleRadianCircle, angleRadianThreePoint, apply, average, averager, bbox, bbox3d, centroid, clamp, clampMagnitude$1 as clampMagnitude, compare, compareByX, compareByY, compareByZ, convexHull, cross, crossProductRaw, distance, distance2d, distanceToCenter, distanceToExterior, divide$2 as divide, divider, dotProduct$1 as dotProduct, findMinimum, from, fromNumbers$1 as fromNumbers, fromString, getPointParameter, getTwoPointParameters, guard$2 as guard, guardNonZeroPoint, interpolate, invert$1 as invert, isEmpty$1 as isEmpty, isEqual$2 as isEqual, isNaN, isNull, isPlaceholder$1 as isPlaceholder, isPoint, isPoint3d, leftmost, multiply$2 as multiply, multiplyScalar$1 as multiplyScalar, normalise$1 as normalise, normaliseByRect, pipeline, pipelineApply, progressBetween, project, quantiseEvery, random$1 as random, random3d, reduce, relation, rightmost, rotate, rotatePointArray, round, subtract$1 as subtract, sum$1 as sum, test, to2d, to3d, toArray$1 as toArray, toIntegerValues, toString, withinRange, wrap$2 as wrap };
}
//#endregion
//#region ../packages/geometry/src/rect/area.d.ts
/**
 * Returns the area of `rect`
 *
 * ```js
 * const rect = { width: 100, height: 100, x: 100, y: 100 };
 * Rects.area(rect);
 * ```
 * @param rect
 * @returns
 */
declare const area: (rect: Rect) => number;
//#endregion
//#region ../packages/geometry/src/rect/apply.d.ts
/**
 * An operation between two fields of a rectangle.
 * Used in the context of {@link applyMerge}
 * ```
 * // Multiply fields
 * const op = (a, b) => a*b;
 * ```
 */
type ApplyMergeOp = (a: number, b: number) => number;
type ApplyFieldOp = (fieldValue: number, fieldName?: `x` | `y` | `width` | `height`) => number;
declare function applyFields(op: ApplyFieldOp, rect: RectPositioned): RectPositioned;
declare function applyFields(op: ApplyFieldOp, rect: Rect): Rect;
declare function applyFields(op: ApplyFieldOp, width: number, height: number): Rect;
declare function applyMerge(op: ApplyMergeOp, rect: RectPositioned, width: number, height?: number): RectPositioned;
declare function applyMerge(op: ApplyMergeOp, rect: Rect, width: number, height: number): Rect;
declare function applyMerge(op: ApplyMergeOp, a: RectPositioned, b: Rect): RectPositioned;
declare function applyMerge(op: ApplyMergeOp, a: Rect, b: Rect): Rect;
/**
 * Uses `op` with `param` to width and height.
 * @param op
 * @param rect
 * @param parameter
 */
declare function applyScalar(op: ApplyMergeOp, rect: Rect, parameter: number): Rect;
/**
 * Uses `op` to apply with `param` to width, height, x & y.
 * Use `applyDim` to apply just to dimensions.
 * @param op
 * @param rect
 * @param parameter
 */
declare function applyScalar(op: ApplyMergeOp, rect: RectPositioned, parameter: number): RectPositioned;
/**
 * Applies `op` with `param` to `rect`'s width and height.
 * @param op
 * @param rect
 * @param parameter
 * @returns
 */
declare function applyDim(op: ApplyMergeOp, rect: Rect | RectPositioned, parameter: number): Rect | RectPositioned;
//#endregion
//#region ../packages/geometry/src/grid/types.d.ts
type GridVisual = Grid & {
  readonly size: number;
};
type Grid = {
  readonly rows: number;
  readonly cols: number;
};
type GridCell = {
  readonly x: number;
  readonly y: number;
};
type GridNeighbours = {
  readonly n: GridCell | undefined;
  readonly e: GridCell | undefined;
  readonly s: GridCell | undefined;
  readonly w: GridCell | undefined;
  readonly ne: GridCell | undefined;
  readonly nw: GridCell | undefined;
  readonly se: GridCell | undefined;
  readonly sw: GridCell | undefined;
};
type GridCardinalDirection = `n` | `ne` | `e` | `se` | `s` | `sw` | `w` | `nw`;
type GridCardinalDirectionOptional = GridCardinalDirection | ``;
type GridArray1d<T> = GridReadable<T> & GridWritable<T> & {
  array: T[];
};
/**
 * Bounds logic
 * * Unbounded: attempts to read beyond limits
 * * Undefined: returns _undefined_ when reading beyond limits
 * * Stop: returns cell value at edge of limits
 * * Wrap: Wrap-around cell positions
 *
 */
type GridBoundsLogic =
/**
 * Unbounded: attempts to read beyond limits
 */
`unbounded` |
/**
 * Undefined: returns _undefined_ when reading beyond limits
 */
`undefined` |
/**
 * Stop: returns cell value at edge of limits
 */
`stop` |
/**
 * Wrap-around cell positions
 */
`wrap`;
/**
 * Logic to select the next cell based on a list of neighbours
 */
type GridNeighbourSelectionLogic = {
  /**
   * Returns neighbours for a given cell in a grid
   */
  readonly getNeighbours?: GridIdentifyNeighbours;
  /**
   * Select a neighbour from given list
   */
  readonly select: GridNeighbourSelector;
};
type GridVisitorOpts = Readonly<{
  start: GridCell;
  visited: ISetMutable<GridCell>;
  reversed: boolean;
  debug: boolean;
  boundsWrap: GridBoundsLogic;
}>;
type GridCreateVisitor = (grid: Grid, opts?: Partial<GridVisitorOpts>) => Generator<GridCell>;
type GridCellAndValue<T> = {
  cell: GridCell;
  value: T | undefined;
};
type GridNeighbourMaybe = readonly [keyof GridNeighbours, GridCell | undefined];
type GridNeighbour = readonly [keyof GridNeighbours, GridCell];
/**
 * A function that returns a value (or _undefined_) based on a _cell_
 *
 * Implementations:
 * * {@link Grids.Array1d.access}: For accessing a single-dimension array as a grid
 * * {@link Grids.Array2d.access}: For accessing a two-dimension array as a grid
 *
 */
type GridCellAccessor<TValue> = (cell: GridCell, wrap?: GridBoundsLogic) => TValue | undefined;
/**
 * A function that sets the value of a cell.
 */
type GridCellSetter<TValue> = (value: TValue, cell: GridCell, wrap?: GridBoundsLogic) => void;
/**
 * Shape of a grid and a function to read values from it, based on
 * cell location.
 *
 * These functions create a GridReadable:
 * * {@link Grids.Array1d.wrap}: wrap an array and read as a grid
 * * {@link Grids.Array1d.wrapMutable}: wrap and modify an array as a grid
 * * {@link Grids.Array2d.wrap}: wrap a two-dimensional grid
 * * {@link Grids.Array2d.wrapMutable}
 */
type GridReadable<T> = Grid & {
  get: GridCellAccessor<T>;
};
type GridWritable<T> = Grid & {
  set: GridCellSetter<T>;
};
/**
 * Neighbour selector logic. For a given set of `neighbours` pick one to visit next.
 */
type GridNeighbourSelector = (neighbours: readonly GridNeighbour[]) => GridNeighbour | undefined;
/**
 * Identify neighbours logic. For a given `grid` and `origin`, return a list of neighbours
 */
type GridIdentifyNeighbours = (grid: Grid, origin: GridCell) => readonly GridNeighbour[];
//#endregion
//#region ../packages/geometry/src/grid/apply-bounds.d.ts
/**
 * Calculates a legal position for a cell based on
 * `grid` size and `bounds` wrapping logic.
 * @param grid
 * @param cell
 * @param wrap
 * @returns
 */
declare const applyBounds: (grid: Grid, cell: GridCell, wrap?: GridBoundsLogic) => GridCell | undefined;
declare namespace array_1d_d_exports {
  export { access$1 as access, createArray, createMutable, set$1 as set, setMutate$1 as setMutate, wrap$1 as wrap, wrapMutable$1 as wrapMutable };
}
/**
 * Returns a {@link GridCellAccessor} to get values from `array`
 * based on cell (`{x,y}`) coordinates.
 *
 * ```js
 * const arr = [
 *  1,2,3,
 *  4,5,6
 * ]
 * const a = access(arr, 3);
 * a({x:0,y:0});  // 1
 * a({x:2, y:2}); // 6
 * ```
 * @param array
 * @param cols
 * @returns
 */
declare const access$1: <V>(array: readonly V[], cols: number) => GridCellAccessor<V>;
/**
 * Returns a {@link GridCellSetter} that can mutate
 * array values based on cell {x,y} positions.
 * ```js
 * const arr = [
 *  1,2,3,
 *  4,5,6
 * ]
 * const a = setMutate(arr, 3);
 * a(10, {x:0,y:0});
 * a(20, {x:2, y:2});
 *
 * // Arr is now:
 * // [
 * //  10, 2, 3,
 * //  4, 5, 20
 * // ]
 * ```
 * @param array
 * @param cols
 * @returns
 */
declare const setMutate$1: <V>(array: V[], cols: number) => GridCellSetter<V>;
declare const set$1: <V>(array: readonly V[], cols: number) => (value: V, cell: GridCell, wrap: GridBoundsLogic) => V[];
/**
 * Wraps `array` for grid access.
 * Mutable, meaning that `array` gets modified if `set` function is used.
 *
 * ```js
 * const g = wrapMutable(myArray, 5); // 5 columns wide
 * g.get({x:1,y:2});     // Get value at cell position
 * g.set(10, {x:1,y:2}); // Set value at cell position
 * g.array;              // Get reference to original passed-in array
 * ```
 *
 * Use {@link wrap} for an immutable version.
 *
 * @param array Array to wrap
 * @param cols Width of grid
 * @returns
 */
declare const wrapMutable$1: <T>(array: T[], cols: number) => GridArray1d<T>;
/**
 * Wraps `array` for grid access.
 * Immutable, such that underlying array is not modified and a
 * call to `set` returns a new `GridArray1d`.
 *
 * ```js
 * const myArray = [
 *    `a`, `b`, `c`,
 *    `d`, `e`, `f`
 * ];
 * let g = wrap(myArray, 3);  // 3 columns wide
 * g.get({ x:1, y:2 });          // Get value at cell position
 *
 * // Note that `set` returns a new instance
 * g = g.set(10, { x:1, y:2 });  // Set value at cell position
 * g.array;                      // Get reference to current array
 * ```
 *
 * Use {@link wrapMutable} to modify an array in-place
 * @param array Array to wrap
 * @param cols Width of grid
 * @returns
 */
declare const wrap$1: <T>(array: T[], cols: number) => GridArray1d<T>;
/**
 * Creates a 1-dimensional array to fit a grid of rows x cols.
 * Use {@link createArray} if you want to create this array and wrap it for grid access.
 *
 * ```js
 * // Creates an array filled with 0, sized for a grid 10 rows by 20 columns
 * const arr = createArray(0, 10, 20);
 *
 * // Alternatively, pass in a grid
 * const arr = createArray(0, { rows: 10, cols: 20 });
 * ```
 * @param rowsOrGrid Number of rows, or a grid to use the settings of
 * @param columns Columns
 */
declare const createArray: <T>(initialValue: T, rowsOrGrid: number | Grid, columns?: number) => T[];
/**
 * Creates a {@link GridArray1d} instance given the dimensions of the grid.
 * Use {@link createArray} if you just want to create an array sized for a grid.
 *
 * Behind the scenes, it runs:
 * ```js
 * const arr = createArray(initialValue, rows, cols);
 * return wrapMutable(arr, cols);
 * ```
 * @param initialValue
 * @param rowsOrGrid
 * @param columns
 * @returns
 */
declare const createMutable: <T>(initialValue: T, rowsOrGrid: number | Grid, columns?: number) => GridArray1d<T>;
declare namespace array_2d_d_exports {
  export { ArrayGrid, access, create$1 as create, set, setMutate, wrap, wrapMutable };
}
type ArrayGrid<T> = GridReadable<T> & GridWritable<T> & {
  array: T[][];
};
/**
 * Create a grid from a 2-dimensional array.
 * ```js
 * const data = [
 *  [1,2,3],
 *  [4,5,6]
 * ]
 * const g = create(data);
 * // { rows: 2, cols: 3 }
 * ```
 * @param array
 * @returns
 */
declare const create$1: <T>(array: ReadonlyArray<T[]> | Array<T[]>) => Grid;
declare const setMutate: <V>(array: V[][]) => GridCellSetter<V>;
declare const access: <T>(array: ReadonlyArray<T[]>) => GridCellAccessor<T>;
declare const wrapMutable: <T>(array: T[][]) => ArrayGrid<T>;
declare const set: <V>(array: readonly V[][]) => (value: V, cell: GridCell, wrap: GridBoundsLogic) => V[][];
/**
 * Wraps `array` with two dimensions for grid access.
 * Immutable, such that underlying array is not modified and a
 * call to `set` returns a new `GridArray1d`.
 *
 * ```js
 * // Grid of rows: 2, cols: 3
 * const myArray = [
 *  [ `a`, `b`, `c` ],
 *  [ `d`, `e`, `f` ]
 * ]
 * let g = wrap(myArray);
 * g.get({x:1,y:2});          // Get value at cell position
 * g = g.set(10, {x:1,y:2}); // Set value at cell position
 * g.array;                  // Get reference to current array
 * ```
 *
 * Use {@link wrapMutable} to modify an array in-place
 * @param array Array to wrap
 * @returns
 */
declare const wrap: <T>(array: T[][]) => ArrayGrid<T>;
declare namespace as_d_exports {
  export { columns, rows };
}
/**
 * Enumerate rows of grid, returning all the cells in the row
 * as an array
 *
 * ```js
 * for (const row of Grid.As.rows(shape)) {
 *  // row is an array of Cells.
 *  // [ {x:0, y:0}, {x:1, y:0} ... ]
 * }
 * ```
 *
 * Use `Grid.values` to convert the returned iterator into values:
 * ```js
 * for (const v of Grid.values(Grid.rows(shape))) {
 * }
 * ```
 * @param grid
 * @param start
 */
declare const rows: (grid: Grid, start?: GridCell) => Generator<GridCell[], void, unknown>;
/**
 * Enumerate columns of grid, returning all the cells in the
 * same column as an array.
 *
 * ```js
 * for (const col of Grid.As.columns(grid)) {
 * }
 * ```
 *
 * Use `Grid.values` to convert into values
 * ```js
 * for (const value of Grid.values(Grid.As.columns(grid))) {
 * }
 * ```
 * @param grid
 * @param start
 */
declare function columns(grid: Grid, start?: GridCell): Generator<GridCell[], void, unknown>;
//#endregion
//#region ../packages/geometry/src/grid/directions.d.ts
/**
 * Returns a list of all cardinal directions: n, ne, nw, e, s, se, sw, w
 */
declare const allDirections: readonly GridCardinalDirection[];
/**
 * Returns a list of + shaped directions: n, e, s, w
 */
declare const crossDirections: readonly GridCardinalDirection[];
/**
 * Returns cells that correspond to the cardinal directions at a specified distance
 * i.e. it projects a line from `start` cell in all cardinal directions and returns the cells at `steps` distance.
 * @param grid Grid
 * @param steps Distance
 * @param start Start poiint
 * @param bounds Logic for if bounds of grid are exceeded
 * @returns Cells corresponding to cardinals
 */
declare const offsetCardinals: (grid: Grid, start: GridCell, steps: number, bounds?: GridBoundsLogic) => GridNeighbours;
/**
 * Returns an `{ x, y }` signed vector corresponding to the provided cardinal direction.
 * ```js
 * const n = getVectorFromCardinal(`n`); // {x: 0, y: -1}
 * ```
 *
 * Optional `multiplier` can be applied to vector
 * ```js
 * const n = getVectorFromCardinal(`n`, 10); // {x: 0, y: -10}
 * ```
 *
 * Blank direction returns `{ x: 0, y: 0 }`
 * @param cardinal Direction
 * @param multiplier Multipler
 * @returns Signed vector in the form of `{ x, y }`
 */
declare const getVectorFromCardinal: (cardinal: GridCardinalDirectionOptional, multiplier?: number) => GridCell;
//#endregion
//#region ../packages/geometry/src/grid/enumerators/cells.d.ts
/**
 * Enumerate all cell coordinates in an efficient manner.
 * Runs left-to-right, top-to-bottom.
 *
 * If end of grid is reached, behaviour depends on `wrap`:
 * * _true_ (default): iterator will wrap to ensure all are visited.
 * * _false_: iterator stops at end of grid
 *
 * ```js
 * import { Grids } from 'ixfx/geometry.js';
 *
 * // Enumerate each cell position, left-to-right, top-to-bottom
 * for (const cell of Grids.By.cells(grid)) {
 *  // cell will be { x, y }
 * }
 * ```
 *
 * See also:
 * * {@link cellValues}: Iterate over cell values
 * * {@link cellsAndValues}: Iterate over pairs of cell coordinates and cell values
 * @param grid Grid to iterate over
 * @param start Starting cell position (default: {x:0,y:0})
 * @param wrap If true (default), iteration will wrap around through (0,0) when end of grid is reached.
 */
declare function cells(grid: Grid, start?: GridCell, wrap?: boolean): Generator<GridCell, void, unknown>;
/**
 * Yield all the values of a grid, left-to-right, top-to-bottom.
 *
 * This is just a wrapper around Grids.values:
 * ```js
 * yield* values(grid, cells(grid, start, wrap));
 * ```
 *
 * See also:
 * * {@link cells}: Iterate over cell coordinates
 * * {@link cellsAndValues}: Iterate over pairs of cell coordinates and cell values
 * @param grid
 * @param start
 * @param wrap
 */
declare function cellValues<T>(grid: GridReadable<T>, start?: GridCell, wrap?: boolean): Generator<T, void>;
/**
 * Yield all cell coordinates and values of a grid, left-to-right, top-to-bottom
 *
 * See also:
 * * {@link cells}: Iterate over cell coordinates
 * * {@link cellValues}: Iterate over cell values
 * @param grid
 * @param start
 * @param wrap
 */
declare function cellsAndValues<T>(grid: GridReadable<T>, start?: GridCell, wrap?: boolean): Generator<GridCellAndValue<T>>;
declare namespace index_d_exports$3 {
  export { cellValues, cells, cellsAndValues };
}
//#endregion
//#region ../packages/geometry/src/grid/geometry.d.ts
/**
 * Returns the cells on the line of `start` and `end`, inclusive
 *
 * ```js
 * // Get cells that connect 0,0 and 10,10
 * const cells = Grids.getLine({x:0,y:0}, {x:10,y:10});
 * ```
 *
 * This function does not handle wrapped coordinates.
 * @param start Starting cell
 * @param end End cell
 * @returns
 */
declare const getLine: (start: GridCell, end: GridCell) => ReadonlyArray<GridCell>;
/**
 * Returns a list of cells from `start` to `end`.
 *
 * Throws an error if start and end are not on same row or column.
 *
 * @param start Start cell
 * @param end end clel
 * @param endInclusive
 * @return Array of cells
 */
declare const simpleLine: (start: GridCell, end: GridCell, endInclusive?: boolean) => ReadonlyArray<GridCell>;
//#endregion
//#region ../packages/geometry/src/grid/guards.d.ts
/**
 * Returns true if `cell` parameter is a cell with x,y fields.
 * Does not check validity of fields.
 *
 * @param cell
 * @return True if parameter is a cell
 */
declare const isCell: (cell: GridCell | undefined) => cell is GridCell;
/**
 * Throws an exception if any of the cell's parameters are invalid
 * @private
 * @param cell
 * @param parameterName
 * @param grid
 */
declare const guardCell: (cell: GridCell, parameterName?: string, grid?: Grid) => void;
/**
 * Throws an exception if any of the grid's parameters are invalid
 * @param grid
 * @param parameterName
 */
declare const guardGrid: (grid: Grid, parameterName?: string) => void;
//#endregion
//#region ../packages/geometry/src/grid/indexing.d.ts
/**
 * Returns the index for a given cell.
 * This is useful if a grid is stored in an array.
 *
 * ```js
 * const data = [
 *  1, 2,
 *  3, 4,
 *  5, 6 ];
 * const cols = 2; // Grid of 2 columns wide
 * const index = indexFromCell(cols, {x: 1, y: 1});
 * // Yields an index of 3
 * console.log(data[index]); // Yields 4
 * ```
 *
 * Bounds logic is applied to cell.x/y separately. Wrapping
 * only ever happens in same col/row.
 * @see cellFromIndex
 * @param grid Grid
 * @param cell Cell to get index for
 * @param wrap Logic for if we hit bounds of grid
 * @returns
 */
declare const indexFromCell: (grid: Grid, cell: GridCell, wrap: GridBoundsLogic) => number | undefined;
/**
 * Returns x,y from an array index.
 *
 * ```js
 *  const data = [
 *   1, 2,
 *   3, 4,
 *   5, 6 ];
 *
 * // Cols of 2, index 2 (ie. data[2] == 3)
 * const cell = cellFromIndex(2, 2);
 * // Yields: {x: 0, y: 1}
 * ```
 * @see indexFromCell
 * @param colsOrGrid
 * @param index
 * @returns
 */
declare const cellFromIndex: (colsOrGrid: number | Grid, index: number) => GridCell;
//#endregion
//#region ../packages/geometry/src/grid/inside.d.ts
/**
 * Returns _true_ if cell coordinates are above zero and within bounds of grid
 *
 * @param grid
 * @param cell
 * @return
 */
declare const inside: (grid: Grid, cell: GridCell) => boolean;
//#endregion
//#region ../packages/geometry/src/grid/is-equal.d.ts
/**
 * Returns _true_ if grids `a` and `b` are equal in value.
 * Returns _false_ if either parameter is undefined.
 *
 * @param a
 * @param b
 * @return
 */
declare const isEqual$1: (a: Grid | GridVisual, b: Grid | GridVisual) => boolean;
/**
 * Returns _true_ if two cells equal.
 * Returns _false_ if either cell are undefined
 *
 * @param a
 * @param b
 * @returns
 */
declare const cellEquals: (a: GridCell | undefined, b: GridCell | undefined) => boolean;
//#endregion
//#region ../packages/geometry/src/grid/neighbour.d.ts
declare const randomNeighbour: (nbos: readonly GridNeighbour[]) => GridNeighbour;
/**
 * Gets a list of neighbours for `cell` (using {@link neighbours}), filtering
 * results to only those that are valid neighbours (using {@link isNeighbour})
 *
 * ```js
 * // Get all eight surrounding cells
 * const n = Grids.neighbourList(grid, cell, Grids.allDirections);
 *
 * // Get north, east, south, west cells
 * const n = Grids.neighbourList(grid, cell, Grids.crossDirections);
 * ```
 * @param grid Grid
 * @param cell Cell
 * @param directions Directions
 * @param bounds Bounds
 * @returns
 */
declare const neighbourList: (grid: Grid, cell: GridCell, directions: readonly GridCardinalDirection[], bounds: GridBoundsLogic) => readonly GridNeighbour[];
/**
 * Returns neighbours for a cell. If no `directions` are provided, it defaults to {@link allDirections}.
 *
 * ```js
 * const grid = { rows: 5, cols: 5 };
 * const cell = { x:2, y:2 };
 *
 * // Get n,ne,nw,e,s,se,sw and w neighbours
 * const n = Grids.neighbours(grid, cell, `wrap`);
 *
 * Yields:
 * {
 *  n: {x: 2, y: 1}
 *  s: {x: 2, y: 3}
 *  ....
 * }
 * ```
 *
 * Returns neighbours without diagonals (ie: n, e, s, w):
 * ```js
 * const n = Grids.neighbours(grid, cell, `stop`, Grids.crossDirections);
 * ```
 * @returns Returns a map of cells, keyed by cardinal direction
 * @param grid Grid
 * @param cell Cell
 * @param bounds How to handle edges of grid
 * @param directions Directions to return
 */
declare const neighbours: (grid: Grid, cell: GridCell, bounds?: GridBoundsLogic, directions?: readonly GridCardinalDirection[]) => GridNeighbours;
//#endregion
//#region ../packages/geometry/src/grid/offset.d.ts
/**
 * Returns a coordinate offset from `start` by `vector` amount.
 *
 * Different behaviour can be specified for how to handle when coordinates exceed the bounds of the grid
 *
 * Note: x and y wrapping are calculated independently. A large wrapping of x, for example won't shift up/down a line.
 *
 * Use {@link Grids.applyBounds} if you need to calculate a wrapped coordinate without adding two together.
 * @param grid Grid to traverse
 * @param vector Offset in x/y
 * @param start Start point
 * @param bounds
 * @returns Cell
 */
declare const offset: (grid: Grid, start: GridCell, vector: GridCell, bounds?: GridBoundsLogic) => GridCell | undefined;
//#endregion
//#region ../packages/geometry/src/grid/to-array.d.ts
declare const toArray2d: <V>(grid: Grid, initialValue?: V) => V[][];
//#endregion
//#region ../packages/geometry/src/grid/to-string.d.ts
/**
 * Returns a key string for a cell instance
 * A key string allows comparison of instances by value rather than reference
 *
 * ```js
 * cellKeyString({x:10,y:20});
 * // Yields: "Cell{10,20}";
 * ```
 * @param v
 * @returns
 */
declare const cellKeyString: (v: GridCell) => string;
//#endregion
//#region ../packages/geometry/src/grid/visual.d.ts
/**
 * Generator that returns rectangles for each cell in a grid
 *
 * @example Draw rectangles
 * ```js
 * import { Drawing } from 'visuals.js'
 * const rects = [...Grids.asRectangles(grid)];
 * Drawing.rect(ctx, rects, { strokeStyle: `silver`});
 * ```
 * @param grid
 */
declare function asRectangles(grid: GridVisual): IterableIterator<RectPositioned>;
/**
 * Returns the cell at a specified visual coordinate
 * or _undefined_ if the position is outside of the grid.
 *
 * `position` must be in same coordinate/scale as the grid.
 *
 * @param position Position, eg in pixels
 * @param grid Grid
 * @return Cell at position or undefined if outside of the grid
 */
declare const cellAtPoint: (grid: GridVisual, position: Point) => GridCell | undefined;
/**
 * Returns a visual rectangle of the cell, positioned from the top-left corner
 *
 * ```js
 * const cell = { x: 1, y: 0 };
 *
 * // 5x5 grid, each cell 5px in size
 * const grid = { rows: 5, cols: 5, size: 5 }
 *
 * const r = rectangleForCell(grid, cell,);
 *
 * // Yields: { x: 5, y: 0, width: 5, height: 5 }
 * ```
 * @param cell
 * @param grid
 * @return
 */
declare const rectangleForCell: (grid: GridVisual, cell: GridCell) => RectPositioned;
/**
 * Returns the visual midpoint of a cell (eg. pixel coordinate)
 *
 * @param cell
 * @param grid
 * @return
 */
declare const cellMiddle: (grid: GridVisual, cell: GridCell) => Point;
//#endregion
//#region ../packages/geometry/src/grid/values.d.ts
declare function values<T>(grid: GridReadable<T>, iter: Iterable<GridCell>): Generator<T>;
declare function values<T>(grid: GridReadable<T>, iter: Iterable<GridCell[]>): Generator<T[]>;
//#endregion
//#region ../packages/geometry/src/grid/visitors/breadth.d.ts
declare const breadthLogic: () => GridNeighbourSelectionLogic;
//#endregion
//#region ../packages/geometry/src/grid/visitors/cell-neighbours.d.ts
declare const neighboursLogic: () => GridNeighbourSelectionLogic;
//#endregion
//#region ../packages/geometry/src/grid/visitors/columns.d.ts
/**
 * Visits cells running down columns, left-to-right.
 * @param opts Options
 * @returns Visitor generator
 */
declare const columnLogic: (opts?: Partial<GridVisitorOpts>) => GridNeighbourSelectionLogic;
//#endregion
//#region ../packages/geometry/src/grid/visitors/depth.d.ts
declare const depthLogic: () => GridNeighbourSelectionLogic;
//#endregion
//#region ../packages/geometry/src/grid/visitors/step.d.ts
/**
 * Runs the provided `visitor` for `steps`, returning the cell we end at
 * ```js
 * // Create visitor & stepper
 * const visitor = Grids.Visit.create(`row`);
 * const stepper = Grids.Visit.stepper(grid, visitor);
 *
 * // Step by 10
 * stepper(10); // GridCell {x,y}
 *
 * // Step by another 2
 * stepper(2);
 * ```
 * @param grid Grid to traverse
 * @param start Start point
 * @param createVisitor Visitor function
 * @returns
 */
declare const stepper: (grid: Grid, createVisitor: GridCreateVisitor, start?: GridCell, resolution?: number) => (step: number, fromStart?: boolean) => GridCell | undefined;
//#endregion
//#region ../packages/geometry/src/grid/visitors/random.d.ts
declare const randomLogic: () => GridNeighbourSelectionLogic;
//#endregion
//#region ../packages/geometry/src/grid/visitors/random-contiguous.d.ts
declare const randomContiguousLogic: () => GridNeighbourSelectionLogic;
//#endregion
//#region ../packages/geometry/src/grid/visitors/rows.d.ts
/**
* Visit by following rows. Normal order is left-to-right, top-to-bottom.
* @param opts Options
* @returns
*/
declare const rowLogic: (opts?: Partial<GridVisitorOpts>) => GridNeighbourSelectionLogic;
//#endregion
//#region ../packages/geometry/src/grid/visitors/visitor.d.ts
/**
 * Visits every cell in grid using supplied selection function
 * In-built functions to use: visitorDepth, visitorBreadth, visitorRandom,
 * visitorColumn, visitorRow.
 *
 * Usage example:
 * ```js
 *  let visitor = Grids.visitor(Grids.visitorRandom, grid, startCell);
 *  for (let cell of visitor) {
 *   // do something with cell
 *  }
 * ```
 *
 * If you want to keep tabs on the visitor, pass in a @ixfx/collections.Sets.ISetMutable instance. This gets
 * updated as cells are visited to make sure we don't visit the same one twice. If a set is not passed
 * in, one will be created internally.
 * ```js
 * let visited = new SetStringMutable<Grids.Cell>(c => Grids.cellKeyString(c));
 * let visitor = Grids.visitor(Grids.visitorRandom, grid, startCell, visited);
 * ```
 *
 * To visit with some delay, try this pattern
 * ```js
 *  const delayMs = 100;
 *  const run = () => {
 *   let cell = visitor.next().value;
 *   if (cell === undefined) return;
 *   // Do something with cell
 *   setTimeout(run, delayMs);
 *  }
 *  setTimeout(run, delayMs);
 * ```
 * @param logic Logic for selecting next cell
 * @param grid Grid to visitl
 * @param opts Options
 * @returns Cells
 */
declare function visitByNeighbours(logic: GridNeighbourSelectionLogic, grid: Grid, opts?: Partial<GridVisitorOpts>): Generator<GridCell>;
declare namespace index_d_exports$2 {
  export { VisitorTypes, breadthLogic, columnLogic, create, depthLogic, neighboursLogic, randomContiguousLogic, randomLogic, rowLogic, stepper, visitByNeighbours, withLogic };
}
type VisitorTypes = `row` | `column` | `neighbours` | `breadth` | `depth` | `random` | `random-contiguous`;
/**
 * Logic types:
 * * 'row': left-to-right, top-to-bottom
 * * 'column': top-to-bottom, left-to-right
 * * 'neighbours': neighbours surrounding cell (eight)
 * * 'breadth`: breadth-first
 * * 'depth': depth-first
 * * 'random': any random cell in grid
 * * 'random-contiguous': any random cell neighbouring an already visited cell
 * @param type
 * @param opts
 * @returns
 */
declare const create: (type: VisitorTypes, opts?: Partial<GridVisitorOpts>) => (grid: Grid, optionsOverride?: Partial<GridVisitorOpts>) => Generator<GridCell>;
declare const withLogic: (logic: GridNeighbourSelectionLogic, options?: Partial<GridVisitorOpts>) => (grid: Grid, optionsOverride?: Partial<GridVisitorOpts>) => Generator<GridCell>;
declare namespace index_d_exports$1 {
  export { array_1d_d_exports as Array1d, array_2d_d_exports as Array2d, as_d_exports as As, index_d_exports$3 as By, Grid, GridArray1d, GridBoundsLogic, GridCardinalDirection, GridCardinalDirectionOptional, GridCell, GridCellAccessor, GridCellAndValue, GridCellSetter, GridCreateVisitor, GridIdentifyNeighbours, GridNeighbour, GridNeighbourMaybe, GridNeighbourSelectionLogic, GridNeighbourSelector, GridNeighbours, GridReadable, GridVisitorOpts, GridVisual, GridWritable, index_d_exports$2 as Visit, allDirections, applyBounds, asRectangles, cellAtPoint, cellEquals, cellFromIndex, cellKeyString, cellMiddle, crossDirections, getLine, getVectorFromCardinal, guardCell, guardGrid, indexFromCell, inside, isCell, isEqual$1 as isEqual, neighbourList, neighbours, offset, offsetCardinals, randomNeighbour, rectangleForCell, simpleLine, toArray2d, values };
}
//#endregion
//#region ../packages/geometry/src/rect/cardinal.d.ts
/**
 * Returns a point on cardinal direction, or 'center' for the middle.
 *
 * ```js
 * cardinal({x: 10, y:10, width:100, height: 20}, 'center');
 * ```
 * @param rect Rectangle
 * @param card Cardinal direction or 'center'
 * @returns Point
 */
declare const cardinal: (rect: RectPositioned, card: GridCardinalDirection | `center`) => Point;
//#endregion
//#region ../packages/geometry/src/rect/center-origin.d.ts
/**
 * Perform basic point translation using a rectangle where its center is the origin.
 *
 * Thus the relative coordinate { x: 0, y: 0} corresponds to the absolute middle of the
 * rectangle.
 *
 * The relative coordinate { x: -1, y: -1 } corresponds to the rectangle's {x,y} properties, and so on.
 * @param rectAbsolute
 * @returns
 */
declare const centerOrigin: (rectAbsolute: RectPositioned) => {
  relativeToAbsolute: (point: Point) => Point;
  absoluteToRelative: (point: Point) => Point;
};
//#endregion
//#region ../packages/geometry/src/rect/center.d.ts
/**
 * Returns the center of a rectangle as a {@link Point}.
 *  If the rectangle lacks a position and `origin` parameter is not provided, 0,0 is used instead.
 *
 * ```js
 * const p = Rects.center({x:10, y:20, width:100, height:50});
 * const p2 = Rects.center({width: 100, height: 50}); // Assumes 0,0 for rect x,y
 * ```
 * @param rect Rectangle
 * @param origin Optional origin. Overrides `rect` position if available. If no position is available 0,0 is used by default.
 * @returns
 */
declare const center: (rect: RectPositioned | Rect, origin?: Point) => Point;
//#endregion
//#region ../packages/geometry/src/rect/corners.d.ts
/**
 * Returns the four corners of a rectangle as an array of Points.
 *
 * ```js
 * const rect = { width: 100, height: 100, x: 0, y: 0};
 * const pts = Rects.corners(rect);
 * ```
 *
 * If the rectangle is not positioned, is origin can be provided.
 * Order of corners: ne, nw, sw, se
 * @param rect
 * @param origin
 * @returns
 */
declare const corners: (rect: RectPositioned | Rect, origin?: Point) => readonly Point[];
//#endregion
//#region ../packages/geometry/src/rect/distance.d.ts
/**
 * Returns the distance from the perimeter of `rect` to `pt`.
 * If the point is within the rectangle, 0 is returned.
 *
 * If `rect` does not have an x,y it's assumed to be 0,0
 *
 * ```js
 * const rect = { width: 100, height: 100, x: 0, y: 0 };
 * Rects.distanceFromExterior(rect, { x: 20, y: 20 });
 * ```
 * @param rect Rectangle
 * @param pt Point
 * @returns Distance
 */
declare const distanceFromExterior: (rect: RectPositioned, pt: Point) => number;
/**
 * Return the distance of `pt` to the center of `rect`.
 *
 * ```js
 * const rect = { width: 100, height: 100, x: 0, y: 0 };
 * Rects.distanceFromCenter(rect, { x: 20, y: 20 });
 * ```
 * @param rect
 * @param pt
 * @returns
 */
declare const distanceFromCenter: (rect: RectPositioned, pt: Point) => number;
//#endregion
//#region ../packages/geometry/src/rect/divide.d.ts
/**
 * Divides positioned `rect` by width/height. Useful for normalising a value.
 * x & y value of second parameter are ignored
 * ```js
 * // Normalise based on window size
 * const r = { x: 10, y: 200, width: 100, height: 30 };
 * const rr = Rects.divide(r, window.innerWidth, window.innerHeight);
 * ```
 *
 * Division applies to the first parameter's x/y fields. X is affected by `width`, Y is affected by `height`.
 */
declare function divide(rect: RectPositioned, width: number, height?: number): RectPositioned;
/**
 * Divides `rect` by width/height. Useful for denormalising a value.
 *
 * ```js
 * // Normalise based on window size
 * const r = { width: 100, height: 30 };
 * const rr = Rects.divide(r, window.innerWidth, window.innerHeight);
 * ```
 *
 */
declare function divide(rect: Rect, width: number, height: number): Rect;
/**
 * Divides positioned rect `a` by width and height of rect `b`.
 * ```js
 * // Returns { ...a, width: a.width / b.width, height: a.height/b.height, x: a.x / b.width, y: a.y / b.height }
 * Rects.divide(a, b);
 * ```
 *
 * @param a
 * @param b
 */
declare function divide(a: RectPositioned, b: Rect | RectPositioned): RectPositioned;
/**
 * Divides rect `a` by width and height of rect `b`.
 *
 * ```js
 * // Returns {...a, width: a.width / b.width, height: a.height/b.height }
 * Rects.divide(a, b);
 * ```
 *
 * @param a
 * @param b
 */
declare function divide(a: Rect, b: Rect): Rect;
/**
 * Divides all components of `rect` by `amount`.
 * ```js
 * divideScalar({ width:10, height:20 }, 2); // { width:5, height: 10 }
 * ```
 * @param rect
 * @param amount
 */
declare function divideScalar(rect: Rect, amount: number): Rect;
/**
 * Divides all components of `rect` by `amount`.
 * This includes x,y if present.
 *
 * ```js
 * divideScalar({ width:10, height:20 }, 2); // { width:5, height: 10 }
 * divideScalar({ x: 1, y: 2, width:10, height:20 }, 2); // { x: 0.5, y: 1, width:5, height: 10 }
 * ```
 * @param rect
 * @param amount
 */
declare function divideScalar(rect: RectPositioned, amount: number): RectPositioned;
declare function divideDim(rect: Rect | RectPositioned, amount: number): Rect | RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/edges.d.ts
/**
 * Returns four lines based on each corner.
 * Lines are given in order: top, right, bottom, left
 *
 * ```js
 * const rect = { width: 100, height: 100, x: 100, y: 100 };
 * // Yields: array of length four
 * const lines = Rects.lines(rect);
 * ```
 *
 * @param {(RectPositioned|Rect)} rect
 * @param {Points.Point} [origin]
 * @returns {Lines.Line[]}
 */
declare const edges: (rect: RectPositioned | Rect, origin?: Point) => readonly Line[];
/**
 * Returns a point on the edge of rectangle
 * ```js
 * const r1 = {x: 10, y: 10, width: 100, height: 50};
 * Rects.getEdgeX(r1, `right`);  // Yields: 110
 * Rects.getEdgeX(r1, `bottom`); // Yields: 10
 *
 * const r2 = {width: 100, height: 50};
 * Rects.getEdgeX(r2, `right`);  // Yields: 100
 * Rects.getEdgeX(r2, `bottom`); // Yields: 0
 * ```
 * @param rect
 * @param edge Which edge: right, left, bottom, top
 * @returns
 */
declare const getEdgeX: (rect: RectPositioned | Rect, edge: `right` | `bottom` | `left` | `top`) => number;
/**
 * Returns a point on the edge of rectangle
 *
 * ```js
 * const r1 = {x: 10, y: 10, width: 100, height: 50};
 * Rects.getEdgeY(r1, `right`);  // Yields: 10
 * Rects.getEdgeY(r1, `bottom`); // Yields: 60
 *
 * const r2 = {width: 100, height: 50};
 * Rects.getEdgeY(r2, `right`);  // Yields: 0
 * Rects.getEdgeY(r2, `bottom`); // Yields: 50
 * ```
 * @param rect
 * @param edge Which edge: right, left, bottom, top
 * @returns
 */
declare const getEdgeY: (rect: RectPositioned | Rect, edge: `right` | `bottom` | `left` | `top`) => number;
//#endregion
//#region ../packages/geometry/src/rect/initialisers.d.ts
declare const Empty: Rect;
declare const EmptyPositioned: RectPositioned;
declare const Placeholder: Rect;
declare const PlaceholderPositioned: RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/encompass.d.ts
/**
 * Returns a copy of `rect` with `rect` resized so it also encompasses `points`.
 * If provided point(s) are within bounds of `rect`, a copy of `rect` is returned.
 * @param rect
 * @param points
 * @returns
 */
declare const encompass: (rect: RectPositioned, ...points: Point[]) => RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/from-center.d.ts
/**
 * Initialises a rectangle based on its center, a width and height
 *
 * ```js
 * // Rectangle with center at 50,50, width 100 height 200
 * Rects.fromCenter({x: 50, y:50}, 100, 200);
 * ```
 * @param origin
 * @param width
 * @param height
 * @returns
 */
declare const fromCenter: (origin: Point, width: number, height: number) => RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/from-element.d.ts
/**
 * Initialise a rectangle based on the width and height of a HTML element.
 *
 * ```js
 * Rects.fromElement(document.querySelector(`body`));
 * ```
 * @param el
 * @returns
 */
declare const fromElement: (el: HTMLElement) => Rect;
//#endregion
//#region ../packages/geometry/src/rect/from-numbers.d.ts
/**
 * Returns a rectangle from width, height
 * ```js
 * const r = Rects.fromNumbers(100, 200);
 * // {width: 100, height: 200}
 * ```
 *
 * Use {@link toArray} for the opposite conversion.
 *
 * @param width
 * @param height
 */
declare function fromNumbers(width: number, height: number): Rect;
/**
 * Returns a rectangle from x,y,width,height
 *
 * ```js
 * const r = Rects.fromNumbers(10, 20, 100, 200);
 * // {x: 10, y: 20, width: 100, height: 200}
 * ```
 *
 * Use the spread operator (...) if the source is an array:
 * ```js
 * const r3 = Rects.fromNumbers(...[10, 20, 100, 200]);
 * ```
 *
 * Use {@link toArray} for the opposite conversion.
 *
 * @param x
 * @param y
 * @param width
 * @param height
 */
declare function fromNumbers(x: number, y: number, width: number, height: number): RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/from-top-left.d.ts
/**
 * Creates a rectangle from its top-left coordinate, a width and height.
 *
 * ```js
 * // Rectangle at 50,50 with width of 100, height of 200.
 * const rect = Rects.fromTopLeft({ x: 50, y:50 }, 100, 200);
 * ```
 * @param origin
 * @param width
 * @param height
 * @returns
 */
declare const fromTopLeft: (origin: Point, width: number, height: number) => RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/get-rect-positionedparameter.d.ts
/**
 * Accepts:
 * * x,y,w,h
 * * x,y,rect
 * * point,rect
 * * RectPositioned
 * * Rect, x,y
 * * Rect, Point
 * @param a
 * @param b
 * @param c
 * @param d
 * @returns
 */
declare function getRectPositionedParameter(a: number | Point | Rect | RectPositioned, b?: Rect | number | Point, c?: number | Rect, d?: number): RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/guard.d.ts
/**
 * Throws an error if the dimensions of the rectangle are undefined, NaN or negative.
 * @param d
 * @param name
 */
declare const guardDim: (d: number, name?: string) => void;
/**
 * Throws an error if rectangle is missing fields or they
 * are not valid.
 *
 * Checks:
 * * `width` and `height` must be defined on `rect`
 * * dimensions (w & h) must not be NaN
 * * dimensions (w & h) must not be negative
 *
 * If `rect` has x,y, this value is checked as well.
 * @param rect
 * @param name
 */
declare const guard: (rect: Rect, name?: string) => void;
/**
 * Returns a positioned rect or if it's not possible, throws an error.
 *
 * If `rect` does not have a position, `origin` is used.
 * If `rect` is positioned and `origin` is provided, returned result uses `origin` as x,y instead.
 * ```js
 * // Returns input because it's positioned
 * getRectPositioned({ x:1, y:2, width:10, height:20 });
 *
 * // Returns { x:1, y:2, width:10, height:20 }
 * getRectPositioned({ width:10, height:20 }, { x:1, y:2 });
 *
 * // Throws, because we have no point
 * getRectPositioned({width:10,height:20})
 * ```
 * @param rect
 * @param origin
 * @returns
 */
declare const getRectPositioned: (rect: Rect | RectPositioned, origin?: Point) => RectPositioned;
/**
 * Throws an error if `rect` is does not have a position, or
 * is an invalid rectangle
 * @param rect
 * @param name
 */
declare const guardPositioned: (rect: RectPositioned, name?: string) => void;
/**
 * Returns _true_ if `rect` has width and height values of 0.
 * Use Rects.Empty or Rects.EmptyPositioned to generate an empty rectangle.
 * @param rect
 * @returns
 */
declare const isEmpty: (rect: Rect) => boolean;
/**
 * Returns _true_ if `rect` is a placeholder, with both width and height values of NaN.
 * Use Rects.Placeholder or Rects.PlaceholderPositioned to generate a placeholder.
 * @param rect
 * @returns
 */
declare const isPlaceholder: (rect: Rect) => boolean;
/**
 * Returns _true_ if `rect` has position (x,y) fields.
 * @param rect Point, Rect or RectPositiond
 * @returns
 */
declare const isPositioned: (rect: Point | Rect | RectPositioned) => rect is Point;
/**
 * Returns _true_ if `rect` has width and height fields.
 * @param rect
 * @returns
 */
declare const isRect: (rect: unknown) => rect is Rect;
/**
 * Returns _true_ if `rect` is a positioned rectangle
 * Having width, height, x and y properties.
 * @param rect
 * @returns
 */
declare const isRectPositioned: (rect: any) => rect is RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/Intersects.d.ts
/**
 * Returns _true_ if `point` is within, or on boundary of `rect`.
 *
 * ```js
 * Rects.intersectsPoint(rect, { x: 100, y: 100});
 * ```
 * @param rect
 * @param point
 */
declare function intersectsPoint(rect: Rect | RectPositioned, point: Point): boolean;
/**
 * Returns true if x,y coordinate is within, or on boundary of `rect`.
 * ```js
 * Rects.intersectsPoint(rect, 100, 100);
 * ```
 * @param rect
 * @param x
 * @param y
 */
declare function intersectsPoint(rect: Rect | RectPositioned, x: number, y: number): boolean;
/**
 * Returns true if `a` or `b` overlap, are equal, or `a` contains `b`.
 * A rectangle can be checked for intersections with another RectPositioned, CirclePositioned or Point.
 *
 */
declare const isIntersecting: (a: RectPositioned, b: CirclePositioned | Point) => boolean;
//#endregion
//#region ../packages/geometry/src/rect/is-equal.d.ts
/**
 * Returns _true_ if the width & height of the two rectangles is the same.
 *
 * ```js
 * const rectA = { width: 10, height: 10, x: 10, y: 10 };
 * const rectB = { width: 10, height: 10, x: 20, y: 20 };
 *
 * // True, even though x,y are different
 * Rects.isEqualSize(rectA, rectB);
 *
 * // False, because coordinates are different
 * Rects.isEqual(rectA, rectB)
 * ```
 * @param a
 * @param b
 * @returns
 */
declare const isEqualSize: (a: Rect, b: Rect) => boolean;
/**
 * Returns _true_ if two rectangles have identical values.
 * Both rectangles must be positioned or not.
 *
 * ```js
 * const rectA = { width: 10, height: 10, x: 10, y: 10 };
 * const rectB = { width: 10, height: 10, x: 20, y: 20 };
 *
 * // False, because coordinates are different
 * Rects.isEqual(rectA, rectB)
 *
 * // True, even though x,y are different
 * Rects.isEqualSize(rectA, rectB);
 * ```
 * @param a
 * @param b
 * @returns
 */
declare const isEqual: (a: Rect | RectPositioned, b: Rect | RectPositioned) => boolean;
//#endregion
//#region ../packages/geometry/src/rect/lengths.d.ts
/**
 * Returns the length of each side of the rectangle (top, right, bottom, left)
 *
 * ```js
 * const rect = { width: 100, height: 100, x: 100, y: 100 };
 * // Yields: array of length four
 * const lengths = Rects.lengths(rect);
 * ```
 * @param rect
 * @returns
 */
declare const lengths: (rect: RectPositioned) => readonly number[];
//#endregion
//#region ../packages/geometry/src/rect/max.d.ts
/**
 * Returns a rectangle based on provided four corners.
 *
 * To create a rectangle that contains an arbitary set of points, use {@link Points.bbox}.
 *
 * Does some sanity checking such as:
 *  - x will be smallest of topLeft/bottomLeft
 *  - y will be smallest of topRight/topLeft
 *  - width will be largest between top/bottom left and right
 *  - height will be largest between left and right top/bottom
 *
 */
declare const maxFromCorners: (topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point) => RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/multiply.d.ts
/**
 * Multiplies positioned `rect` by width/height. Useful for denormalising a value.
 * x/y value of second parameter are ignored.
 * ```js
 * // Normalised rectangle
 * const r = { x:0.5, y:0.5, width: 0.5, height: 0.5};
 *
 * // Map to window:
 * const rr = Rects.multiply(r, window.innerWidth, window.innerHeight);
 * ```
 *
 * Multiplication applies to the first parameter's x/y fields.
 */
declare function multiply(rect: RectPositioned, width: number, height?: number): RectPositioned;
/**
 * Multiplies `rect` by width/height. Useful for denormalising a value.
 *
 * ```js
 * // Normalised rectangle of width 50%, height 50%
 * const r = { width: 0.5, height: 0.5 };
 *
 * // Map to window:
 * const rr = Rects.multiply(r, window.innerWidth, window.innerHeight);
 * ```
 *
 * Multiplication applies to the first parameter's x/y fields, if present.
 */
declare function multiply(rect: Rect, width: number, height: number): Rect;
/**
 * Multiplies positioned rect `a` by width and height of rect `b`.
 * ```js
 * // Returns {width: someRect.width * someOtherRect.width ...}
 * Rects.multiply(someRect, someOtherRect);
 * ```
 *
 * @param a
 * @param b
 */
declare function multiply(a: RectPositioned, b: Rect | RectPositioned): RectPositioned;
/**
 * Multiplies rect `a` by width and height of rect `b`.
 *
 * ```js
 * // Returns {width: someRect.width * someOtherRect.width ...}
 * Rects.multiply(someRect, someOtherRect);
 * ```
 *
 * @param a
 * @param b
 */
declare function multiply(a: Rect, b: Rect): Rect;
/**
 * Multiplies all components of `rect` by `amount`.
 * ```js
 * multiplyScalar({ width:10, height:20 }, 2); // { width:20, height: 40 }
 * ```
 * @param rect
 * @param amount
 */
declare function multiplyScalar(rect: Rect, amount: number): Rect;
/**
 * Multiplies all components of `rect` by `amount`.
 * This includes x,y if present.
 *
 * ```js
 * multiplyScalar({ width:10, height:20 }, 2); // { width:20, height: 40 }
 * multiplyScalar({ x: 1, y: 2, width:10, height:20 }, 2); // { x: 2, y: 4, width:20, height: 40 }
 * ```
 * @param rect
 * @param amount
 */
declare function multiplyScalar(rect: RectPositioned, amount: number): RectPositioned;
/**
 * Multiplies only the width/height of `rect`, leaving `x` and `y` as they are.
 * ```js
 * multiplyDim({ x:1,y:2,width:3,height:4 }, 2);
 * // Yields: { x:1, y:2, width:6, height: 8 }
 * ```
 *
 * In comparison, {@link multiply} will also include x & y.
 * @param rect Rectangle
 * @param amount Amount to multiply by
 * @returns
 */
declare function multiplyDim(rect: Rect | RectPositioned, amount: number): Rect | RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/nearest.d.ts
/**
 * If `p` is inside of `rect`, a copy of `p` is returned.
 * If `p` is outside of `rect`, a point is returned closest to `p` on the edge
 * of the rectangle.
 * @param rect
 * @param p
 * @returns
 */
declare const nearestInternal: (rect: RectPositioned, p: Point) => Point;
//#endregion
//#region ../packages/geometry/src/rect/perimeter.d.ts
/**
 * Returns the perimeter of `rect` (ie. sum of all edges)
 *  * ```js
 * const rect = { width: 100, height: 100, x: 100, y: 100 };
 * Rects.perimeter(rect);
 * ```
 * @param rect
 * @returns
 */
declare const perimeter: (rect: Rect) => number;
//#endregion
//#region ../packages/geometry/src/rect/normalise-by-rect.d.ts
/**
 * Returns a function that divides numbers or points by the largest dimension of `rect`.
 *
 * ```js
 * const d = dividerByLargestDimension({width:100,height:50});
 * d(50);                // 0.5 (50/100)
 * d({ x: 10, y: 20 }); // { x: 0.1, y: 0.2 }
 * ```
 * @param rect
 * @returns
 */
declare const dividerByLargestDimension: (rect: Rect) => (value: number | Point) => number | Point;
//#endregion
//#region ../packages/geometry/src/rect/random.d.ts
/**
 * Returns a random positioned Rect on a 0..1 scale.
 * ```js
 * const r = Rects.random(); // eg {x: 0.2549012, y:0.859301, width: 0.5212, height: 0.1423 }
 * ```
 *
 * A custom source of randomness can be provided:
 * ```js
 * import { Rects } from "@ixfx/geometry.js";
 * import { weightedSource } from "@ixfx/random.js"
 * const r = Rects.random(weightedSource(`quadIn`));
 * ```
 * @param rando
 * @returns
 */
declare const random: (rando?: RandomSource) => RectPositioned;
type RectRandomPointOpts = {
  readonly strategy?: `naive`;
  readonly randomSource?: RandomSource;
  readonly margin?: {
    readonly x: number;
    readonly y: number;
  };
};
/**
 * Returns a random point within a rectangle.
 *
 * By default creates a uniform distribution.
 *
 * ```js
 * const pt = randomPoint({width: 5, height: 10});
 * ```'
 * @param within Rectangle to generate a point within
 * @param options Options
 * @returns
 */
declare const randomPoint: (within: Rect | RectPositioned, options?: RectRandomPointOpts) => Point;
//#endregion
//#region ../packages/geometry/src/rect/subtract.d.ts
/**
 * Subtracts width/height of `b` from `a` (ie: a - b), returning result.
 * x,y of second parameter is ignored.
 * ```js
 * const rectA = { width: 100, height: 100 };
 * const rectB = { width: 200, height: 200 };
 *
 * // Yields: { width: -100, height: -100 }
 * Rects.subtract(rectA, rectB);
 * ```
 * @param a
 * @param b
 */
declare function subtract(a: Rect, b: Rect | RectPositioned): Rect;
declare function subtract(a: RectPositioned, b: Rect | RectPositioned): RectPositioned;
/**
 * Subtracts a width/height from `a`, returning result.
 * ```js
 * const rect = { width: 100, height: 100 };
 * Rects.subtract(rect, 200, 200);
 * // Yields: { width: -100, height: -100 }
 * ```
 * @param a
 * @param width
 * @param height
 */
declare function subtract(a: Rect, width: number, height: number): Rect;
declare function subtract(a: RectPositioned, width: number, height: number): RectPositioned;
/**
 * Subtracts a width & height from `a`. Leaves x & y as-is.
 * ```js
 * const rect = { x: 10, y: 20, width: 100, height: 200 };
 * subtractSize(rect, { width: 50, height: 100 });
 * subtractSize(rec, 50, 100);
 * // Both yields: { x:10, y: 20, width: 50, height: 100 }
 * ```
 * @param a Rectangle
 * @param b Rectangle to subtract by, or width
 * @param c Height, if second parameter is width
 */
declare function subtractSize(a: RectPositioned, b: Rect | number, c?: number): RectPositioned;
/**
 * Subtracts a width & height from `a`.
 * ```js
 * const rect = { width: 100, height: 200 };
 * subtractSize(rect, { width: 50, height: 100 });
 * subtractSize(rec, 50, 100);
 * // Both yields: { width: 50, height: 100 }
 * ```
 * @param a Rectangle
 * @param b Rectangle to subtract by, or width
 * @param c Height, if second parameter is width
 */
declare function subtractSize(a: Rect, b: Rect | number, c?: number): Rect;
/**
 * Subtracts A-B. Applies to x, y, width & height
 * ```js
 * subtractOffset(
 *  { x:100, y:100, width:100, height:100 },
 *  { x:10, y:20,   width: 30, height: 40 }
 * );
 * // Yields: {x: 90, y: 80, width: 70, height: 60 }
 * ```
 * If either `a` or `b` are missing x & y, 0 is used.
 * @param a
 * @param b
 * @returns
 */
declare function subtractOffset(a: RectPositioned | Rect, b: RectPositioned | Rect): RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/sum.d.ts
/**
 * Sums width/height of `b` with `a` (ie: a + b), returning result.
 * x/y of second parameter are ignored
 * ```js
 * import { Rects } from "@ixfx/geometry.js";
 * const rectA = { width: 100, height: 100 };
 * const rectB = { width: 200, height: 200 };
 *
 * // Yields: { width: 300, height: 300 }
 * Rects.sum(rectA, rectB);
 * ```
 * @param a
 * @param b
 */
declare function sum(a: Rect, b: Rect | RectPositioned): Rect;
/**
 * Sums width/height of `b` with `a`, returning result.
 *
 * Note that width/height of `b` is also added to `a`'s x & y properties
 * ```js
 * // Yields: { x:101, y:202, width: 110, height: 220 }
 * sum({x:1, y:2, width:10, height:20}, {width:100, height: 200});
 * ```
 *
 * x & y values of `b` are ignored. If you want to sum with those, use `sumOffset`
 * @param a
 * @param b
 */
declare function sum(a: RectPositioned, b: Rect | RectPositioned): RectPositioned;
/**
 * Sums width/height of `rect` with given `width` and `height`
 * ```js
 * import { Rects } from "@ixfx/geometry.js";
 * const rect = { width: 100, height: 100 };
 *
 * // Yields: { width: 300, height: 300 }
 * Rects.subtract(rect, 200, 200);
 * ```
 * @param rect
 * @param width
 * @param height
 */
declare function sum(rect: Rect, width: number, height: number): Rect;
/**
 * Sums width/height of `rect` with `width` and `height`
 *
 * `width` and `height` is added to `rect`'s `x` and `y` values.
 * ```js
 * // Yields: { x:101, y:202, width: 110, height: 220 }
 * sum({x:1, y:2, width:10, height:20}, 100, 200);
 * ```
 * @param rect
 * @param width
 * @param height
 */
declare function sum(rect: RectPositioned, width: number, height: number): RectPositioned;
/**
 * Sums x,y,width,height of a+b.
 * ```js
 * sumOffset({x:100,y:100,width:100,height:100}, {x:10, y:20, width: 30, height: 40});
 * // Yields: {x: 110, y: 120, width: 130, height: 140 }
 * ```
 * If either `a` or `b` are missing x & y, 0 is used
 * @param a
 * @param b
 * @returns
 */
declare function sumOffset(a: RectPositioned | Rect, b: RectPositioned | Rect): RectPositioned;
//#endregion
//#region ../packages/geometry/src/rect/to-array.d.ts
/**
 * Converts a rectangle to an array of numbers. See {@link fromNumbers} for the opposite conversion.
 *
 * ```js
 *
 * const r1 = Rects.toArray({ x: 10, y:20, width: 100, height: 200 });
 * // [10, 20, 100, 200]
 * const r2 = Rects.toArray({ width: 100, height: 200 });
 * // [100, 200]
 * ```
 * @param rect
 * @see fromNumbers
 */
declare function toArray(rect: Rect): RectArray;
/**
 * Converts a rectangle to an array of numbers. See {@link fromNumbers} for the opposite conversion.
 *
 * ```js
 *
 * const r1 = Rects.toArray({ x: 10, y:20, width: 100, height: 200 });
 * // [10, 20, 100, 200]
 * const r2 = Rects.toArray({ width: 100, height: 200 });
 * // [100, 200]
 * ```
 * @param rect
 * @see fromNumbers
 */
declare function toArray(rect: RectPositioned): RectPositionedArray;
declare namespace index_d_exports {
  export { ApplyFieldOp, ApplyMergeOp, Empty, EmptyPositioned, Placeholder, PlaceholderPositioned, Rect, Rect3d, Rect3dPositioned, RectArray, RectPositioned, RectPositionedArray, RectRandomPointOpts, applyDim, applyFields, applyMerge, applyScalar, area, cardinal, center, centerOrigin, corners, distanceFromCenter, distanceFromExterior, divide, divideDim, divideScalar, dividerByLargestDimension, edges, encompass, fromCenter, fromElement, fromNumbers, fromTopLeft, getEdgeX, getEdgeY, getRectPositioned, getRectPositionedParameter, guard, guardDim, guardPositioned, intersectsPoint, isEmpty, isEqual, isEqualSize, isIntersecting, isPlaceholder, isPositioned, isRect, isRectPositioned, lengths, maxFromCorners, multiply, multiplyDim, multiplyScalar, nearestInternal, perimeter, random, randomPoint, subtract, subtractOffset, subtractSize, sum, sumOffset, toArray };
}
//#endregion
export { index_d_exports$5 as A, Triangle as B, index_d_exports$4 as C, PointsTracker as D, PointTrackerResults as E, PolarToCartesian as F, Line as G, PointCalculableShape as H, PointRelation as I, CirclePositioned as J, PolyLine as K, PointRelationResult as L, PolarLine as M, PolarRay as N, UserPointerTracker as O, PolarRayWithOrigin as P, index_d_exports$6 as R, GridWritable as S, PointTracker as T, ShapePositioned as U, ContainsResult as V, Sphere as W, CircleToSvg as X, CircleRandomPointOpts as Y, GridNeighbourSelector as _, GridBoundsLogic as a, GridVisitorOpts as b, GridCell as c, GridCellSetter as d, GridCreateVisitor as f, GridNeighbourSelectionLogic as g, GridNeighbourMaybe as h, GridArray1d as i, Coord as j, UserPointersTracker as k, GridCellAccessor as l, GridNeighbour as m, index_d_exports$1 as n, GridCardinalDirection as o, GridIdentifyNeighbours as p, Circle as q, Grid as r, GridCardinalDirectionOptional as s, index_d_exports as t, GridCellAndValue as u, GridNeighbours as v, PointTrack as w, GridVisual as x, GridReadable as y, BarycentricCoord as z };