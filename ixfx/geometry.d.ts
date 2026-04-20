import { o as TraversableTree } from "./types-BJU7cQJI.js";
import { i as Point3d, n as Placeholder3d, r as Point, t as Placeholder } from "./point-type-DLbh1Hzz.js";
import { A as index_d_exports$7, B as Triangle, C as index_d_exports$6, D as PointsTracker, E as PointTrackerResults, F as PolarToCartesian, G as Line, H as PointCalculableShape, I as PointRelation, J as CirclePositioned, K as PolyLine, L as PointRelationResult, M as PolarLine, N as PolarRay, O as UserPointerTracker, P as PolarRayWithOrigin, R as index_d_exports$9, S as GridWritable, T as PointTracker, U as ShapePositioned, V as ContainsResult, W as Sphere, X as CircleToSvg, Y as CircleRandomPointOpts, _ as GridNeighbourSelector, a as GridBoundsLogic, b as GridVisitorOpts, c as GridCell, d as GridCellSetter, f as GridCreateVisitor, g as GridNeighbourSelectionLogic, h as GridNeighbourMaybe, i as GridArray1d, j as Coord, k as UserPointersTracker, l as GridCellAccessor, m as GridNeighbour, n as index_d_exports$3, o as GridCardinalDirection, p as GridIdentifyNeighbours, q as Circle, r as Grid, s as GridCardinalDirectionOptional, t as index_d_exports$8, u as GridCellAndValue, v as GridNeighbours, w as PointTrack, x as GridVisual, y as GridReadable, z as BarycentricCoord } from "./index-3c5aUDaq.js";
import { a as RectPositioned, i as RectArray, n as Rect3d, o as RectPositionedArray, r as Rect3dPositioned, t as Rect } from "./rect-types-C3cN9Uxl.js";
import { a as RandomSource } from "./types-B4a9qJv9.js";
import { i as WithBeziers, n as Dimensions, r as Path, t as CompoundPath } from "./path-type-CgxfTQlW.js";
import { _ as ArcInterpolate, b as ArcToSvg, c as LinePath, d as compound_path_d_exports, f as CubicBezier, g as Arc, h as QuadraticBezierPath, i as scaler, l as index_d_exports$2, m as QuadraticBezier, n as Scaler, o as ellipse_d_exports, p as CubicBezierPath, r as ScalerCombined, s as index_d_exports$4, t as ScaleBy, u as index_d_exports$5, v as ArcPositioned, y as ArcSvgOpts } from "./scaler-DTKW-wSe.js";
import { C as radiansSum, D as turnToRadian, E as turnToDegree, S as radiansNormalise, T as toUnitVector, _ as radianToDegree, a as degreeArc, b as radiansBetweenCircular, c as degreeToTurn, d as gradianToDegree, f as gradianToRadian, g as radianRange, h as radianInvert, i as average, l as degreesSum, m as radianArc, n as angleConvert, o as degreeToGradian, p as isAngleType, r as angleParse, s as degreeToRadian, t as Angle, u as fromUnitVector, v as radianToGradian, w as toRadian, x as radiansFromAxisX, y as radianToTurn } from "./angles-F5jU9AX1.js";

//#region ../packages/geometry/src/arc/index.d.ts
declare namespace index_d_exports {
  export { Arc, ArcInterpolate, ArcPositioned, ArcSvgOpts, ArcToSvg, angularSize, bbox$1 as bbox, distanceCenter, fromCircle, fromCircleAmount, fromDegrees, getStartEnd, guard$1 as guard, interpolate, isArc, isEqual$1 as isEqual, isPositioned, length, point, toLine, toPath$1 as toPath, toSvg };
}
/**
 * Returns true if parameter is an arc
 * @param p Arc or number
 * @returns
 */
declare const isArc: (p: unknown) => p is Arc;
/**
 * Returns true if parameter has a positioned (x,y)
 * @param p Point, Arc or ArcPositiond
 * @returns
 */
declare const isPositioned: (p: Point | Arc | ArcPositioned) => p is Point;
/**
 * Returns an arc from degrees, rather than radians
 * @param radius Radius of arc
 * @param startDegrees Start angle in degrees
 * @param endDegrees End angle in degrees
 * @returns Arc
 */
declare function fromDegrees(radius: number, startDegrees: number, endDegrees: number, clockwise: boolean): Arc;
/**
 * Returns an arc from degrees, rather than radians
 * @param radius Radius of arc
 * @param startDegrees Start angle in degrees
 * @param endDegrees End angle in degrees
 * @param origin Optional center of arc
 * @param clockwise Whether arc moves in clockwise direction
 * @returns Arc
 */
declare function fromDegrees(radius: number, startDegrees: number, endDegrees: number, clockwise: boolean, origin: Point): ArcPositioned;
/**
 * Returns a {@link Line} linking the start and end points of an {@link ArcPositioned}.
 *
 * @param arc
 * @returns Line from start to end of arc
 */
declare const toLine: (arc: ArcPositioned) => Line;
/**
 * Return start and end points of `arc`.
 * `origin` will override arc's origin, if defined.
 *
 * See also:
 * * {@link point} - get point on arc by angle
 * * {@link interpolate} - get point on arc by interpolation percentage
 * @param arc
 * @param origin
 * @returns
 */
declare const getStartEnd: (arc: ArcPositioned | Arc, origin?: Point) => [start: Point, end: Point];
/**
 * Calculates a coordinate on an arc, based on an angle.
 * `origin` will override arc's origin, if defined.
 *
 * See also:
 * * {@link getStartEnd} - get start and end of arc
 * * {@link interpolate} - get point on arc by interpolation percentage
 * @param arc Arc
 * @param angleRadian Angle of desired coordinate
 * @param origin Origin of arc (0,0 used by default)
 * @returns Coordinate
 */
declare const point: (arc: Arc | ArcPositioned, angleRadian: number, origin?: Point) => Point;
/**
 * Throws an error if arc instance is invalid
 * @param arc
 */
declare const guard$1: (arc: Arc | ArcPositioned) => void;
/**
 * Compute relative position on arc.
 *
 * See also:
 * * {@link getStartEnd} - get start and end of arc
 * * {@link point} - get point on arc by angle
 * @param arc Arc
 * @param amount Relative position 0-1
 * @param origin If arc is not positioned, pass in an origin
 * @param allowOverflow If _true_ allows point to overflow arc dimensions (default: _false_)
 * @returns
 */
declare const interpolate: ArcInterpolate;
/**
 * Returns the angular size of arc.
 * Eg if arc runs from 45-315deg in clockwise direction, size will be 90deg.
 * @param arc
 */
declare const angularSize: (arc: Arc) => number;
/**
 * Creates a {@link Path} instance from the arc. This wraps up some functions for convienence.
 * @param arc
 * @returns Path
 */
declare const toPath$1: (arc: ArcPositioned) => Path;
/**
 * Returns an arc based on a circle using start and end angles.
 * If you don't have the end angle, but rather the size of the arc, use {@link fromCircleAmount}
 * @param circle Circle
 * @param startRadian Start radian
 * @param endRadian End radian
 * @param clockwise Whether arc goes in a clockwise direction (default: true)
 * @returns
 */
declare const fromCircle: (circle: CirclePositioned, startRadian: number, endRadian: number, clockwise?: boolean) => ArcPositioned;
/**
 * Returns an arc based on a circle, a start angle, and the size of the arc.
 * See {@link fromCircle} if you already have start and end angles.
 * @param circle Circle to base off
 * @param startRadian Starting angle
 * @param sizeRadian Size of arc
 * @param clockwise Whether arc moves in clockwise direction (default: true)
 * @returns
 */
declare const fromCircleAmount: (circle: CirclePositioned, startRadian: number, sizeRadian: number, clockwise?: boolean) => ArcPositioned;
/**
 * Calculates the length of the arc
 * @param arc
 * @returns Length
 */
declare const length: (arc: Arc) => number;
/**
 * Calculates a {@link Rect} bounding box for arc.
 * @param arc
 * @returns Rectangle encompassing arc.
 */
declare const bbox$1: (arc: ArcPositioned | Arc) => RectPositioned | Rect;
/**
 * Creates an SV path snippet for arc
 * @returns
 */
declare const toSvg: ArcToSvg;
/**
 * Calculates the distance between the centers of two arcs
 * @param a
 * @param b
 * @returns Distance
 */
declare const distanceCenter: (a: ArcPositioned, b: ArcPositioned) => number;
/**
 * Returns true if the two arcs have the same values
 *
 * ```js
 * const arcA = { radius: 5, endRadian: 0, startRadian: 1 };
 * const arcA = { radius: 5, endRadian: 0, startRadian: 1 };
 * arcA === arcB; // false, because object identities are different
 * Arcs.isEqual(arcA, arcB); // true, because values are identical
 * ```
 * @param a
 * @param b
 * @returns {boolean}
 */
declare const isEqual$1: (a: Arc | ArcPositioned, b: Arc | ArcPositioned) => boolean;
//#endregion
//#region ../packages/geometry/src/bezier/guard.d.ts
declare const isQuadraticBezier: (path: Path | QuadraticBezier | CubicBezier) => path is QuadraticBezier;
declare const isCubicBezier: (path: Path | CubicBezier | QuadraticBezier) => path is CubicBezier;
declare namespace index_d_exports$1 {
  export { CubicBezier, CubicBezierPath, QuadraticBezier, QuadraticBezierPath, cubic, interpolator, isCubicBezier, isQuadraticBezier, quadratic, quadraticSimple, quadraticToSvgString, toPath };
}
/**
 * Returns a new quadratic bezier with specified bend amount
 *
 * @param {QuadraticBezier} b Curve
 * @param {number} [bend=0] Bend amount, from -1 to 1
 * @returns {QuadraticBezier}
 */
/**
 * Creates a simple quadratic bezier with a specified amount of 'bend'.
 * Bend of -1 will pull curve down, 1 will pull curve up. 0 is no curve.
 *
 * Use {@link interpolator} to calculate a point along the curve.
 * @param {Point} start Start of curve
 * @param {Point} end End of curve
 * @param {number} [bend=0] Bend amount, -1 to 1
 * @returns {QuadraticBezier}
 */
declare const quadraticSimple: (start: Point, end: Point, bend?: number) => QuadraticBezier;
/**
 * Returns a relative point on a simple quadratic
 * @param start Start
 * @param end  End
 * @param bend Bend (-1 to 1)
 * @param amt Amount
 * @returns Point
 */
/**
 * Interpolate cubic or quadratic bezier
 * ```js
 * const i = interpolator(myBezier);
 *
 * // Get point at 50%
 * i(0.5); // { x, y }
 * ```
 * @param q
 * @returns
 */
declare const interpolator: (q: QuadraticBezier | CubicBezier) => (amount: number) => Point;
declare const quadraticToSvgString: (start: Point, end: Point, handle: Point) => ReadonlyArray<string>;
declare const toPath: (cubicOrQuadratic: CubicBezier | QuadraticBezier) => CubicBezierPath | QuadraticBezierPath;
declare const cubic: (start: Point, end: Point, cubic1: Point, cubic2: Point) => CubicBezier;
declare const quadratic: (start: Point, end: Point, handle: Point) => QuadraticBezier;
declare namespace waypoint_d_exports {
  export { Waypoint, WaypointOpts, WaypointResult, Waypoints, fromPoints$1 as fromPoints, init };
}
type Waypoint = CirclePositioned;
type WaypointOpts = {
  readonly maxDistanceFromLine: number;
  readonly enforceOrder: boolean;
};
/**
 * Create from set of points, connected in order starting at array position 0.
 * @param waypoints
 * @param opts
 * @returns
 */
declare const fromPoints$1: (waypoints: readonly Point[], opts?: Partial<WaypointOpts>) => Waypoints;
/**
 * Result
 */
type WaypointResult = {
  /**
   * Path being compared against
   */
  path: Path;
  /**
   * Index of this path in original `paths` array
   */
  index: number;
  /**
   * Nearest point on path. See also {@link distance}
   */
  nearest: Point;
  /**
   * Closest distance to path. See also {@link nearest}
   */
  distance: number;
  /**
   * Rank of this result, 0 being highest.
   */
  rank: number;
  /**
   * Relative position on this path segment
   * 0 being start, 0.5 middle and so on.
   */
  positionRelative: number;
};
/**
 * Given point `pt`, returns a list of {@link WaypointResult}, comparing
 * this point to a set of paths.
 * ```js
 * // Init once with a set of paths
 * const w = init(paths);
 * // Now call with a point to get results
 * const results = w({ x: 10, y: 20 });
 * ```
 */
type Waypoints = (pt: Point) => WaypointResult[];
/**
 * Initialise
 *
 * Options:
 * * maxDistanceFromLine: Distances greater than this are not matched. Default 0.1
 * @param paths
 * @param opts
 * @returns
 */
declare const init: (paths: readonly Path[], opts?: Partial<WaypointOpts>) => Waypoints;
declare namespace circle_packing_d_exports {
  export { RandomOpts, random };
}
type RandomOpts = {
  readonly attempts?: number;
  readonly randomSource?: RandomSource;
};
/**
 * Naive randomised circle packing.
 * [Algorithm by Taylor Hobbs](https://tylerxhobbs.com/essays/2016/a-randomized-approach-to-cicle-packing)
 */
declare const random: (circles: readonly Circle[], container: ShapePositioned, opts?: RandomOpts) => CirclePositioned[];
//#endregion
//#region ../packages/geometry/src/layout/ring.d.ts
type CircleRingsOpts = {
  readonly rings?: number;
  /**
   * Rotation offset, in radians
   */
  readonly rotation?: number;
};
/**
 * Generates points spaced out on the given number of rings.
 *
 * Get points as array
 * ```js
 * const circle = { radius: 5, x: 100, y: 100 };
 * const opts = { rings: 5 };
 * const points = [...circleRings(circle, rings)];
 * ```
 *
 * Or iterate over them
 * ```js
 * for (const point of circleRings(circle, opts)) {
 * }
 * ```
 * Source: http://www.holoborodko.com/pavel/2015/07/23/generating-equidistant-points-on-unit-disk/#more-3453
 * @param circle
 */
declare function circleRings(circle?: Circle | CirclePositioned, opts?: CircleRingsOpts): IterableIterator<Point>;
declare namespace layout_d_exports {
  export { circle_packing_d_exports as CirclePacking, CircleRingsOpts, circleRings };
}
declare namespace curve_simplification_d_exports {
  export { rdpPerpendicularDistance, rdpShortestDistance };
}
/**
 * Simplifies a curve by dropping points based on shortest distance.
 *
 * Values of `epsilon` approaching zero keep more of the original points.
 * Making `epsilon` larger will filter out more points, making the curve more lossy and jagged.
 *
 * ```js
 * // Source set of points that define the curve
 * const pts = [ {x:100,y:200}, {x:10, y:20}, ... ];
 *
 * const simplified = rdpShortestDistance(pts, 3); // Yields an array of points
 * ```
 * It is an implementation of the [Ramer Douglas Peucker algorithm](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm)
 * by Marius Karthaus. Try the online playground: https://karthaus.nl/rdp/
 *
 * @param points
 * @param epsilon
 * @returns
 */
declare const rdpShortestDistance: (points: Array<Point>, epsilon?: number) => Array<Point>;
/**
 * Simplifies a curve by dropping points based on perpendicular distance
 *
 * Values of `epsilon` approaching zero keep more of the original points.
 * Making `epsilon` larger will filter out more points, making the curve more lossy and jagged.
 *
 * ```js
 * // Source set of points that define the curve
 * const pts = [ {x:100,y:200}, {x:10, y:20}, ... ];
 *
 * const simplified = rdpShortestDistance(pts, 3); // Yields an array of points
 * ```
 * It is an implementation of the [Ramer Douglas Peucker algorithm](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm)
 * by Marius Karthaus. Try the online playground: https://karthaus.nl/rdp/
 *
 * @param points
 * @param epsilon
 * @returns
 */
declare const rdpPerpendicularDistance: (points: Array<Point>, epsilon?: number) => Array<Point>;
declare namespace quad_tree_d_exports {
  export { Direction, QuadTreeItem, QuadTreeNode, QuadTreeOpts, quadTree };
}
/**
 * Options for quad tree
 */
type QuadTreeOpts = {
  /**
   * Maximum items per node
   */
  readonly maxItems: number;
  /**
   * Maximum level of sub-division
   */
  readonly maxLevels: number;
};
/**
 * Direction
 */
declare enum Direction {
  Nw = 0,
  Ne = 1,
  Sw = 2,
  Se = 3
}
/**
 * A Point or ShapePositioned
 */
type QuadTreeItem = Point | ShapePositioned;
/**
 * Creates a QuadTreeNode
 * @param bounds Bounds of region
 * @param initialData Initial items to place in quad tree
 * @param opts Options
 * @returns New quad tree
 */
declare const quadTree: (bounds: RectPositioned, initialData?: readonly QuadTreeItem[], opts?: Partial<QuadTreeOpts>) => QuadTreeNode;
/**
 * QuadTreeNode. The values of the node is an array of {@link QuadTreeItem}.
 *
 * To create, you probably want the {@link quadTree} function.
 *
 */
declare class QuadTreeNode implements TraversableTree<QuadTreeItem[]> {
  #private;
  readonly boundary: RectPositioned;
  readonly level: number;
  readonly opts: QuadTreeOpts;
  /**
   * Constructor
   * @param boundary
   * @param level
   * @param opts
   */
  constructor(parent: QuadTreeNode | undefined, boundary: RectPositioned, level: number, opts: QuadTreeOpts);
  getLengthChildren(): number;
  parents(): IterableIterator<QuadTreeNode>;
  getParent(): QuadTreeNode | undefined;
  /**
   * Iterates over immediate children
   */
  children(): IterableIterator<QuadTreeNode>;
  /**
   * Array of QuadTreeItem
   * @returns
   */
  getValue(): QuadTreeItem[];
  getIdentity(): this;
  /**
   * Get a descendant node in a given direction
   * @param d
   * @returns
   */
  direction(d: Direction): QuadTreeNode | undefined;
  /**
   * Add an item to the quadtree
   * @param p
   * @returns False if item is outside of boundary, True if item was added
   */
  add(p: QuadTreeItem): boolean;
  /**
   * Returns true if point is inside node's boundary
   * @param p
   * @returns
   */
  couldHold(p: Point): boolean;
}
declare namespace vector_d_exports {
  export { Vector, clampMagnitude, divide, dotProduct, fromLineCartesian, fromLinePolar, fromPointPolar, fromRadians, multiply, normalise, quadrantOffsetAngle, subtract, sum, toCartesian, toPolar, toRadians, toString };
}
type Vector = Point | Coord;
declare const fromRadians: (radians: number) => Point;
declare const toRadians: (point: Point) => number;
/**
 * Create a vector from a point
 *
 * If `unipolar` normalisation is used, direction will be fixed to 0..2π
 * if `bipolar` normalisation is used, direction will be fixed to -π...π
 * @param pt Point
 * @param angleNormalisation Technique to normalise angle
 * @param origin Origin to calculate vector from or 0,0 if left empty
 * @returns
 */
declare const fromPointPolar: (pt: Point, angleNormalisation?: `` | `unipolar` | `bipolar`, origin?: Point) => Coord;
/**
 * Returns a Cartesian-coordinate vector from a line a -> b
 * @param line
 * @returns
 */
declare const fromLineCartesian: (line: Line) => Point;
/**
 * Returns a polar-coordinate vector from a line a -> b
 * @param line
 * @returns
 */
declare const fromLinePolar: (line: Line) => Coord;
/**
 * Returns the normalised vector (aka unit vector). This is where
 * direction is kept, but magnitude set to 1. This then just
 * suggests direction.
 * @param v
 * @returns
 */
declare const normalise: (v: Vector) => Vector;
declare const quadrantOffsetAngle: (p: Point) => number;
/**
 * Converts a vector to a polar coordinate. If the provided
 * value is already Polar, it is returned.
 * @param v
 * @param origin
 * @returns Polar vector
 */
declare const toPolar: (v: Vector, origin?: Point) => Coord;
/**
 * Converts a Vector to a Cartesian coordinate. If the provided
 * value is already Cartesian, it is returned.
 * @param v
 * @returns Cartestian vector
 */
declare const toCartesian: (v: Vector) => Point;
/**
 * Return a human-friendly representation of vector
 * @param v
 * @param digits
 * @returns
 */
declare const toString: (v: Vector, digits?: number) => string;
/**
 * Calculate dot product of a vector
 * @param a
 * @param b
 * @returns
 */
declare const dotProduct: (a: Vector, b: Vector) => number;
/**
 * Clamps the magnitude of a vector
 * @param v Vector to clamp
 * @param max Maximum magnitude
 * @param min Minium magnitude
 * @returns
 */
declare const clampMagnitude: (v: Vector, max?: number, min?: number) => Point | Readonly<{
  distance: number;
  angleRadian: number;
}>;
/**
 * Returns `a + b`.
 *
 * Vector is returned in the same type as `a`.
 * @param a
 * @param b
 * @returns
 */
declare const sum: (a: Vector, b: Vector) => Point | Readonly<{
  distance: number;
  angleRadian: number;
}>;
/**
 * Returns `a - b`.
 *
 * Vector is returned in the same type as `a`
 * @param a
 * @param b
 */
declare const subtract: (a: Vector, b: Vector) => Point | Readonly<{
  distance: number;
  angleRadian: number;
}>;
/**
 * Returns `a * b`.
 *
 * Vector is returned in the same type `a`.
 * @param a
 * @param b
 */
declare const multiply: (a: Vector, b: Vector) => Point | Readonly<{
  distance: number;
  angleRadian: number;
}>;
/**
 * Returns `a / b`.
 *
 * Vector is returned in the same type `a`.
 * @param a
 * @param b
 */
declare const divide: (a: Vector, b: Vector) => Point | Readonly<{
  distance: number;
  angleRadian: number;
}>;
declare namespace surface_points_d_exports {
  export { RingOptionsCount, RingOptionsDegreeInterval, RingOptionsRadianInterval, VogelSpiralOpts, circleVogelSpiral, ring, sphereFibonacci };
}
/**
 * Options for a Vogel spiral
 */
type VogelSpiralOpts = {
  /**
   * Upper limit of points to produce.
   * By default, 5000.
   */
  readonly maxPoints?: number;
  /**
   * Density value (0..1) which determines spacing of points.
   * This is useful because it scales with whatever circle radius is given
   * Use this parameter OR the `spacing` parameter.
   */
  readonly density?: number;
  /**
   * Spacing between points.
   * Use this option OR the density value.
   */
  readonly spacing?: number;
  /**
   * Rotation offset to apply, in radians. 0 by default
   */
  readonly rotation?: number;
};
/**
 * Generates points on a Vogel spiral - a sunflower-like arrangement of points.
 *
 * @example With no arguments, assumes a unit circle
 * ```js
 * for (const pt of circleVogelSpiral()) {
 *  // Generate points on a unit circle, with 95% density
 * }
 * ```
 *
 *
 * @example Specifying a circle and options
 * ```js
 * const circle = { radius: 100, x: 100, y: 100 };
 * const opts = {
 *  maxPoints: 50,
 *  density: 0.99
 * };
 * for (const pt of circleVogelSpiral(circle, opts)) {
 *  // Do something with point...
 * }
 * ```
 *
 * @example Array format
 * ```js
 * const ptsArray = [...circleVogelSpiral(circle, opts)];
 * ```
 * @param circle
 * @param opts
 */
declare function circleVogelSpiral(circle?: Circle, opts?: VogelSpiralOpts): IterableIterator<Point>;
/**
 * Fibonacci sphere algorithm. Generates points
 * distributed on a sphere.
 *
 * @example Generate points of a unit sphere
 * ```js
 * for (const pt of sphereFibonacci(100)) {
 *  // pt.x, pt.y, pt.z
 * }
 * ```
 *
 * @example Generate points into an array
 * ```js
 * const sphere = { radius: 10, x: 10, y: 200 }
 * const pts = [...sphereFibonacci(100, 0, sphere)];
 * ```
 *
 * Source: https://codepen.io/elchininet/pen/vXeRyL
 *
 * @param samples
 * @returns
 */
declare function sphereFibonacci(samples?: number, rotationRadians?: number, sphere?: Sphere): IterableIterator<Point3d>;
type RingOptionsCount = {
  count: number;
};
type RingOptionsRadianInterval = {
  radians: number;
};
type RingOptionsDegreeInterval = {
  degrees: number;
};
/**
 * Yields points distributed around a ring.
 * ```js
 * // 5 points evenly distributed
 * for (const point of ring(circle, { count: 5})) {
 *   // { x, y }
 * }
 *
 * // Get a list of points, spaced by 10 degrees
 * const points = [...ring(circle, { degrees: 0.1 })]
 * ```
 * @param circle
 * @param opts
 */
declare function ring(circle: CirclePositioned, opts: {
  offset?: number;
} & (RingOptionsCount | RingOptionsRadianInterval | RingOptionsDegreeInterval)): Generator<Point, void, unknown>;
//#endregion
//#region ../packages/geometry/src/triangle/angles.d.ts
/**
 * Return the three interior angles of the triangle, in radians.
 * @param t
 * @returns
 */
declare const angles: (t: Triangle) => ReadonlyArray<number>;
/**
 * Returns the three interior angles of the triangle, in degrees
 * @param t
 * @returns
 */
declare const anglesDegrees: (t: Triangle) => ReadonlyArray<number>;
//#endregion
//#region ../packages/geometry/src/triangle/area.d.ts
/**
 * Calculates the area of a triangle
 * @param t
 * @returns
 */
declare const area$3: (t: Triangle) => number;
//#endregion
//#region ../packages/geometry/src/triangle/barycentric.d.ts
/**
 * Returns the [Barycentric coordinate](https://en.wikipedia.org/wiki/Barycentric_coordinate_system) of a point within a triangle
 *
 * @param t
 * @param a
 * @param b
 * @returns
 */
declare const barycentricCoord: (t: Triangle, a: Point | number, b?: number) => BarycentricCoord;
/**
 * Convert Barycentric coordinate to Cartesian
 * @param t
 * @param bc
 * @returns
 */
declare const barycentricToCartestian: (t: Triangle, bc: BarycentricCoord) => Point;
//#endregion
//#region ../packages/geometry/src/triangle/bbox.d.ts
/**
 * Returns the bounding box that encloses the triangle.
 * @param t
 * @param inflation If specified, box will be inflated by this much. Default: 0.
 * @returns
 */
declare const bbox: (t: Triangle, inflation?: number) => RectPositioned;
//#endregion
//#region ../packages/geometry/src/triangle/centroid.d.ts
/**
 * Returns simple centroid of triangle
 * @param t
 * @returns
 */
declare const centroid: (t: Triangle) => Point;
//#endregion
//#region ../packages/geometry/src/triangle/corners.d.ts
/**
 * Returns the corners (vertices) of the triangle as an array of points
 * @param t
 * @returns Array of length three
 */
declare const corners: (t: Triangle) => ReadonlyArray<Point>;
//#endregion
//#region ../packages/geometry/src/triangle/create.d.ts
/**
 * A triangle consisting of three empty points (Points.Empty)
 */
declare const Empty: Triangle;
/**
 * A triangle consisting of three placeholder points (Points.Placeholder)
 */
declare const Placeholder$1: Triangle;
/**
 * Returns a triangle anchored at `origin` with a given `length` and `angleRadian`.
 * The origin will be point `b` of the triangle, and the angle will be the angle for b.
 * @param origin Origin
 * @param length Length
 * @param angleRadian Angle
 * @returns
 */
declare const equilateralFromVertex: (origin?: Point, length?: number, angleRadian?: number) => Triangle;
//#endregion
//#region ../packages/geometry/src/triangle/edges.d.ts
/**
 * Returns the edges (ie sides) of the triangle as an array of lines
 * @param t
 * @returns Array of length three
 */
declare const edges: (t: Triangle) => PolyLine;
//#endregion
//#region ../packages/geometry/src/triangle/from.d.ts
/**
 * Returns an equilateral triangle centered at the origin.
 *
 * ```js
 * // Create a triangle at 100,100 with radius of 60
 * const tri = fromRadius({x:100,y:100}, 60);
 *
 * // Triangle with point A upwards, B to the right, C to the left
 * constr tri2 = fromRadius({x:100,y:100}, 60, {initialAngleRadian: -Math.PI / 2});
 * ```
 *
 *
 * @param origin Origin
 * @param radius Radius of triangle
 * @param opts Options
 */
declare const fromRadius: (origin: Point, radius: number, opts?: {
  readonly initialAngleRadian?: number;
}) => Triangle;
/**
 * Returns a triangle from a set of coordinates in a flat array form:
 * [xA, yA, xB, yB, xC, yC]
 * @param coords
 * @returns
 */
declare const fromFlatArray: (coords: readonly number[]) => Triangle;
/**
 * Returns a triangle from an array of three points
 * @param points
 * @returns
 */
declare const fromPoints: (points: readonly Point[]) => Triangle;
//#endregion
//#region ../packages/geometry/src/triangle/inner-circle.d.ts
/**
 * Returns the largest circle enclosed by triangle `t`.
 * @param t
 */
declare const innerCircle: (t: Triangle) => CirclePositioned;
//#endregion
//#region ../packages/geometry/src/triangle/intersects.d.ts
/**
 * Returns true if point is within or on the boundary of triangle
 * @param t
 * @param a
 * @param b
 */
declare const intersectsPoint: (t: Triangle, a: Point | number, b?: number) => boolean;
//#endregion
//#region ../packages/geometry/src/triangle/kinds.d.ts
/**
 * Returns true if it is an equilateral triangle
 * @param t
 * @returns
 */
declare const isEquilateral: (t: Triangle) => boolean;
/**
 * Returns true if it is an isosceles triangle
 * @param t
 * @returns
 */
declare const isIsosceles: (t: Triangle) => boolean;
/**
 * Returns true if at least one interior angle is 90 degrees
 * @param t
 * @returns
 */
declare const isRightAngle: (t: Triangle) => boolean;
/**
 * Returns true if triangle is oblique: No interior angle is 90 degrees
 * @param t
 * @returns
 */
declare const isOblique: (t: Triangle) => boolean;
/**
 * Returns true if triangle is actue: all interior angles less than 90 degrees
 * @param t
 * @returns
 */
declare const isAcute: (t: Triangle) => boolean;
/**
 * Returns true if triangle is obtuse: at least one interior angle is greater than 90 degrees
 * @param t
 * @returns
 */
declare const isObtuse: (t: Triangle) => boolean;
//#endregion
//#region ../packages/geometry/src/triangle/lengths.d.ts
/**
 * Returns the lengths of the triangle sides
 * @param t
 * @returns Array of length three
 */
declare const lengths: (t: Triangle) => ReadonlyArray<number>;
//#endregion
//#region ../packages/geometry/src/triangle/math.d.ts
/**
 * Applies `fn` to each of a triangle's corner points, returning the result.
 *
 * @example Add some random to the x of each corner
 * ```
 * const t = apply(tri, p => {
 *  const r = 10;
 *  return {
 *    x: p.x + (Math.random()*r*2) - r,
 *    y: p.y
 *  }
 * });
 * ```
 * @param t
 * @param fn
 * @returns
 */
declare const apply: (t: Triangle, fn: (p: Point, label?: string) => Point) => Triangle;
//#endregion
//#region ../packages/geometry/src/triangle/outer-circle.d.ts
/**
 * Returns the largest circle touching the corners of triangle `t`.
 * @param t
 * @returns
 */
declare const outerCircle: (t: Triangle) => CirclePositioned;
//#endregion
//#region ../packages/geometry/src/triangle/perimeter.d.ts
/**
 * Calculates perimeter of a triangle
 * @param t
 * @returns
 */
declare const perimeter$3: (t: Triangle) => number;
//#endregion
//#region ../packages/geometry/src/triangle/rotate.d.ts
/**
 * Returns a triangle that is rotated by `angleRad`. By default it rotates
 * around its center but an arbitrary `origin` point can be provided.
 *
 * ```js
 * let triangle = Triangles.fromPoints([a, b, c]);
 *
 * // Rotate triangle by 5 degrees
 * triangle = Triangles.rotate(triangle, degreeToRadian(5));
 *
 * // Rotate by 90 degrees
 * triangle = Triangles.rotate(triangle, Math.PI / 2);
 * ```
 * @param triangle Triangle to rotate
 * @param amountRadian Angle in radians to rotate by
 * @param origin Point to rotate around. If undefined, middle of triangle will be used
 * @returns A new triangle
 */
declare const rotate: (triangle: Triangle, amountRadian?: number, origin?: Point) => Triangle;
/**
 * Rotates the vertices of the triangle around one point (by default, `b`), returning
 * as a new object.
 *
 * ```js
 * let triangle = Triangles.fromPoints([a, b, c]);
 * triangle = Triangles.rotateByVertex(triangle, Math.Pi, `a`);
 * ```
 * @param triangle Triangle
 * @param amountRadian Angle to rotate by
 * @param vertex Name of vertex: a, b or c.
 * @returns A new triangle
 */
declare const rotateByVertex: (triangle: Triangle, amountRadian: number, vertex?: `a` | `b` | `c`) => Triangle;
//#endregion
//#region ../packages/geometry/src/triangle/to.d.ts
/**
 * Returns the coordinates of triangle in a flat array form:
 * [xA, yA, xB, yB, xC, yC]
 * @param t
 * @returns
 */
declare const toFlatArray: (t: Triangle) => readonly number[];
//#endregion
//#region ../packages/geometry/src/triangle/guard.d.ts
/**
 * Throws an exception if the triangle is invalid
 * @param t
 * @param name
 */
declare const guard: (t: Triangle, name?: string) => void;
/**
 * Returns true if the parameter appears to be a valid triangle
 * @param p
 * @returns
 */
declare const isTriangle: (p: unknown) => p is Triangle;
/**
 * Returns true if triangle is empty
 * @param t
 * @returns
 */
declare const isEmpty: (t: Triangle) => boolean;
/**
 * Returns true if triangle is a placeholder
 * @param t
 * @returns
 */
declare const isPlaceholder: (t: Triangle) => boolean;
/**
 * Returns true if the two parameters have equal values
 * @param a
 * @param b
 * @returns
 */
declare const isEqual: (a: Triangle, b: Triangle) => boolean;
declare namespace equilateral_d_exports {
  export { TriangleEquilateral, area$2 as area, centerFromA, centerFromB, centerFromC, circumcircle$2 as circumcircle, fromCenter$1 as fromCenter, height$2 as height, incircle$2 as incircle, perimeter$2 as perimeter };
}
type TriangleEquilateral = {
  readonly length: number;
} | number;
/**
 * Returns a positioned `Triangle` from an equilateral triangle definition.
 * By default the rotation is such that point `a` and `c` are lying on the horizontal,
 * and `b` is the upward-facing tip.
 *
 * Default is a triangle pointing upwards with b at the top, c to the left and b to right on the baseline.
 *
 * Example rotation values in radians:
 * * ▶️ 0: a and c on vertical, b at the tip
 * * ◀️ Math.PI: `c`and `a` are on vertical, with `b` at the tip.
 * * 🔽 Math.PI/2: `c` and `a` are on horizontal, `c` to the left. `b` at the bottom.
 * * 🔼 Math.PI*1.5: `c` and `a` are on horizontal, `c` to the right. `b` at the top. (default)
 * @param t
 * @param origin
 * @param rotationRad
 * @returns
 */
declare const fromCenter$1: (t: TriangleEquilateral, origin?: Point, rotationRad?: number) => Triangle;
/**
 * Calculate center from the given point A
 * @param t
 * @param ptA
 * @returns
 */
declare const centerFromA: (t: TriangleEquilateral, ptA?: Point) => Point;
/**
 * Calculate center from the given point B
 * @param t
 * @param ptB
 * @returns
 */
declare const centerFromB: (t: TriangleEquilateral, ptB?: Point) => Point;
/**
 * Calculate center from the given point C
 * @param t
 * @param ptC
 * @returns
 */
declare const centerFromC: (t: TriangleEquilateral, ptC?: Point) => Point;
/**
 * Returns the height (or rise) of an equilateral triangle.
 * Ie. from one vertex to the perpendicular edge.
 * (line marked x in the diagram below)
 *
 * ```
 *      .
 *     .x .
 *    . x  .
 *   .  x   .
 *  ..........
 * ```
 * @param t
 */
declare const height$2: (t: TriangleEquilateral) => number;
declare const perimeter$2: (t: TriangleEquilateral) => number;
declare const area$2: (t: TriangleEquilateral) => number;
/**
 * Circle that encompasses all points of triangle
 * @param t
 */
declare const circumcircle$2: (t: TriangleEquilateral) => Circle;
/**
 * Circle that is inside the edges of the triangle
 * @param t
 * @returns
 */
declare const incircle$2: (t: TriangleEquilateral) => Circle;
declare namespace right_d_exports {
  export { DefinedRight, Right, adjacentFromHypotenuse, adjacentFromOpposite, angleAtPointA, angleAtPointB, area$1 as area, circumcircle$1 as circumcircle, fromA$1 as fromA, fromB$1 as fromB, fromC$1 as fromC, height$1 as height, hypotenuseFromAdjacent, hypotenuseFromOpposite, hypotenuseSegments, incircle$1 as incircle, medians$1 as medians, oppositeFromAdjacent, oppositeFromHypotenuse, perimeter$1 as perimeter, resolveLengths };
}
type Right = {
  readonly adjacent?: number;
  readonly hypotenuse?: number;
  readonly opposite?: number;
};
type DefinedRight = {
  readonly adjacent: number;
  readonly hypotenuse: number;
  readonly opposite: number;
};
/**
 * Returns a positioned triangle from a point for A.
 *
 * ```
 *             c (90 deg)
 *             .
 *          .   .
 *       .       .
 *    .           .
 * a .............. b
 * ```
 * @param t
 * @param origin
 * @returns
 */
declare const fromA$1: (t: Right, origin?: Point) => Triangle;
/**
 * Returns a positioned triangle from a point for B.
 *
 * ```
 *             c (90 deg)
 *             .
 *          .   .
 *       .       .
 *    .           .
 * a .............. b
 * ```
 * @param t
 * @param origin
 * @returns
 */
declare const fromB$1: (t: Right, origin?: Point) => Triangle;
/**
 * Returns a positioned triangle from a point for C.
 *
 * ```
 *             c (90 deg)
 *             .
 *          .   .
 *       .       .
 *    .           .
 * a .............. b
 * ```
 *
 *
 * ```js
 * // Triangle pointing up to 0,0 with sides of 15
 * Triangles.Right.fromC({ adjacent: 15, opposite:15 }, { x: 0, y: 0 });
 * ```
 * @param t
 * @param origin
 * @returns
 */
declare const fromC$1: (t: Right, origin?: Point) => Triangle;
/**
 * Returns a right triangle with all lengths defined.
 * At least two lengths must already exist
 * @param t
 * @returns
 */
declare const resolveLengths: (t: Right) => DefinedRight;
/**
 * Height of right-triangle
 * @param t
 * @returns
 */
declare const height$1: (t: Right) => number;
/**
 * Returns the lengths of the hypotenuse split into p and q segments.
 * In other words, if one makes a line from the right-angle vertex down to hypotenuse.
 *
 * [See here](https://rechneronline.de/pi/right-triangle.php)
 * @param t
 * @returns
 */
declare const hypotenuseSegments: (t: Right) => readonly [p: number, q: number];
declare const perimeter$1: (t: Right) => number;
declare const area$1: (t: Right) => number;
/**
 * Angle (in radians) between hypotenuse and adjacent edge
 * @param t
 * @returns
 */
declare const angleAtPointA: (t: Right) => number;
/**
 * Angle (in radians) between opposite edge and hypotenuse
 * @param t
 * @returns
 */
declare const angleAtPointB: (t: Right) => number;
/**
 * Returns the median line lengths a, b and c in an array.
 *
 * The median lines are the lines from each vertex to the center.
 *
 * @param t
 * @returns
 */
declare const medians$1: (t: Right) => readonly [a: number, b: number, c: number];
/**
 * The circle which passes through the points of the triangle
 * @param t
 * @returns
 */
declare const circumcircle$1: (t: Right) => Circle;
/**
 * Circle enclosed by triangle
 * @param t
 * @returns
 */
declare const incircle$1: (t: Right) => Circle;
/**
 * Returns the opposite length of a right-angle triangle,
 * marked here
 *
 * ```
 *    .  <
 *   ..  <
 * ....  <
 * ```
 *
 * This is just:
 * ```js
 * opposite = Math.tan(angle) * adjacent
 * ```
 * @param angleRad
 * @param adjacent
 * @returns
 */
declare const oppositeFromAdjacent: (angleRad: number, adjacent: number) => number;
/**
 * Returns the opposite length of a right-angle triangle,
 * marked here
 *
 * ```
 *    .  <
 *   ..  <
 * ....  <
 * ```
 *
 * This is just:
 * ```js
 * opposite = Math.tan(angle) * adjacent
 * ```
 * @param angleRad
 * @param hypotenuse
 * @returns
 */
declare const oppositeFromHypotenuse: (angleRad: number, hypotenuse: number) => number;
/**
 * Returns the adjecent length of a right-angle triangle,
 * marked here
 * ```
 *    .
 *   ..  o
 * ....
 * ^^^^
 * ```
 * This is just:
 * ```js
 * opposite = Math.tan(angle) * adjacent
 * ```
 * @param angleRadian
 * @param hypotenuse
 * @returns
 */
declare const adjacentFromHypotenuse: (angleRadian: number, hypotenuse: number) => number;
/**
 * Returns the adjecent length of a right-angle triangle,
 * marked here
 * ```
 *    .
 *   ..  o
 * ....
 * ^^^^
 * ```
 * This is just:
 * ```js
 * opposite = Math.tan(angle) * adjacent
 * ```
 * @param angleRadian
 * @param opposite
 * @returns
 */
declare const adjacentFromOpposite: (angleRadian: number, opposite: number) => number;
/**
 * Returns the hypotenuse length of a right-angle triangle,
 * marked here
 * ```
 *      .
 * >   ..
 * >  ...
 * > ....  opp
 *  .....
 *   adj
 * ```
 * This is just:
 * ```js
 * opposite = Math.tan(angle) * adjacent
 * ```
 * @param angleRadian
 * @param opposite
 * @returns
 */
declare const hypotenuseFromOpposite: (angleRadian: number, opposite: number) => number;
/**
 * Returns the hypotenuse length of a right-angle triangle,
 * marked here
 * ```
 *      .
 * >   ..
 * >  ...
 * > ....  opp
 *  .....
 *   adj
 * ```
 * This is just:
 * ```js
 * opposite = Math.tan(angle) * adjacent
 * ```
 * @param angleRadian
 * @param adjacent
 * @returns
 */
declare const hypotenuseFromAdjacent: (angleRadian: number, adjacent: number) => number;
declare namespace isosceles_d_exports {
  export { Isosceles, apexAngle, area, baseAngle, circumcircle, fromA, fromB, fromC, fromCenter, height, incircle, legHeights, medians, perimeter };
}
type Isosceles = {
  readonly legs: number;
  readonly base: number;
};
declare const baseAngle: (t: Isosceles) => number;
declare const apexAngle: (t: Isosceles) => number;
declare const height: (t: Isosceles) => number;
declare const legHeights: (t: Isosceles) => number;
declare const perimeter: (t: Isosceles) => number;
declare const area: (t: Isosceles) => number;
declare const circumcircle: (t: Isosceles) => Circle;
declare const incircle: (t: Isosceles) => Circle;
declare const medians: (t: Isosceles) => readonly [a: number, b: number, c: number];
/**
 * Returns a positioned `Triangle` based on a center origin.
 * Center is determined by the intesecting of the medians.
 *
 * See: https://rechneronline.de/pi/isosceles-triangle.php
 * @param t
 * @param origin
 * @returns
 */
declare const fromCenter: (t: Isosceles, origin?: Point) => Triangle;
declare const fromA: (t: Isosceles, origin?: Point) => Triangle;
declare const fromB: (t: Isosceles, origin?: Point) => Triangle;
declare const fromC: (t: Isosceles, origin?: Point) => Triangle;
declare namespace index_d_exports$10 {
  export { BarycentricCoord, Empty, equilateral_d_exports as Equilateral, isosceles_d_exports as Isosceles, Placeholder$1 as Placeholder, right_d_exports as Right, Triangle, angles, anglesDegrees, apply, area$3 as area, barycentricCoord, barycentricToCartestian, bbox, centroid, corners, edges, equilateralFromVertex, fromFlatArray, fromPoints, fromRadius, guard, innerCircle, intersectsPoint, isAcute, isEmpty, isEqual, isEquilateral, isIsosceles, isOblique, isObtuse, isPlaceholder, isRightAngle, isTriangle, lengths, outerCircle, perimeter$3 as perimeter, rotate, rotateByVertex, toFlatArray };
}
declare namespace raycast_d_exports {
  export { RaycastHit, asFan, intersections, raycast2d };
}
type RaycastHit = {
  x: number;
  y: number;
  d: number;
  line: number;
};
/**
 * Yields the intersecting points from `a` to `b` against a set of lines.
 *
 * ```js
 * const a = { x: 0, y: 0 };
 * const b = { x: 640, y: 320 };
 * for (const point of G.Rays.intersections(a,b, lines)) {
 *  // Do something with  { x,, y }
 * }
 * ```
 *
 * Results are a {@link RaycastHit}, consisting of `x,y` for coordinates,
 * `d` for relative distance of point from `a`, and `line` which is the index of the line.
 * @param a
 * @param b
 * @param lines
 */
declare function intersections(a: Point, b: Point, lines: Line[]): Generator<RaycastHit>;
/**
 * Returns a function that performs raycasting.
 *
 * The raycast function takes in the position of a ray source,
 * and returns the x,y coordinates of where rays land on a provided list of lines.
 *
 * ```js
 * const raycaster = raycast2d(lines);
 * const light = { x: 10, y: 20 }
 * raycaster(light); // Yields: { x, y, index }
 * ```
 *
 * An `index` property is given for each coordinate, which corresponds to the `lines` array.
 * This allows correspondence between hits and lines.
 * @param lines
 * @returns
 */
declare function raycast2d(lines: Line[]): (light: Point) => RaycastHit[];
declare function asFan(samples: RaycastHit[], light: CirclePositioned): RaycastHit[];
//#endregion
export { Angle, Arc, ArcInterpolate, ArcPositioned, ArcSvgOpts, ArcToSvg, index_d_exports as Arcs, BarycentricCoord, index_d_exports$1 as Beziers, Circle, CirclePositioned, CircleRandomPointOpts, CircleToSvg, index_d_exports$2 as Circles, compound_path_d_exports as Compound, CompoundPath, ContainsResult, Coord, CubicBezier, CubicBezierPath, curve_simplification_d_exports as CurveSimplification, Dimensions, ellipse_d_exports as Ellipses, Grid, GridArray1d, GridBoundsLogic, GridCardinalDirection, GridCardinalDirectionOptional, GridCell, GridCellAccessor, GridCellAndValue, GridCellSetter, GridCreateVisitor, GridIdentifyNeighbours, GridNeighbour, GridNeighbourMaybe, GridNeighbourSelectionLogic, GridNeighbourSelector, GridNeighbours, GridReadable, GridVisitorOpts, GridVisual, GridWritable, index_d_exports$3 as Grids, layout_d_exports as Layouts, Line, LinePath, index_d_exports$4 as Lines, Path, index_d_exports$5 as Paths, Placeholder, Placeholder3d, Point, Point3d, PointCalculableShape, PointRelation, PointRelationResult, PointTrack, PointTracker, PointTrackerResults, index_d_exports$6 as Points, PointsTracker, index_d_exports$7 as Polar, PolarLine, PolarRay, PolarRayWithOrigin, PolarToCartesian, PolyLine, quad_tree_d_exports as QuadTree, QuadraticBezier, QuadraticBezierPath, raycast_d_exports as Rays, Rect, Rect3d, Rect3dPositioned, RectArray, RectPositioned, RectPositionedArray, index_d_exports$8 as Rects, ScaleBy, Scaler, ScalerCombined, ShapePositioned, index_d_exports$9 as Shapes, Sphere, surface_points_d_exports as SurfacePoints, Triangle, index_d_exports$10 as Triangles, UserPointerTracker, UserPointersTracker, vector_d_exports as Vectors, waypoint_d_exports as Waypoints, WithBeziers, angleConvert, angleParse, average, degreeArc, degreeToGradian, degreeToRadian, degreeToTurn, degreesSum, fromUnitVector, gradianToDegree, gradianToRadian, isAngleType, radianArc, radianInvert, radianRange, radianToDegree, radianToGradian, radianToTurn, radiansBetweenCircular, radiansFromAxisX, radiansNormalise, radiansSum, scaler, toRadian, toUnitVector, turnToDegree, turnToRadian };