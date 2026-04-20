import { r as Point } from "./point-type-DLbh1Hzz.js";
import { G as Line, J as CirclePositioned, K as PolyLine, X as CircleToSvg, Y as CircleRandomPointOpts, q as Circle } from "./index-3c5aUDaq.js";
import { a as RectPositioned, t as Rect } from "./rect-types-C3cN9Uxl.js";
import { i as WithBeziers, n as Dimensions, r as Path, t as CompoundPath } from "./path-type-CgxfTQlW.js";

//#region ../packages/geometry/src/arc/arc-type.d.ts
/**
 * Arc, defined by radius, start and end point in radians and direction
 */
type Arc = {
  /**
   * Radius of arc
   */
  readonly radius: number;
  /**
   * Start radian
   */
  readonly startRadian: number;
  /**
   * End radian
   */
  readonly endRadian: number;
  /**
   * If true, arc runs in clockwise direction
   */
  readonly clockwise: boolean;
};
/**
 * An {@link Arc} that also has a center position, given in x, y
 */
type ArcPositioned = Point & Arc;
/**
 * Function which can interpolate along an {@link Arc} or {@link ArcPositioned}.
 */
type ArcInterpolate = {
  (amount: number, arc: Arc, allowOverflow: boolean, origin: Point): Point;
  (amount: number, arc: ArcPositioned, allowOverflow?: boolean): Point;
};
/**
 * Function to convert an arc to SVG segments
 */
type ArcToSvg = {
  /**
   * SVG path for arc description
   * @param origin Origin of arc
   * @param radius Radius
   * @param startRadian Start
   * @param endRadian End
   */
  (origin: Point, radius: number, startRadian: number, endRadian: number, opts?: ArcSvgOpts): readonly string[];
  /**
   * SVG path for non-positioned arc.
   * If `arc` does have a position, `origin` will override it.
   */
  (arc: Arc, origin: Point, opts?: ArcSvgOpts): readonly string[];
  /**
   * SVG path for positioned arc
   */
  (arc: ArcPositioned, opts?: ArcSvgOpts): readonly string[];
};
type ArcSvgOpts = {
  /**
   * "If the arc should be greater or less than 180 degrees"
   * ie. tries to maximise arc length
   */
  readonly largeArc?: boolean;
  /**
   * "If the arc should begin moving at positive angles"
   * ie. the kind of bend it makes to reach end point
   */
  readonly sweep?: boolean;
};
//#endregion
//#region ../packages/geometry/src/bezier/bezier-type.d.ts
type QuadraticBezier = {
  readonly a: Point;
  readonly b: Point;
  readonly quadratic: Point;
};
type QuadraticBezierPath = Path & QuadraticBezier;
type CubicBezier = {
  readonly a: Point;
  readonly b: Point;
  readonly cubic1: Point;
  readonly cubic2: Point;
};
type CubicBezierPath = Path & CubicBezier;
//#endregion
//#region ../packages/geometry/src/circle/area.d.ts
/**
 * Returns the area of `circle`.
 * @param circle
 * @returns
 */
declare const area: (circle: Circle) => number;
//#endregion
//#region ../packages/geometry/src/circle/bbox.d.ts
/**
 * Computes a bounding box that encloses circle
 * @param circle
 * @returns
 */
declare const bbox$2: (circle: CirclePositioned | Circle) => RectPositioned;
//#endregion
//#region ../packages/geometry/src/circle/center.d.ts
/**
 * Returns the center of a circle
 *
 * If the circle has an x,y, that is the center.
 * If not, `radius` is used as the x and y.
 *
 * ```js
 * const circle = { radius: 5, x: 10, y: 10};
 *
 * // Yields: { x: 5, y: 10 }
 * Circles.center(circle);
 * ```
 *
 * It's a trivial function, but can make for more understandable code
 * @param circle
 * @returns Center of circle
 */
declare const center: (circle: CirclePositioned | Circle) => Point;
declare namespace compound_path_d_exports {
  export { bbox$1 as bbox, computeDimensions, distanceToPoint, fromPaths, guardContinuous, interpolate$2 as interpolate, relativePosition$1 as relativePosition, setSegment, toString$1 as toString, toSvgString$1 as toSvgString };
}
/**
 * Returns a new compoundpath, replacing a path at a given index
 *
 * @param compoundPath Existing compoundpath
 * @param index Index to replace at
 * @param path Path to substitute in
 * @returns New compoundpath
 */
declare const setSegment: (compoundPath: CompoundPath, index: number, path: Path) => CompoundPath;
/**
 * Computes x,y point at a relative position along compoundpath
 *
 * @param paths Combined paths (assumes contiguous)
 * @param t Position (given as a percentage from 0 to 1)
 * @param useWidth If true, widths are used for calulcating. If false, lengths are used
 * @param dimensions Precalculated dimensions of paths, will be computed if omitted
 * @returns
 */
declare const interpolate$2: (paths: readonly Path[], t: number, useWidth?: boolean, dimensions?: Dimensions) => Point;
/**
 * Returns the shortest distance of `point` to any point on `paths`.
 * @param paths
 * @param point
 * @returns
 */
declare const distanceToPoint: (paths: readonly Path[], point: Point) => number;
/**
 * Relative position
 * @param paths Paths
 * @param point Point
 * @param intersectionThreshold Threshold
 * @param dimensions Pre-computed dimensions
 * @returns
 */
declare const relativePosition$1: (paths: readonly Path[], point: Point, intersectionThreshold: number, dimensions?: Dimensions) => number;
/**
 * Computes the widths and lengths of all paths, adding them up as well
 *
 * @param paths
 * @returns
 */
declare const computeDimensions: (paths: readonly Path[]) => Dimensions;
/**
 * Computes the bounding box that encloses entire compoundpath
 *
 * @param paths
 * @returns
 */
declare const bbox$1: (paths: readonly Path[]) => RectPositioned;
/**
 * Produce a human-friendly representation of paths
 *
 * @param paths
 * @returns
 */
declare const toString$1: (paths: readonly Path[]) => string;
/**
 * Throws an error if paths are not connected together, in order
 *
 * @param paths
 */
declare const guardContinuous: (paths: readonly Path[]) => void;
declare const toSvgString$1: (paths: readonly Path[]) => readonly string[];
/**
 * Create a compoundpath from an array of paths.
 * All this does is verify they are connected, and precomputes dimensions
 *
 * @param paths
 * @returns
 */
declare const fromPaths: (...paths: readonly Path[]) => CompoundPath;
//#endregion
//#region ../packages/geometry/src/path/start-end.d.ts
/**
 * Return the start point of a path
 *
 * @param path
 * @return Point
 */
declare const getStart: (path: Path) => Point;
/**
 * Return the end point of a path
 *
 * @param path
 * @return Point
 */
declare const getEnd: (path: Path) => Point;
declare namespace index_d_exports$2 {
  export { CompoundPath, Dimensions, Path, WithBeziers, bbox$1 as bbox, computeDimensions, distanceToPoint, fromPaths, getEnd, getStart, guardContinuous, interpolate$2 as interpolate, relativePosition$1 as relativePosition, setSegment, toString$1 as toString, toSvgString$1 as toSvgString };
}
//#endregion
//#region ../packages/geometry/src/circle/circular-path.d.ts
type CircularPath = Circle & Path & {
  readonly kind: `circular`;
};
//#endregion
//#region ../packages/geometry/src/circle/distance-center.d.ts
/**
 * Returns the distance between two circle centers.
 *
 * ```js
 * const circleA = { radius: 5, x: 5, y: 5 }
 * const circleB = { radius: 10, x: 20, y: 20 }
 * const distance = Circles.distanceCenter(circleA, circleB);
 * ```
 * Throws an error if either is lacking position.
 * @param a
 * @param b
 * @returns Distance
 */
declare const distanceCenter: (a: CirclePositioned, b: CirclePositioned | Point) => number;
//#endregion
//#region ../packages/geometry/src/circle/distance-from-exterior.d.ts
/**
 * Returns the distance between the exterior of two circles, or between the exterior of a circle and point.
 * If `b` overlaps or is enclosed by `a`, distance is 0.
 *
 * ```js
 * const circleA = { radius: 5, x: 5, y: 5 }
 * const circleB = { radius: 10, x: 20, y: 20 }
 * const distance = Circles.distanceCenter(circleA, circleB);
 * ```
 * @param a
 * @param b
 */
declare const distanceFromExterior: (a: CirclePositioned, b: CirclePositioned | Point) => number;
//#endregion
//#region ../packages/geometry/src/circle/exterior-points.d.ts
/**
 * Yields the points making up the exterior (ie. circumference) of the circle.
 * Uses [Midpoint Circle Algorithm](http://en.wikipedia.org/wiki/Midpoint_circle_algorithm)
 *
 * @example Draw outline of circle
 * ```js
 * const circle = { x: 100, y: 100, radius: 50 }
 * for (const pt of Circles.exteriorIntegerPoints(circle)) {
 *  // Fill 1x1 pixel
 *  ctx.fillRect(pt.x, pt.y, 1, 1);
 * }
 * ```
 * @param circle
 */
declare function exteriorIntegerPoints(circle: CirclePositioned): IterableIterator<Point>;
//#endregion
//#region ../packages/geometry/src/circle/guard.d.ts
/**
 * Throws if radius is out of range. If x,y is present, these will be validated too.
 * @param circle
 * @param parameterName
 */
declare const guard$1: (circle: CirclePositioned | Circle, parameterName?: string) => void;
/**
 * Throws if `circle` is not positioned or has dodgy fields
 * @param circle
 * @param parameterName
 * @returns
 */
declare const guardPositioned: (circle: CirclePositioned, parameterName?: string) => void;
/***
 * Returns true if radius, x or y are NaN
 */
declare const isNaN: (a: Circle | CirclePositioned) => boolean;
/**
 * Returns true if parameter has x,y. Does not verify if parameter is a circle or not
 *
 * ```js
 * const circleA = { radius: 5 };
 * Circles.isPositioned(circle); // false
 *
 * const circleB = { radius: 5, x: 10, y: 10 }
 * Circles.isPositioned(circle); // true
 * ```
 * @param p Circle
 * @returns
 */
declare const isPositioned: (p: Circle | Point) => p is Point;
declare const isCircle: (p: any) => p is Circle;
declare const isCirclePositioned: (p: any) => p is CirclePositioned;
//#endregion
//#region ../packages/geometry/src/circle/interior-points.d.ts
/**
 * Returns all integer points contained within `circle`.
 *
 * ```js
 * const c = { x:100, y:100, radius:100 };
 * for (const pt of Circles.interiorIntegerPoints(c)) {
 *   ctx.fillRect(pt.x, pt.y, 1, 1);
 * }
 * ```
 * @param circle
 */
declare function interiorIntegerPoints(circle: CirclePositioned): IterableIterator<Point>;
//#endregion
//#region ../packages/geometry/src/circle/interpolate.d.ts
/**
 * Computes relative position along circle perimeter
 *
 * ```js
 * const circle = { radius: 100, x: 100, y: 100 };
 *
 * // Get a point halfway around circle
 * // Yields { x, y }
 * const pt = Circles.interpolate(circle, 0.5);
 * ```
 * @param circle
 * @param t Position, 0-1
 * @returns
 */
declare const interpolate$1: (circle: CirclePositioned, t: number) => Point;
//#endregion
//#region ../packages/geometry/src/circle/intersecting.d.ts
/**
 * Returns true if `a` or `b` overlap, are equal, or `a` contains `b`.
 * A circle can be checked for intersections with another CirclePositioned, Point or RectPositioned.
 *
 * Use `intersections` to find the points of intersection.
 *
 * @param a Circle
 * @param b Circle or point to test
 * @returns True if circle overlap
 */
declare const isIntersecting: (a: CirclePositioned, b: CirclePositioned | Point | RectPositioned, c?: number) => boolean;
//#endregion
//#region ../packages/geometry/src/circle/intersections.d.ts
/**
 * Returns the point(s) of intersection between a circle and line.
 *
 * ```js
 * const circle = { radius: 5, x: 5, y: 5 };
 * const line = { a: { x: 0, y: 0 }, b: { x: 10, y: 10 } };
 * const pts = Circles.intersectionLine(circle, line);
 * ```
 * @param circle
 * @param line
 * @returns Point(s) of intersection, or empty array
 */
declare const intersectionLine: (circle: CirclePositioned, line: Line) => readonly Point[];
/**
 *
 * Returns the points of intersection betweeen `a` and `b`.
 *
 * Returns an empty array if circles are equal, one contains the other or if they don't touch at all.
 *
 * @param a Circle
 * @param b Circle
 * @returns Points of intersection, or an empty list if there are none
 */
declare const intersections: (a: CirclePositioned, b: CirclePositioned) => readonly Point[];
//#endregion
//#region ../packages/geometry/src/circle/is-contained-by.d.ts
/**
 * Returns true if `b` is completely contained by `a`
 *
 * ```js
 * // Compare two points
 * isContainedBy(circleA, circleB);
 *
 * // Compare a circle with a point
 * isContainedBy(circleA, {x: 10, y: 20});
 *
 * // Define radius as third parameter
 * isContainedBy(circleA, {x: 10, y: 20}, 20);
 * ```
 * @param a Circle
 * @param b Circle or point to compare to
 * @param c Radius to accompany parameter b if it's a point
 * @returns
 */
declare const isContainedBy: (a: CirclePositioned, b: CirclePositioned | Point, c?: number) => boolean;
//#endregion
//#region ../packages/geometry/src/circle/is-equal.d.ts
/**
 * Returns true if the two objects have the same values
 *
 * ```js
 * const circleA = { radius: 10, x: 5, y: 5 };
 * const circleB = { radius: 10, x: 5, y: 5 };
 *
 * circleA === circleB; // false, because identity of objects is different
 * Circles.isEqual(circleA, circleB); // true, because values are the same
 * ```
 *
 * Circles must both be positioned or not.
 * @param a
 * @param b
 * @returns
 */
declare const isEqual$1: (a: CirclePositioned | Circle, b: CirclePositioned | Circle) => boolean;
//#endregion
//#region ../packages/geometry/src/circle/multiply.d.ts
declare function multiplyScalar(a: CirclePositioned, value: number): CirclePositioned;
declare function multiplyScalar(a: Circle, value: number): Circle;
//#endregion
//#region ../packages/geometry/src/circle/perimeter.d.ts
/**
 * Returns the nearest point on `circle`'s perimeter closest to `point`.
 *
 * ```js
 * const pt = Circles.nearest(circle, {x:10,y:10});
 * ```
 *
 * If an array of circles is provided, it will be the closest point amongst all the circles
 * @param circle Circle or array of circles
 * @param point
 * @returns Point `{ x, y }`
 */
declare const nearest$1: (circle: CirclePositioned | CirclePositioned[], point: Point) => Point;
/**
 * Returns a point on a circle's perimeter at a specified angle in radians
 *
 * ```js
 * // Circle without position
 * const circleA = { radius: 5 };
 *
 * // Get point at angle Math.PI, passing in a origin coordinate
 * const ptA = Circles.pointOnPerimeter(circleA, Math.PI, {x: 10, y: 10 });
 *
 * // Point on circle with position
 * const circleB = { radius: 5, x: 10, y: 10};
 * const ptB = Circles.pointOnPerimeter(circleB, Math.PI);
 * ```
 * @param circle
 * @param angleRadian Angle in radians
 * @param origin or offset of calculated point. By default uses center of circle or 0,0 if undefined
 * @returns Point oo circle
 */
declare const pointOnPerimeter: (circle: Circle | CirclePositioned, angleRadian: number, origin?: Point) => Point;
/**
 * Returns circumference of `circle` (alias of {@link length})
 * @param circle
 * @returns
 */
declare const circumference: (circle: Circle) => number;
/**
 * Returns circumference of `circle` (alias of {@link circumference})
 * @param circle
 * @returns
 */
declare const length$1: (circle: Circle) => number;
//#endregion
//#region ../packages/geometry/src/circle/random.d.ts
/**
 * Returns a random point within a circle.
 *
 * By default creates a uniform distribution.
 *
 * ```js
 * const pt = randomPoint({radius: 5});
 * const pt = randomPoint({radius: 5, x: 10, y: 20});
 * ```'
 *
 * Generate points with a gaussian distribution
 * ```js
 * const pt = randomPoint(circle, {
 *  randomSource: Random.gaussian
 * })
 * ```
 * @param within Circle to generate a point within
 * @param opts Options
 * @returns
 */
declare const randomPoint: (within: Circle | CirclePositioned, opts?: Partial<CircleRandomPointOpts>) => Point;
//#endregion
//#region ../packages/geometry/src/circle/svg.d.ts
/**
 * Creates a SVG path segment.
 * @param a Circle or radius
 * @param sweep If true, path is 'outward'
 * @param origin Origin of path. Required if first parameter is just a radius or circle is non-positioned
 * @returns
 */
declare const toSvg: CircleToSvg;
//#endregion
//#region ../packages/geometry/src/circle/to-path.d.ts
/**
 * Returns a `CircularPath` representation of a circle
 *
 * @param {CirclePositioned} circle
 * @returns {CircularPath}
 */
declare const toPath$1: (circle: CirclePositioned) => CircularPath;
//#endregion
//#region ../packages/geometry/src/circle/to-positioned.d.ts
/**
 * Returns a positioned version of a circle.
 * If circle is already positioned, it is returned.
 * If no default position is supplied, 0,0 is used.
 * @param circle
 * @param defaultPositionOrX
 * @param y
 * @returns
 */
declare const toPositioned: (circle: Circle | CirclePositioned, defaultPositionOrX?: Point | number, y?: number) => CirclePositioned;
declare namespace index_d_exports$1 {
  export { Circle, CirclePositioned, CircleRandomPointOpts, CircleToSvg, CircularPath, area, bbox$2 as bbox, center, circumference, distanceCenter, distanceFromExterior, exteriorIntegerPoints, guard$1 as guard, guardPositioned, interiorIntegerPoints, interpolate$1 as interpolate, intersectionLine, intersections, isCircle, isCirclePositioned, isContainedBy, isEqual$1 as isEqual, isIntersecting, isNaN, isPositioned, length$1 as length, multiplyScalar, nearest$1 as nearest, pointOnPerimeter, randomPoint, toPath$1 as toPath, toPositioned, toSvg };
}
//#endregion
//#region ../packages/geometry/src/line/angles.d.ts
/**
 * Returns a parallel line to `line` at `distance`.
 *
 * ```js
 * const l = Lines.parallel(line, 10);
 * ```
 * @param line
 * @param distance
 */
declare const parallel: (line: Line, distance: number) => Line;
/**
 * Returns a point perpendicular to `line` at a specified `distance`. Use negative
 * distances for the other side of line.
 * ```
 * // Project a point 100 units away from line, at its midpoint.
 * const pt = Lines.perpendicularPoint(line, 100, 0.5);
 * ```
 * @param line Line
 * @param distance Distance from line. Use negatives to flip side
 * @param amount Relative place on line to project point from. 0 projects from A, 0.5 from the middle, 1 from B.
 */
declare const perpendicularPoint: (line: Line, distance: number, amount?: number) => Point;
//#endregion
//#region ../packages/geometry/src/line/bbox.d.ts
/**
 * Returns a rectangle that encompasses dimension of line
 *
 * ```js
 * const rect = Lines.bbox(line);
 * ```
 */
declare const bbox: (line: Line) => RectPositioned;
//#endregion
//#region ../packages/geometry/src/line/distance-single-line.d.ts
/**
 * Returns the distance of `point` to the nearest point on `line`
 *
 * ```js
 * const distance = Lines.distanceSingleLine(line, pt);
 * ```
 * @param line Line
 * @param point Target point
 * @returns
 */
declare const distanceSingleLine: (line: Line, point: Point) => number;
//#endregion
//#region ../packages/geometry/src/line/divide.d.ts
/**
 * Divides both start and end points by given x,y
 * ```js
 * // Line 1,1 -> 10,10
 * const l = Lines.fromNumbers(1,1,10,10);
 * const ll = Lines.divide(l, {x:2, y:4});
 * // Yields: 0.5,0.25 -> 5,2.5
 * ```
 *
 * Dividing by zero will give Infinity for that dimension.
 * @param line
 * @param point
 * @returns
 */
declare const divide: (line: Line, point: Point) => Line;
//#endregion
//#region ../packages/geometry/src/line/from-flat-array.d.ts
/**
 * Returns a line from four numbers [x1,y1,x2,y2].
 *
 * See {@link toFlatArray} to create an array from a line.
 *
 * ```js
 * const line = Lines.fromFlatArray(...[0, 0, 100, 100]);
 * // line is {a: { x:0, y:0 }, b: { x: 100, y: 100 } }
 * ```
 * @param array Array in the form [x1,y1,x2,y2]
 * @returns Line
 */
declare const fromFlatArray: (array: readonly number[]) => Line;
//#endregion
//#region ../packages/geometry/src/line/from-numbers.d.ts
/**
 * Returns a line from a basis of coordinates (x1, y1, x2, y2)
 *
 * ```js
 * // Line from 0,1 -> 10,15
 * Lines.fromNumbers(0, 1, 10, 15);
 * ```
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
declare const fromNumbers: (x1: number, y1: number, x2: number, y2: number) => Line;
//#endregion
//#region ../packages/geometry/src/line/from-points.d.ts
/**
 * Returns a line from two points
 *
 * ```js
 * // Line from 0,1 to 10,15
 * const line = Lines.fromPoints( { x:0, y:1 }, { x:10, y:15 });
 * // line is: { a: { x: 0, y: 1}, b: { x: 10, y: 15 } };
 * ```
 * @param a Start point
 * @param b End point
 * @returns
 */
declare const fromPoints: (a: Point, b: Point) => Line;
//#endregion
//#region ../packages/geometry/src/line/from-pivot.d.ts
/**
 * Creates a line from an origin point.
 * ```js
 * // Line of length 0.2 with middle at 0.5,0.5
 * fromPivot({ x:0.5, y:0.5 }, 0.2);
 * // Same line, but on an angle
 * fromPivot({ x:0.5, y:0.5 }, 0.2, degreesToRadian(45));
 *
 * // ...now with pivot point at 20%, rather than center
 * fromPivot({ x:0.5, y:0.5 }, 0.2, degreesToRadian(45), 0.2);
 * ```
 *
 * Examples:
 * * Angle of 0 (deg/rad) results in a horizontal line,
 * * Angle of 90deg in a vertical line.
 * * Angle of 45deg will be angled downwards.
 *
 * @param origin Origin to pivot around
 * @param length Total length of line
 * @param angleRadian Angle of line, in radians
 * @param balance Percentage of where origin ought to be on line. Default: 0.5, meaning the middle of line
 */
declare const fromPivot: (origin?: Point, length?: number, angleRadian?: number, balance?: number) => Line;
//#endregion
//#region ../packages/geometry/src/line/line-path-type.d.ts
type LinePath = Line & Path & {
  toFlatArray(): readonly number[];
  toPoints(): readonly Point[];
  rotate(amountRadian: number, origin: Point): LinePath;
  sum(point: Point): LinePath;
  divide(point: Point): LinePath;
  multiply(point: Point): LinePath;
  subtract(point: Point): LinePath;
  apply(fn: (point: Point) => Point): LinePath;
  midpoint(): Point;
  parallel(distance: number): Line;
  perpendicularPoint(distance: number, amount?: number): Point;
  slope(): number;
  withinRange(point: Point, maxRange: number): boolean;
  isEqual(otherLine: Line): boolean;
};
//#endregion
//#region ../packages/geometry/src/line/from-points-to-path.d.ts
/**
 * Returns a {@link LinePath} from two points
 *
 * ```js
 * const path = Lines.fromPointsToPath(ptA, ptB);
 * ```
 * @param a
 * @param b
 * @returns
 */
declare const fromPointsToPath: (a: Point, b: Point) => LinePath;
//#endregion
//#region ../packages/geometry/src/line/get-points-parameter.d.ts
/**
 * Returns [a,b] points from either a line parameter, or two points.
 * It additionally applies the guardPoint function to ensure validity.
 * This supports function overloading.
 * @ignore
 * @param aOrLine
 * @param b
 * @returns
 */
declare const getPointParameter: (aOrLine: Point | Line, b?: Point) => readonly [Point, Point];
//#endregion
//#region ../packages/geometry/src/line/guard.d.ts
/**
 * Returns true if `p` is a valid line, containing `a` and `b` Points.
 * ```js
 * Lines.isLine(l);
 * ```
 * @param p Value to check
 * @returns True if a valid line.
 */
declare const isLine: (p: any) => p is Line;
/**
 * Returns true if `p` is a {@link PolyLine}, ie. an array of {@link Line}s.
 * Validates all items in array.
 * @param p
 * @returns
 */
declare const isPolyLine: (p: any) => p is PolyLine;
/**
 * Throws an exception if:
 * * line is undefined
 * * a or b parameters are missing
 *
 * Does not validate points
 * @param line
 * @param name
 */
declare const guard: (line: Line, name?: string) => void;
//#endregion
//#region ../packages/geometry/src/line/interpolate.d.ts
/**
 * Calculates a point in-between `a` and `b`.
 *
 * If an interpolation amount below 0 or above 1 is given, _and_
 * `allowOverflow_ is true, a point will be returned that is extended
 * past `line`. This is useful for easing functions which might
 * briefly go past the limits.
 *
 * ```js
 * // Get {x,y} at 50% along line
 * Lines.interpolate(0.5, line);
 *
 * // Get {x,y} at 80% between point A and B
 * Lines.interpolate(0.8, ptA, ptB);
 * ```
 * @param amount Relative position, 0 being at a, 0.5 being halfway, 1 being at b
 * @param a Start
 * @param pointB End
 * @returns Point between a and b
 */
declare function interpolate(amount: number, a: Point, pointB: Point, allowOverflow?: boolean): Point;
/**
 * Calculates a point in-between `line`'s start and end points.
 *
 * ```js
 * // Get {x, y } at 50% along line
 * Lines.interpolate(0.5, line);
 * ```
 *
 * Any additional properties from `b`  are returned on the result as well.
 * @param amount 0..1
 * @param line Line
 * @param allowOverflow If true, interpolation amount is permitted to exceed 0..1, extending the line
 */
declare function interpolate(amount: number, line: Line, allowOverflow?: boolean): Point;
/**
 * Returns the point along a line from its start (A)
 * @param line Line
 * @param distance Distance
 * @param fromA If _true_ (default) returns from A. Use _false_ to calculate from end
 * @returns
 */
declare function pointAtDistance(line: Line, distance: number, fromA?: boolean): Point;
//#endregion
//#region ../packages/geometry/src/line/is-equal.d.ts
/**
 * Returns true if the lines have the same value. Note that only
 * the line start and end points are compared. So the lines might
 * be different in other properties, and `isEqual` will still return
 * true.
 *
 * ```js
 * const a = { a: {x:0,  y: 10 }, b: { x: 20, y: 20 }};
 * const b = { a: {x:0,  y: 10 }, b: { x: 20, y: 20 }};
 * a === b; // false, because they are different objects
 * Lines.isEqual(a, b); // true, because they have the same value
 * ```
 * @param {Line} a
 * @param {Line} b
 * @returns {boolean}
 */
declare const isEqual: (a: Line, b: Line) => boolean;
//#endregion
//#region ../packages/geometry/src/line/join-points-to-lines.d.ts
/**
 * Returns an array of lines that connects provided points. Note that line is not closed.
 *
 * Eg, if points a,b,c are provided, two lines are provided: a->b and b->c.
 *
 * ```js
 * const lines = Lines.joinPointsToLines(ptA, ptB, ptC);
 * // lines is an array of, well, lines
 * ```
 * @param points
 * @returns
 */
declare const joinPointsToLines: (...points: readonly Point[]) => PolyLine;
/**
 * Converts a {@link PolyLine} to an array of points.
 * Duplicate points are optionally excluded
 * @param line
 * @returns
 */
declare const polyLineToPoints: (line: PolyLine, skipDuplicates?: boolean) => Point[];
//#endregion
//#region ../packages/geometry/src/line/length.d.ts
/**
 * Returns the length between two points
 * ```js
 * Lines.length(ptA, ptB);
 * ```
 * @param a First point
 * @param b Second point
 * @returns
 */
declare function length(a: Point, b: Point, force2d?: boolean): number;
/**
 * Returns length of line. If a polyline (array of lines) is provided,
 * it is the sum total that is returned.
 *
 * ```js
 * Lines.length(a: {x:0, y:0}, b: {x: 100, y:100});
 * Lines.length(lines);
 * ```
 * @param line Line
 */
declare function length(line: Line | PolyLine, force2d?: boolean): number;
//#endregion
//#region ../packages/geometry/src/line/midpoint.d.ts
/**
 * Returns the mid-point of a line (same as `interpolate` with an amount of 0.5)
 *
 * ```js
 * Lines.midpoint(line); // Returns {x, y}
 * ```
 * @param aOrLine
 * @param pointB
 * @returns
 */
declare const midpoint: (aOrLine: Point | Line, pointB?: Point) => Point;
//#endregion
//#region ../packages/geometry/src/line/multiply.d.ts
/**
 * Multiplies start and end of line by point.x, point.y.
 *
 * ```js
 *
 * // Line 1,1 -> 10,10
 * const l = Lines.fromNumbers(1, 1, 10, 10);
 * const ll = Lines.multiply(l, {x:2, y:3});
 * // Yields: 2,20 -> 3,30
 * ```
 * @param line
 * @param point
 * @returns
 */
declare const multiply: (line: Line, point: Point) => Line;
//#endregion
//#region ../packages/geometry/src/line/nearest.d.ts
/**
 * Returns the nearest point on line(s) closest to `point`.
 *
 * ```js
 * const pt = Lines.nearest(line, {x:10,y:10});
 * ```
 *
 * If an array of lines is provided, it will be the closest point amongst all the lines
 * @param lineOrLines Line or array of lines
 * @param point Point to check
 * @returns Point `{ x, y }`
 */
declare const nearest: (lineOrLines: Line | Line[] | readonly Line[], point: Point) => Point;
//#endregion
//#region ../packages/geometry/src/line/relative-position.d.ts
/**
 * Returns the relative position of `pt` along `line`.
 * Warning: assumes `pt` is actually on `line`. Results may be bogus if not.
 * @param line
 * @param pt
 */
declare const relativePosition: (line: Line, pt: Point) => number;
//#endregion
//#region ../packages/geometry/src/line/reverse.d.ts
/**
 * Reverses a line.
 * ````js
 * const a = { x: 10, y: 20 };
 * const b = { x: 100, y: 200 };
 * const line = reverse({ a, b });
 * // { a: { x: 100, y: 200 }, b: { x: 10, y: 20 } }
 * ```
 * @param line
 * @returns
 */
declare function reverse(line: Line): Line;
//#endregion
//#region ../packages/geometry/src/line/rotate.d.ts
/**
 * Returns a line that is rotated by `angleRad`. By default it rotates
 * around its center, but an arbitrary `origin` point can be provided.
 * If `origin` is a number, it's presumed to be a 0..1 percentage of the line.
 *
 * ```js
 * // Rotates line by 0.1 radians around point 10,10
 * const r = Lines.rotate(line, 0.1, {x:10,y:10});
 *
 * // Rotate line by 5 degrees around its center
 * const r = Lines.rotate(line, degreeToRadian(5));
 *
 * // Rotate line by 5 degres around its end point
 * const r = Lines.rotate(line, degreeToRadian(5), line.b);
 *
 * // Rotate by 90 degrees at the 80% position
 * const r = Lines.rotated = rotate(line, Math.PI / 2, 0.8);
 * ```
 * @param line Line to rotate
 * @param amountRadian Angle in radians to rotate by
 * @param origin Point to rotate around. If undefined, middle of line will be used
 * @returns
 */
declare const rotate: (line: Line, amountRadian?: number, origin?: Point | number) => Line;
//#endregion
//#region ../packages/geometry/src/line/subtract.d.ts
/**
 * Subtracts both start and end points by given x,y
 * ```js
 * // Line 1,1 -> 10,10
 * const l = Lines.fromNumbers(1,1,10,10);
 * const ll = Lines.subtract(l, {x:2, y:4});
 * // Yields: -1,-3 -> 8,6
 * ```
 * @param line
 * @param point
 * @returns
 */
declare const subtract: (line: Line, point: Point) => Line;
//#endregion
//#region ../packages/geometry/src/line/sum.d.ts
/**
 * Adds both start and end points by given x,y
 * ```js
 *
 * // Line 1,1 -> 10,10
 * const l = Lines.fromNumbers(1,1,10,10);
 * const ll = Lines.sum(l, {x:2, y:4});
 * // Yields: 3,5 -> 12,14
 * ```
 * @param line
 * @param point
 * @returns
 */
declare const sum: (line: Line, point: Point) => Line;
//#endregion
//#region ../packages/geometry/src/line/to-path.d.ts
/**
 * Returns a path wrapper around a line instance. This is useful if there are a series
 * of operations you want to do with the same line because you don't have to pass it
 * in as an argument to each function.
 *
 * Note that the line is immutable, so a function like `sum` returns a new LinePath,
 * wrapping the result of `sum`.
 *
 * ```js
 * // Create a path
 * const l = Lines.toPath(fromNumbers(0,0,10,10));
 *
 * // Now we can use it...
 * l.length();
 *
 * // Mutate functions return a new path
 * const ll = l.sum({x:10,y:10});
 * ll.length();
 * ```
 * @param line
 * @returns
 */
declare const toPath: (line: Line) => LinePath;
//#endregion
//#region ../packages/geometry/src/line/to-string.d.ts
/**
 * Returns a string representation of two points
 * ```js
 * console.log(Lines.toString(a, b)));
 * ```
 * @param a
 * @param b
 * @returns
 */
declare function toString(a: Point, b: Point): string;
/**
 * Returns a string representation of a line
 * ```js
 * Lines.toString(line);
 * ```
 * @param line
 */
declare function toString(line: Line): string;
declare namespace index_d_exports {
  export { Empty, Line, LinePath, Placeholder, PolyLine, angleRadian, apply, asPoints, bbox, distance, distanceSingleLine, divide, extendFromA, fromFlatArray, fromNumbers, fromPivot, fromPoints, fromPointsToPath, getPointParameter, guard, interpolate, isEmpty, isEqual, isLine, isPlaceholder, isPolyLine, joinPointsToLines, length, midpoint, multiply, nearest, normaliseByRect, parallel, perpendicularPoint, pointAtDistance, pointAtX, pointsOf, polyLineToPoints, relativePosition, reverse, rotate, scaleFromMidpoint, slope, subtract, sum, toFlatArray, toPath, toString, toSvgString, withinRange };
}
declare const Empty: Line;
declare const Placeholder: Line;
/**
 * Returns true if `l` is the same as Line.Empty, that is
 * the `a` and `b` points are Points.Empty.
 * @param l
 * @returns
 */
declare const isEmpty: (l: Line) => boolean;
declare const isPlaceholder: (l: Line) => boolean;
/**
 * Applies `fn` to both start and end points.
 *
 * ```js
 * // Line 10,10 -> 20,20
 * const line = Lines.fromNumbers(10,10, 20,20);
 *
 * // Applies randomisation to both x and y.
 * const rand = (p) => ({
 *  x: p.x * Math.random(),
 *  y: p.y * Math.random()
 * });
 *
 * // Applies our randomisation function
 * const line2 = apply(line, rand);
 * ```
 * @param line Line
 * @param fn Function that takes a point and returns a point
 * @returns
 */
declare const apply: (line: Line, fn: (p: Point) => Point) => Readonly<Line>;
/**
 * Returns the angle in radians of a line, or two points
 * ```js
 * Lines.angleRadian(line);
 * Lines.angleRadian(ptA, ptB);
 * ```
 * @param lineOrPoint
 * @param b
 * @returns
 */
declare const angleRadian: (lineOrPoint: Line | Point, b?: Point) => number;
/**
 * Normalises start and end points by given width and height. Useful
 * for converting an absolutely-defined line to a relative one.
 *
 * ```js
 *
 * // Line 1,1 -> 10,10
 * const l = Lines.fromNumbers(1,1,10,10);
 * const ll = Lines.normaliseByRect(l, 10, 10);
 * // Yields: 0.1,0.1 -> 1,1
 * ```
 * @param line
 * @param width
 * @param height
 * @returns
 */
declare const normaliseByRect: (line: Line, width: number, height: number) => Line;
/**
 * Returns true if `point` is within `maxRange` of `line`.
 *
 * ```js
 * const line = Lines.fromNumbers(0,20,20,20);
 * Lines.withinRange(line, {x:0,y:21}, 1); // True
 * ```
 * @param line
 * @param point
 * @param maxRange
 * @returns True if point is within range
 */
declare const withinRange: (line: Line, point: Point, maxRange: number) => boolean;
/**
 * Calculates [slope](https://en.wikipedia.org/wiki/Slope) of line.
 *
 * @example
 * ```js
 * Lines.slope(line);
 * Lines.slope(ptA, ptB)
 * ```
 * @param lineOrPoint Line or point. If point is provided, second point must be given too
 * @param b Second point if needed
 * @returns
 */
declare const slope: (lineOrPoint: Line | Point, b?: Point) => number;
/**
 * Scales a line from its midpoint
 *
 * @example Shorten by 50%, anchored at the midpoint
 * ```js
 * const l = {
 *  a: {x:50, y:50}, b: {x: 100, y: 90}
 * }
 * const l2 = Lines.scaleFromMidpoint(l, 0.5);
 * ```
 * @param line
 * @param factor
 */
declare const scaleFromMidpoint: (line: Line, factor: number) => Line;
/**
 * Calculates `y` where `line` intersects `x`.
 * @param line Line to extend
 * @param x Intersection of x-axis.
 */
declare const pointAtX: (line: Line, x: number) => Point;
/**
 * Returns a line extended from its `a` point by a specified distance
 *
 * ```js
 * const line = {a: {x: 0, y:0}, b: {x:10, y:10} }
 * const extended = Lines.extendFromA(line, 2);
 * ```
 * @param line
 * @param distance
 * @return Newly extended line
 */
declare const extendFromA: (line: Line, distance: number) => Line;
/**
 * Yields every integer point along `line`.
 *
 * @example Basic usage
 * ```js
 * const l = { a: {x: 0, y: 0}, b: {x: 100, y: 100} };
 * for (const p of Lines.pointsOf(l)) {
 *  // Do something with point `p`...
 * }
 * ```
 *
 * Some precision is lost as start and end
 * point is also returned as an integer.
 *
 * Uses [Bresenham's line algorithm](https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm)
 * @param line Line
 */
declare function pointsOf(line: Line): Generator<Point>;
/**
 * Returns the distance of `point` to the
 * nearest point on `line`.
 *
 * ```js
 * const d = Lines.distance(line, {x:10,y:10});
 * ```
 *
 * If an array of lines is provided, the shortest distance is returned.
 * @param line Line (or array of lines)
 * @param point Point to check against
 * @returns Distance
 */
declare const distance: (line: Line | readonly Line[], point: Point) => number;
/**
 * Returns an array representation of line: [a.x, a.y, b.x, b.y]
 *
 * See {@link fromFlatArray} to create a line _from_ this representation.
 *
 * ```js
 * Lines.toFlatArray(line);
 * Lines.toFlatArray(pointA, pointB);
 * ```
 * @param {Point} a
 * @param {Point} b
 * @returns {number[]}
 */
declare const toFlatArray: (a: Point | Line, b: Point) => readonly number[];
/**
 * Yields all the points of all the lines.
 *
 * ```js
 * const lines = [ ..some array of lines.. ];
 * for (const pt of Lines.asPoints(lines)) {
 *  // Yields a and then b of each point sequentially
 * }
 * ```
 * @param lines
 */
declare function asPoints(lines: Iterable<Line>): Generator<Point, void, unknown>;
/**
 * Returns an SVG description of line
 * ```
 * Lines.toSvgString(ptA, ptB);
 * ```
 * @param a
 * @param b
 * @returns
 */
declare const toSvgString: (a: Point, b: Point) => readonly string[];
declare namespace ellipse_d_exports {
  export { Ellipse, EllipsePositioned, EllipticalPath, fromDegrees };
}
/**
 * An ellipse
 */
type Ellipse = {
  readonly radiusX: number;
  readonly radiusY: number;
  /**
   * Rotation, in radians
   */
  readonly rotation?: number;
  readonly startAngle?: number;
  readonly endAngle?: number;
};
/**
 * A {@link Ellipse} with position
 */
type EllipsePositioned = Point & Ellipse;
declare const fromDegrees: (radiusX: number, radiusY: number, rotationDeg?: number, startAngleDeg?: number, endAngleDeg?: number) => Ellipse;
type EllipticalPath = Ellipse & Path & {
  readonly kind: `elliptical`;
};
//#endregion
//#region ../packages/geometry/src/scaler.d.ts
/**
 * A scale function that takes an input value to scale.
 * Input can be in the form of `{ x, y }` or two number parameters.
 *
 * ```js
 * scale(10, 20);
 * scale({ x:10, y:20 });
 * ```
 *
 * Output range can be specified as a `{ width, height }` or two number parameters.
 * If omitted, the default range
 * is used.
 *
 * ```js
 * // Scale 10,20 with range w:800 h:600
 * scale(10, 20, 800, 600);
 * scale({x:10, y:20}, 800, 600);
 * scale({x:10, y:20}, {width: 800, height: 600});
 * ```
 */
type Scaler = (a: number | Point, b?: number | Rect, c?: number | Rect, d?: number) => Point;
/**
 * A scaler than can convert to a from an output range
 */
type ScalerCombined = {
  /**
   * Relative to absolute coordinates
   */
  readonly abs: Scaler;
  /**
   * Absolute to relative coordintes
   */
  readonly rel: Scaler;
  readonly width: number;
  readonly height: number;
  computeScale(): Point;
};
type ScaleBy = `both` | `min` | `max` | `width` | `height`;
/**
 * Returns a set of scaler functions, to convert to and from ranges.
 *
 * ```js
 * const scaler = Scaler.scaler(`both`, {width:window.innerWidth, height:window.innerHeight});
 * // Assuming screen of 800x400...
 * scaler.abs(400,200);          // Yields { x:0.5, y:0.5 }
 * scaler.abs({ x:400, y:200 }); // Yields { x:0.5, y:0.5 }
 *
 * scaler.rel(0.5, 0.5);         // Yields: { x:400, y:200 }
 * scaler.rel({ x:0.5, y:0.5 }); // Yields: { x:400, y:200 }
 * ```
 *
 * If no default range is provided, it must be given each time the scale function is used.
 *
 * ```js
 * const scaler = Scaler.scaler(`both`);
 *
 * scaler.abs(400, 200, 800, 400);
 * scaler.abs(400, 200, { width: 800, height: 400 });
 * scaler.abs({ x:400, y: 200}, { width: 800, height: 400 });
 * scaler.abs({ x:400, y: 200}, 800, 400);
 * // All are the same, yielding { x:0.5, y:0.5 }
 *
 * scaler.abs(400, 200); // Throws an exception because there is no scale
 * ```
 * @param scaleBy Dimension to scale by
 * @param defaultRect Default range
 * @returns
 */
declare const scaler: (scaleBy?: ScaleBy, defaultRect?: Rect) => ScalerCombined;
//#endregion
export { ArcInterpolate as _, EllipsePositioned as a, ArcToSvg as b, LinePath as c, compound_path_d_exports as d, CubicBezier as f, Arc as g, QuadraticBezierPath as h, scaler as i, index_d_exports$1 as l, QuadraticBezier as m, Scaler as n, ellipse_d_exports as o, CubicBezierPath as p, ScalerCombined as r, index_d_exports as s, ScaleBy as t, index_d_exports$2 as u, ArcPositioned as v, ArcSvgOpts as y };