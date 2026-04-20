import { r as Point } from "./point-type-DLbh1Hzz.js";

//#region ../packages/geometry/src/point/averager.d.ts
type PointAverager = (point: Point) => Point;
type PointAveragerKinds = `moving-average-light`;
type PointAverageKinds = `mean`;
/**
 * Averages a set of points, by default as a 'mean'.
 *
 * List of points has to all have Z property or none of them -- it's not
 * possible to mix 2D and 3D points.
 * @param points
 * @returns
 */
declare const average: (points: Iterable<Point>, kind?: PointAverageKinds) => Point;
/**
 * Keeps track of average x, y and z values.
 *
 * When calling, you have to specify the averaging technique. At the moment
 * only 'moving-average-light' is supported. This uses @ixfx/numbers.movingAverageLight
 * under-the-hood.
 *
 * ```js
 * // Create averager
 * const averager = Points.averager(`moving-average-light`);
 *
 * // Call function with a point to add it to average
 * // and return the current average.
 * averager(somePoint); // Yields current average {x,y,z?}
 * ```
 *
 * @param kind Averaging strategy
 * @param opts Scaling parameter. Higher means more smoothing, lower means less (minimum: 1). Default: 3
 * @returns
 */
declare function averager(kind: `moving-average-light`, opts: Partial<{
  scaling: number;
}>): PointAverager;
//#endregion
export { averager as a, average as i, PointAverager as n, PointAveragerKinds as r, PointAverageKinds as t };