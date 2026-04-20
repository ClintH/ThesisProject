import { n as MovingWindowOptions } from "./types-j4lP7di-.js";
import { a as NumbersComputeResult, i as NumbersComputeOptions, n as NumberScaler, o as NumericRange, r as NumberScalerTwoWay, t as BipolarWrapper } from "./types-DtDff87L.js";
import { i as interpolatorStepped, n as interpolate, r as interpolateAngle, t as BasicInterpolateOptions } from "./interpolate-CCr7T6z3.js";

//#region ../packages/numbers/src/apply-to-values.d.ts
/**
 * Apples `fn` to every key of `obj` which is numeric.
 * ```js
 * const o = {
 *  name: 'john',
 *  x: 10,
 *  y: 20
 * };
 * const o2 = applyToValues(o, (v) => v * 2);
 *
 * // Yields: { name: 'john', x: 20, y: 40 }
 * ```
 * @param object
 * @param apply
 * @returns
 */
declare const applyToValues: <T extends Record<string, any>>(object: T, apply: (v: number) => number) => T;
//#endregion
//#region ../packages/numbers/src/average.d.ts
/**
 * Calculate median value of an array of numbers
 * @param data
 * @returns
 */
declare const median: (data: number[] | readonly number[]) => number;
/**
 * Calculate the mean of `array`.
 * @param array
 * @returns
 */
declare const mean: (array: number[] | readonly number[]) => number;
/**
 * Computes an average of an array with a set of weights applied.
 *
 * Weights can be provided as an array, expected to be on 0..1 scale, with indexes
 * matched up to input data. Ie. data at index 2 will be weighed by index 2 in the weightings array.
 *
 * ```js
 * // All items weighted evenly
 * averageWeighted([1,2,3], [1,1,1]); // 2
 *
 * // First item has full weight, second half, third quarter
 * averageWeighted([1,2,3], [1, 0.5, 0.25]); // 1.57
 *
 * // With reversed weighting of [0.25,0.5,1] value is 2.42
 * ```
 *
 * A function can alternatively be provided to compute the weighting based on array index, via {@link weight}.
 *
 * ```js
 * averageWeighted[1,2,3], Random.gaussian()); // 2.0
 * ```
 *
 * This is the same as:
 *
 * ```js
 * const data = [ 1, 2, 3 ];
 * const w = weight(data, Random.gaussian());
 * const avg = averageWeighted(data, w); // 2.0
 * ```
 * @param data Data to average
 * @param weightings Array of weightings that match up to data array, or an easing function
 * @see {@link average} Compute averages without weighting.
 */
declare const averageWeighted: (data: number[] | readonly number[], weightings: number[] | readonly number[] | ((arrayIndex: number) => number)) => number;
/**
 * Returns a function that computes a weighted average of an array
 *
 * ```js
 * const w = averageWeigher(v => Math.random() * v);
 *
 * // Give each array index a random
 * w([1,2,3,4]);
 * ```
 * @param weigher
 * @returns
 */
declare const averageWeigher: (weigher: (arrayIndex: number) => number) => (data: number[]) => number;
//#endregion
//#region ../packages/numbers/src/clamp.d.ts
/**
 * Clamps a value between min and max (both inclusive)
 * Defaults to a 0-1 range, useful for percentages.
 *
 * @example Usage
 * ```js
 * // 0.5 - just fine, within default of 0 to 1
 * clamp(0.5);
 * // 1 - above default max of 1
 * clamp(1.5);
 * // 0 - below range
 * clamp(-50, 0, 100);
 * // 50 - within range
 * clamp(50, 0, 50);
 * ```
 *
 * For clamping integer ranges, consider {@link clampIndex }
 * For clamping `{ x, y }` points, consider {@link https://api.ixfx.fun/_ixfx/geometry/Points/clamp/ @ixfx/geometry/Points.clamp}.
 * For clamping bipolar values: {@link Bipolar.clamp}
 * @param value Value to clamp
 * @param min value (inclusive)
 * @param max value (inclusive)
 * @returns Clamped value
 */
declare const clamp: (value: number, min?: number, max?: number) => number;
/**
 * Returns a function that clamps values.
 *
 * ```js
 * const c = clamper(0,100);
 * c(50);   // 50
 * c(101); // 100
 * c(-5);  // 0
 * ```
 * @param min Minimum value. Default: 0
 * @param max Maximum value. Default: 1
 */
declare const clamper: (min?: number, max?: number) => (v: number) => number;
/**
 * Clamps integer `v` between 0 (inclusive) and array length or length (exclusive).
 * Returns value then will always be at least zero, and a valid array index.
 *
 * @example Usage
 * ```js
 * // Array of length 4
 * const myArray = [`a`, `b`, `c`, `d`];
 * clampIndex(0, myArray);    // 0
 * clampIndex(5, 3); // 2
 * ```
 *
 * Throws an error if `v` is not an integer.
 *
 * For some data it makes sense that data might 'wrap around' if it exceeds the
 * range. For example rotation angle. Consider using {@link wrap} for this.
 *
 * @param v Value to clamp (must be an interger)
 * @param arrayOrLength Array, or length of bounds (must be an integer)
 * @returns Clamped value, minimum will be 0, maximum will be one less than `length`.
 */
declare const clampIndex: (v: number, arrayOrLength: number | readonly any[]) => number;
declare function maxAbs(values: Iterable<number>): number;
declare function maxAbs(...values: number[]): number;
//#endregion
//#region ../packages/numbers/src/count.d.ts
/**
 * Yields `amount` integers, counting by one from zero. If a negative amount is used,
 * count decreases. If `offset` is provided, this is added to the return result.
 * @example
 * ```js
 * const a = [...count(5)]; // Yields five numbers: [0,1,2,3,4]
 * const b = [...count(-5)]; // Yields five numbers: [0,-1,-2,-3,-4]
 * for (const v of count(5, 5)) {
 *  // Yields: 5, 6, 7, 8, 9
 * }
 * const c = [...count(5,1)]; // Yields [1,2,3,4,5]
 * ```
 *
 * @example Used with forEach
 * ```js
 * // Prints `Hi` 5x
 * forEach(count(5), () => // do something);
 * ```
 *
 * If you want to accumulate return values, consider using Flow.repeat.
 *
 * @example Run some code every 100ms, 10 times:
 * ```js
 * import { interval } from '@ixfx/flow.js'
 * import { count } from '@ixfx/numbers.js'
 * const counter = count(10);
 * for await (const v of interval(counter, { fixedIntervalMs: 100 })) {
 *  // Do something
 * }
 * ```
 * @param amount Number of integers to yield
 * @param offset Added to result
 */
declare function count(amount: number, offset?: number): Generator<number, void, void>;
//#endregion
//#region ../packages/numbers/src/difference.d.ts
type DifferenceKind = `numerical` | `relative` | `relativeSigned` | `absolute`;
/**
 * Returns the difference from the `initial` value. Defaults to absolute difference.
 * ```js
 * const rel = differenceFromFixed(100);
 * rel(100); // 0
 * rel(150); // 50
 * rel(50);  // 50
 * ```
 *
 * 'numerical' gives sign:
 * ```js
 * const rel = differenceFromFixed(100, `numerical`);
 * rel(100); // 0
 * rel(150); // 50
 * rel(50); // -50
 * ```
 *
 * 'relative' gives proportion to initial
 * ```js
 * const rel = differenceFromFixed(100, `relative`);
 * rel(100); // 0
 * rel(150); // 0.5
 * rel(10);  // 0.90
 * ```
 *
 * Using 'relativeSigned', we get negative relative result
 * when value is below the initial value.
 *
 * Use {@link differenceFromLast} to compare against the last value,
 * rather than the same fixed value.
 * @param {number} initial Value to compare against
 * @returns Difference from initial value
 */
declare const differenceFromFixed: (initial: number, kind?: DifferenceKind) => (value: number) => number;
/**
 * Returns a function which yields difference compared to last value.
 *
 * If no initial value is provided, the first difference will be returned as 0.
 *
 * Difference can be returned in various formats:
 * * 'absolute': numerical difference, without sign
 * * 'numerical': numerical difference, with sign, so you can see if difference is higher or lower
 * * 'relative': difference divided by last value, giving a proportional difference. Unsigned.
 * * 'relativeSigned': as above, but with sign
 *
 * Use {@link differenceFromFixed} to compare against a fixed value instead of the last value.
 *
 * ```js
 * let d = differenceFromLast(`absolute`);
 * d(10); // 0
 * d(11); // 1
 * d(10); // 1
 * ```
 *
 * ```js
 * let d = differenceFromLast(`numerical`);
 * d(10); // 0
 * d(11); // 1
 * d(10); // -1
 * ```
 *
 * ```js
 * let d = differenceFromLast(`relative`);
 * d(10); // 0
 * d(11); // 0.1
 * d(10); // 0.1
 * ```
 * ```js
 * let d = differenceFromLast(`relativeSigned`);
 * d(10); // 0
 * d(11); // 0.1
 * d(10); // -0.1
 * ```
 *
 * An initial value can be provided, eg:
 * ```js
 * let d = differenceFromLast(`absolute`, 10);
 * d(11); // 1
 * ```
 * @param kind Kind of output value
 * @param initialValue Optional initial value
 * @returns
 */
declare const differenceFromLast: (kind?: DifferenceKind, initialValue?: number) => (v: number) => number;
//#endregion
//#region ../packages/numbers/src/filter.d.ts
/**
 * Filters an iterator of values, only yielding
 * those that are valid numbers
 *
 * ```js
 * const data = [true, 10, '5', { x: 5 }];
 * for (const n of Numbers.filterIterable(data)) {
 *  // 10
 * }
 * ```
 * @param it
 */
declare function filterIterable(it: Iterable<unknown>): Generator<unknown, void, unknown>;
/**
 * Returns a function that yields _true_ if a value
 * is at least `threshold`
 * ```js
 * const t = thresholdAtLeast(50);
 * t(50); // true
 * t(0);  // false
 * t(55); // true
 * ```
 * @param threshold
 * @returns
 */
declare const thresholdAtLeast: (threshold: number) => (v: number) => boolean;
/**
 * Returns a function that yields _true_
 * if a number is at least _min_ and no greater than _max_
 *
 * ```js
 * const t = rangeInclusive(50, 100);
 * t(40); // false
 * t(50); // true
 * t(60); // true
 * t(100); // true
 * t(101);  // false
 * ```
 * @param min
 * @param max
 * @returns
 */
declare const rangeInclusive: (min: number, max: number) => (v: number) => boolean;
//#endregion
//#region ../packages/numbers/src/flip.d.ts
/**
 * Flips a percentage-scale number: `1 - v`.
 *
 * The utility of this function is that it sanity-checks
 * that `v` is in 0..1 scale.
 *
 * ```js
 * flip(1);   // 0
 * flip(0.5); // 0.5
 * flip(0);   // 1
 * ```
 * @param v
 * @returns
 */
declare const flip: (v: number | (() => number)) => number;
//#endregion
//#region ../packages/numbers/src/generate.d.ts
/**
 * Generates a range of numbers, starting from `start` and counting by `interval`.
 * If `end` is provided, generator stops when reached
 *
 * Unlike {@link numericRange}, numbers might contain rounding errors
 *
 * ```js
 * for (const c of numericRangeRaw(10, 100)) {
 *  // 100, 110, 120 ...
 * }
 * ```
 *
 * Get results as an array
 * ```js
 * const c = [...numericRangeRaw(1,0,5)]; // [0,1,2,3,4]
 * ```
 * @param interval Interval between numbers
 * @param start Start
 * @param end End (if undefined, range never ends). Inclusive.
 */
declare const numericRangeRaw: (interval: number, start?: number, end?: number, repeating?: boolean) => Generator<number, void, unknown>;
/**
 * Generates a range of numbers, with a given interval.
 *
 * @example For-loop
 * ```
 * let loopForever = numericRange(0.1); // By default starts at 0 and counts upwards forever
 * for (v of loopForever) {
 *  console.log(v);
 * }
 * ```
 *
 * @example If you want more control over when/where incrementing happens...
 * ```js
 * let percent = numericRange(0.1, 0, 1);
 *
 * let percentResult = percent.next().value;
 * ```
 *
 * Note that computations are internally rounded to avoid floating point math issues. So if the `interval` is very small (eg thousandths), specify a higher rounding
 * number.
 *
 * @param interval Interval between numbers
 * @param start Start. Defaults to 0
 * @param end End (if undefined, range never ends). Inclusive.
 * @param repeating Range loops from start indefinately. Default _false_
 * @param rounding A rounding that matches the interval avoids floating-point math hikinks. Eg if the interval is 0.1, use a rounding of 10
 */
declare const numericRange: (interval: number, start?: number, end?: number, repeating?: boolean, rounding?: number) => Generator<number, void, unknown>;
/**
 * Yields numeric range between 0.0-1.0.
 *
 * ```
 * // Yields: [0, 0.2, 0.4, 0.6, 0.8, 1]
 * const a = [...numericPercent(0.2)];
 *
 * // Repeating flag set to true:
 * for (const v of numericPercent(0.2, true)) {
 *  // Infinite loop. V loops back to 0 after hitting 1
 * }
 * ```
 *
 * If `repeating` is true, it loops back to 0 after reaching 1
 * @param interval Interval (default: 0.01, ie. 1%)
 * @param repeating Whether generator should loop (default: false)
 * @param start Start (default: 0)
 * @param end End (default: 1)
 * @returns
 */
declare const numericPercent: (interval?: number, repeating?: boolean, start?: number, end?: number) => Generator<number, void, unknown>;
//#endregion
//#region ../packages/numbers/src/guard.d.ts
/**
 * Returns true if `possibleNumber` is a number and not NaN
 * @param possibleNumber
 * @returns
 */
declare const isValid: (possibleNumber: unknown) => boolean;
//#endregion
//#region ../packages/numbers/src/is-approx.d.ts
/**
 * Returns a function that checks if a value is within range of a base value
 * ```js
 * const tenPercent = isApprox(0.1);
 * // Check if 101 is within 10% range of 100
 * tenPercent(100, 101);
 * ```
 * @param rangePercent
 */
declare function isApprox(rangePercent: number): (baseValue: number, value: number) => boolean;
/**
 * Returns a function to check if a value is within range of a base value
 * ```js
 * const close = isApprox(0.1, 100);
 * // Check if 101 is within 10% range of 100
 * close(101);
 * ```
 * @param rangePercent
 * @param baseValue
 */
declare function isApprox(rangePercent: number, baseValue: number): (value: number) => boolean;
/**
 * Returns _true/false_ if `value` is within `rangePercent` of `baseValue`.
 *
 * ```js
 * // True
 * isApprox(0.1, 100, 101);
 * isApprox(0.1, 100, 99);
 * isApprox(0.1, 100, 100);
 *
 * // False
 * isApprox(0.1, 100, 98);
 * isApprox(0.1, 100, 102);
 * ```
 * @param rangePercent
 * @param baseValue
 * @param value
 */
declare function isApprox(rangePercent: number, baseValue: number, value: number): boolean;
/**
 * Yields a function that checks if a value is close to any target value
 * ```js
 * const c = isCloseToAny(1, 10, 20, 30, 40);
 * c(11); // True - within 1 range of 10
 * c(19); // True - within 1 range of 20
 * c(0);  // False
 * ```
 *
 * Returned function accepts multiple values, returning
 * _true_ if any of them are within range
 * ```js
 * c(0, 1, 11); // Would return true based on 11
 * ```
 * @param allowedRangeAbsolute
 * @param targets
 * @returns
 */
declare const isCloseToAny: (allowedRangeAbsolute: number, ...targets: number[]) => (...values: number[]) => boolean;
//#endregion
//#region ../packages/numbers/src/kalman.d.ts
type Kalman1dFilterOptions = {
  /**
   * Process noise
   * @default 1
   */
  r: number;
  /**
   * Measurement noise
   * @default 1
   */
  q: number;
  /**
   * State vector
   * @default 1
   */
  a: number;
  /**
   * Control vector
   * @default 0
   */
  b: number;
  /**
   * Measurement vector
   * @default 1
   */
  c: number;
};
/**
* KalmanFilter
*
* author: Wouter Bulten
* see {@link http://github.com/wouterbulten/kalmanjs}
* version Version: 1.0.0-beta
* copyright Copyright 2015-2018 Wouter Bulten
* license MIT License
*/
declare class Kalman1dFilter {
  R: number;
  Q: number;
  A: number;
  C: number;
  B: number;
  cov: number;
  x: number;
  /**
  * Create 1-dimensional kalman filter
  */
  constructor(options?: Partial<Kalman1dFilterOptions>);
  /**
  * Filter a new value
  * @param  {Number} z Measurement
  * @param  {Number} u Control
  * @return {Number}
  */
  filter(z: number, u?: number): number;
  /**
  * Predict next value
  * @param  {Number} [u] Control
  * @return {Number}
  */
  predict(u?: number): number;
  /**
  * Return uncertainty of filter
  * @return {Number}
  */
  uncertainty(): number;
  /**
  * Return the last filtered measurement
  * @return {Number}
  */
  lastMeasurement(): number;
  /**
  * Set measurement noise Q
  * @param {Number} noise
  */
  setMeasurementNoise(noise: number): void;
  /**
  * Set the process noise R
  * @param {Number} noise
  */
  setProcessNoise(noise: number): void;
}
/**
 * Returns a function that performs 1D Kalman filtering.
 *
 * ```js
 * const f = kalman1dFilter();
 * f(10); // 10
 * ```
 *
 * Under the hood creates a {@link Kalman1dFilter} instance and returns its `filter` method.
 * @param options
 * @returns
 */
declare const kalman1dFilter: (options?: Partial<Kalman1dFilterOptions>) => (z: number, u?: number) => number;
declare namespace bipolar_d_exports {
  export { clamp$1 as clamp, fromScalar, immutable, scale$1 as scale, scaleUnclamped, toScalar, towardZero };
}
/**
 * Wrapper for bipolar-based values. Immutable.
 * All functions will clamp to keep it in legal range.
 *
 * ```js
 * let v = immutable(); // Starts with 0 by default
 * v = v.add(0.1);      // v.value is 0.1
 * v = v.inverse();     // v.value is -0.1
 * v = v.multiply(0.2); // v.value is -0.02
 *
 * v = immutable(1);
 * v = v.towardZero(0.1); // 0.9
 * v = v.interpolate(0.1, 1);
 * ```
 *
 * Wrapped values can be coerced into number:
 * ```js
 * const v = immutable(1);
 * const x = +v+10;
 * // x = 11
 * ```
 * @param startingValueOrBipolar Initial numeric value or BipolarWrapper instance
 * @throws {TypeError} If start value is out of bipolar range or invalid
 * @returns
 */
declare const immutable: (startingValueOrBipolar?: number | BipolarWrapper) => BipolarWrapper;
/**
 * Converts bipolar value to a scalar. That is, converts from
 * -1..1 range to 0..1.
 *
 * ```js
 * Bipolar.toScalar(-1); // 0.0
 * Bipolar.toScalar( 0); // 0.5
 * Bipolar.toScalar( 1); // 1.0
 * ```
 *
 * Range can be changed:
 * ```js
 * Bipolar.toScalar(0, 100); // Uses 0..100 scale, so output is 50
 * Bipolar.toScalar(0, 100, 50); // Uses 50..1000 scale, so output is 75
 * ```
 *
 * Throws an error if `bipolarValue` is not a number or NaN
 * @param bipolarValue Value to convert to scalar
 * @returns Scalar value on 0..1 range.
 */
declare const toScalar: (bipolarValue: number, max?: number, min?: number) => number;
/**
 * Makes a scalar into a bipolar value.
 *
 * That is, input range is 0..1, output range is -1...1
 *
 * ```js
 * Bipolar.fromScalar(1);   // 1
 * Bipolar.fromScalar(0);   // -1
 * Bipolar.fromScalar(0.5); // 0
 * ```
 *
 * Throws an error if `scalarValue` is outside 0..1 scale.
 * @param scalarValue Scalar value to convert
 * @returns Bipolar value on -1..1 scale
 */
declare const fromScalar: (scalarValue: number) => number;
/**
 * Scale & clamp value to bipolar range (-1..1).
 * ```js
 * // Scale 100 on 0..100 scale
 * Bipolar.scale(100, 0, 100); // 1
 * Bipolar.scale(50, 0, 100);  // 0
 * Bipolar.scale(0, 0, 100);   // -1
 * ```
 *
 * Return value is clamped.
 * @param inputValue Value to scale
 * @param inMin Minimum of scale
 * @param inMax Maximum of scale
 * @returns Bipolar value on -1..1 scale
 */
declare const scale$1: (inputValue: number, inMin: number, inMax: number) => number;
/**
 * Scale a number to bipolar range (-1..1). Not clamped, so we might exceed range.
 *
 * ```js
 * // Scale 100 on 0..100 scale
 * Bipolar.scaleUnclamped(100, 0, 100); // 1
 * Bipolar.scaleUnclamped(50, 0, 100);  // 0
 * Bipolar.scaleUnclamped(0, 0, 100);   // -1
 * ```
 *
 * @param inputValue Value to scale
 * @param inMin Minimum of scale
 * @param inMax Maximum of scale
 * @returns Bipolar value on -1..1 scale
 */
declare const scaleUnclamped: (inputValue: number, inMin: number, inMax: number) => number;
/**
 * Clamp a bipolar value
 * ```js
 * Bipolar.clamp(-1);   // -1
 * Bipolar.clamp(-1.1); // -1
 * ```
 *
 * Throws an error if `bipolarValue` is not a number or NaN.
 * @param bipolarValue Value to clamp
 * @returns Clamped value on -1..1 scale
 */
declare const clamp$1: (bipolarValue: number) => number;
/**
 * Pushes a bipolar value toward zero by `amount`.
 * Return value is clamped on bipolar range of -1..1
 *
 * ```js
 * Bipolar.towardZero(-1, 0.1); // -0.9
 * Bipolar.towardZero( 1, 0.1); //  0.9
 * Bipolar.towardZero( 0, 0.1); //  0.0
 * Bipolar.towardZero( 1, 1.1); //  0.0
 * ```
 *
 * If `amount` is greater than 1, 0 is returned.
 * Throws an error if `bipolarValue` or `amount` are not numbers.
 * Throws an error if `amount` is below zero.
 * @param bipolarValue Bipolar value to nudge toward zero
 * @param amount Amount to nudge by
 * @returns Bipolar value -1...1
 */
declare const towardZero: (bipolarValue: number, amount: number) => number;
//#endregion
//#region ../packages/numbers/src/iqr.d.ts
/**
 * Calculate interquartile range.
 *
 * If `n` is unspecified, `data.length` is used.
 * @param data
 * @param n
 * @returns
 */
declare const interquartileRange: (data: number[], n?: number) => number;
/**
 * Returns a function which itself returns _true_ if a value is an outlier.
 *
 * This can be used for example to get a copy of an array without outliers:
 * ```js
 * const p = computeIsOutlier(someData);
 * const someDataWithoutOutliers = someData.filter(value => !p(value));
 * ```
 *
 * Outliers are defined as: "a point which falls more than 1.5 times the interquartile range above the third quartile or below the first quartile." [Wolfram](https://mathworld.wolfram.com/Outlier.html)
 *
 * If array length is less than 4, no value will be considered an outlier.
 * @param data Data to filter
 * @param multiplier Multiplier of Q3 Q1. Default: 1.5
 * @returns
 */
declare const computeIsOutlier: (data: number[], multiplier?: number) => (value: number) => boolean;
/**
 * Gets the value at a specific quantile
 * ```js
 * getQuantile(data, 25); // 1st quartile
 * getQuantile(data, 75); // 3rd quartile
 * ```
 * @param data
 * @param quantile
 * @param presorted Pass _true_ if `data` is already sorted
 * @returns
 */
declare const getQuantile: (data: number[], quantile: number, presorted?: boolean) => number;
//#endregion
//#region ../packages/numbers/src/linear-space.d.ts
/**
 * Generates a `step`-length series of values between `start` and `end` (inclusive).
 * Each value will be equally spaced.
 *
 * ```js
 * for (const v of linearSpace(1, 5, 6)) {
 *  // Yields: [ 1, 1.8, 2.6, 3.4, 4.2, 5 ]
 * }
 * ```
 *
 * Numbers can be produced from large to small as well
 * ```js
 * const values = [...linearSpace(10, 5, 3)];
 * // Yields: [10, 7.5, 5]
 * ```
 * @param start Start number (inclusive)
 * @param end  End number (inclusive)
 * @param steps How many steps to make from start -> end
 * @param precision Number of decimal points to round to
 */
declare function linearSpace(start: number, end: number, steps: number, precision?: number): IterableIterator<number>;
//#endregion
//#region ../packages/numbers/src/moving-average.d.ts
/**
 * A moving average calculator (exponential weighted moving average) which does not keep track of
 * previous samples. Less accurate, but uses less system resources.
 *
 * The `scaling` parameter determines smoothing. A value of `1` means that
 * the latest value is used as the average - that is, no smoothing. Higher numbers
 * introduce progressively more smoothing by weighting the accumulated prior average more heavily.
 *
 * ```
 * const ma = movingAverageLight(); // default scaling of 3
 * ma(50);  // 50
 * ma(100); // 75
 * ma(75);  // 75
 * ma(0);   // 50
 * ```
 *
 * Note that the final average of 50 is pretty far from the last value of 0. To make it more responsive,
 * we could use a lower scaling factor: `movingAverageLight(2)`. This yields a final average of `37.5` instead.
 *
 * @param scaling Scaling factor. 1 is no smoothing. Default: 3
 * @returns Function that adds to average.
 */
declare const movingAverageLight: (scaling?: number) => (value?: number) => number;
/**
 * Creates a moving average for a set number of `samples`.
 * It returns a function which in turn yields an average value.
 *
 * Moving average are useful for computing the average over a recent set of numbers.
 * A lower number of samples produces a computed value that is lower-latency yet more jittery.
 * A higher number of samples produces a smoother computed value which takes longer to respond to
 * changes in data.
 *
 * Sample size is considered with respect to the level of latency/smoothness trade-off, and also
 * the rate at which new data is added to the moving average.
 *
 *
 * ```js
 * const ma = movingAverage(10);
 * ma(10); // 10
 * ma(5);  // 7.5
 * ```
 *
 * A weighting function can be provided to shape how the average is
 * calculated - eg privileging the most recent data over older data.
 * It uses `Arrays.averageWeighted` under the hood.
 *
 * ```js
 * import { movingAverage } from '@ixfx/numbers.js';
 * import { gaussian } from '@ixfx/modulation.js';
 *
 * // Give more weight to data in middle of sampling window
 * const ma = movingAverage(100, gaussian());
 * ```
 *
 * Because it keeps track of `samples` previous data, there is a memory impact. A lighter version is {@link movingAverageLight} which does not keep a buffer of prior data, but can't be as easily fine-tuned.
 * @param samplesOrOptions Number of samples to compute average from, or object of options
 * @returns
 */
declare const movingAverage: (samplesOrOptions: number | MovingAverageOptions) => (value: number) => any;
declare const movingAverageWithContext: (samplesOrOptions: number | MovingAverageOptions) => {
  seen: (value: number) => any;
  readonly data: any[];
  readonly average: number;
};
type MovingAverageNanOptions = `throw` | `ignore`;
type MovingAverageOptions = MovingWindowOptions<number> & Partial<{
  /**
   * If set, a weighted average will be
   * calculated instead of a plain average.
   * @param v
   * @returns
   */
  weighter: (v: number) => number;
  nanPolicy: MovingAverageNanOptions;
}>;
/**
 * Noise filtering
 *
 * Algorithm: https://gery.casiez.net/1euro/
 *
 * Based on [Jaan Tollander de Balsch's implementation](https://jaantollander.com/post/noise-filtering-using-one-euro-filter/)
 * @param cutoffMin Default: 1
 * @param speedCoefficient Default: 0
 * @param cutoffDefault Default: 1
 */
declare const noiseFilter: (cutoffMin?: number, speedCoefficient?: number, cutoffDefault?: number) => (value: number, timestamp?: number) => number;
//#endregion
//#region ../packages/numbers/src/normalise-types.d.ts
/**
 * Normalisation strategies
 *
 * In brief,
 * * `minmax`: Produces values on 0..1 scale. Sensitive to outliers.
 * * ``score`: Mean value will be normalised to 0, those on standard deviation 1. Less sensitive to outliers.
 * * `robust`: Does the best job if outliers are expected
 *
 * Keep in mind you could also remove outliers from the dataset before using a
 * basic min-max normalisation.
 *
 * For more details, see Wikipedia:
 * * [Min-Max normalisation](https://en.wikipedia.org/wiki/Feature_scaling#Rescaling_(min-max_normalization))
 * * [Z-score normalisation](https://en.wikipedia.org/wiki/Feature_scaling#Standardization_(Z-score_Normalization))
 * * [Robust scaling]](https://en.wikipedia.org/wiki/Feature_scaling#Robust_Scaling)
 */
type NormalisationStrategy = `minmax` | `zscore` | `robust`;
type NormalisationStreamStrategy = `minmax`;
type MinMaxStreamOptions = {
  minDefault: number;
  maxDefault: number;
};
/**
 * Options for computing min-max normalisation
 */
type MinMaxArrayOptions = {
  /**
   * Minimum value of range
   */
  minForced: number;
  /**
   * Maximum value of range
   */
  maxForced: number;
  /**
   * Clamp input value to min/max
   */
  clamp: boolean;
};
type ZScoreArrayOptions = {
  meanForced: number;
  standardDeviationForced: number;
};
type RobustArrayOptions = {
  medianForced: number;
  iqrForced: number;
};
type NormalisationStreamOptions = MinMaxStreamOptions;
type NormalisationArrayOptions = MinMaxArrayOptions | ZScoreArrayOptions | RobustArrayOptions;
/**
 * Context for stream normalisation
 */
type NormaliseStreamContext = NumericRange & {
  /**
   * Passes a value to the normaliser, getting
   * back the normalised result
   * @param v Value to add
   * @returns Normalised result
   */
  seen: (v: number) => number;
  /**
   * Reset the normaliser, by default to
   * extreme ranges so it will calibrate after the
   * next value.
   * @param minDefault Start min value (default: Number.MAX_SAFE_INTEGER)
   * @param maxDefault Start max value (default: Number.MIN_SAFE_INTERGER)
   * @returns
   */
  reset: (minDefault?: number, maxDefault?: number) => void;
  /**
   * Get the current min value of range.
   *
   * If no values have been passed through the stream it will be
   * the initial minDefault or Number.MAX_SAFE_INTEGER
   */
  get min(): number;
  /**
   * Get the current max value of range.
   *
   * If no values have been passed through the stream it will be
   * the initial maxDefault or Number.MIN_SAFE_INTEGER
   */
  get max(): number;
  /**
   * Gets the absolute range (ie. max-min) of the normaliser.
   *
   * If normaliser hasn't received any values it will use its default min/max.
   */
  get range(): number;
};
declare namespace normalise_minmax_d_exports {
  export { array$3 as array, arrayWithContext$3 as arrayWithContext, compute$2 as compute, stream$1 as stream, streamWithContext$1 as streamWithContext };
}
/**
 * Returns a function which can do min-max normalisation, baking-in the min and max values.
 * ```js
 * // Normalise with min value of 20, max of 100
 * const fn = compute(20, 100);
 *
 * // Use function with input value of 40
 * fn(40);
 * ```
 *
 * @param min Minimum value of range
 * @param max Maximum value of range
 * @param clamp Whether to clamp input value to min/max range. Default: _false_
 * @returns
 */
declare const compute$2: (min: number, max: number, clamp?: boolean) => (value: number) => number;
/**
 * Normalises an array using the [min-max](https://en.wikipedia.org/wiki/Feature_scaling#Rescaling_(min-max_normalization)) technique.
 *
 * This version returns additional context of the normalisation, alternatively use {@link array}
 *
 * ```js
 * const c = arrayWithContext(someValues);
 * c.values;    // Array of normalised values
 * c.original;  // Original input array
 * c.min / c.max / c.range
 * ```
 *
 * By default, computes min and max values based on contents of `values`. Clamping is not required
 * for this case, so it's _false_ by default.
 *
 * @param values Values
 * @param options Optionally uses 'minForced' and 'maxForced' properties to scale values instead of actual min/max values of data.
 */
declare const arrayWithContext$3: (values: readonly number[], options?: Partial<MinMaxArrayOptions>) => {
  values: number[];
  original: any[];
  min: number;
  max: number;
  range: number;
};
/**
 * Normalises an array using the [min-max](https://en.wikipedia.org/wiki/Feature_scaling#Rescaling_(min-max_normalization)) technique.
 * By default uses the actual min/max of the array as the normalisation range.
 *
 * [ixfx Guide on Normalising](https://ixfx.fun/cleaning/normal/)
 *
 * Use {@link arrayWithContext} to get back the min/max/range and original values
 *
 * ```js
 * // Yields: [0.5, 0.1, 0.0, 0.9, 1]
 * Normalise.MinMax.array([5,1,0,9,10]);
 * ```
 *
 * `minForced` and/or `maxForced` can
 * be provided to use an arbitrary range.
 *
 * ```js
 * // Forced range 0-100
 * // Yields: [0.05, 0.01, 0.0, 0.09, 0.10]
 * Normalise.MinMax.array([5,1,0,9,10], { minForced: 0, maxForced: 100 });
 * ```
 *
 * Return values are clamped to always be 0-1, inclusive.
 *
 * @param values Values
 * @param options Options to override or min/max values.
 */
declare const array$3: (values: readonly number[], options?: Partial<MinMaxArrayOptions>) => number[];
/**
 * [Min-max scaling](https://en.wikipedia.org/wiki/Feature_scaling#Rescaling_(min-max_normalization))
 *
 * A more advanced form of {@link stream}
 *
 * With this version
 * @example
 * ```js
 * const s = Normalise.MinMax.streamWithContext();
 * s.seen(2);    // 1 (because 2 is highest seen)
 * s.seen(1);    // 0 (because 1 is the lowest so far)
 * s.seen(1.5);  // 0.5 (50% of range 1-2)
 * s.seen(0.5);  // 0 (because it's the new lowest)
 * ```
 *
 * And the more advanced features
 * ```js
 * s.min / s.max / s.range
 * s.reset();
 * s.reset(10, 100);
 * ```
 * @returns
 */
declare const streamWithContext$1: (options?: Partial<MinMaxStreamOptions>) => NormaliseStreamContext;
/**
 * Normalises numbers using the [min-max](https://en.wikipedia.org/wiki/Feature_scaling#Rescaling_(min-max_normalization)) technique.
 *
 * Adjusts min/max as new values are processed. Return values will be in the range of 0-1 (inclusive).
 *
 * [ixfx Guide on Normalising](https://ixfx.fun/cleaning/normal/)
 *
 * Use {@link streamWithContext} if you want to be able to check the min/max or reset the normaliser.
 *
 * @example
 * ```js
 * const s = Normalise.MinMax.stream();
 * s(2);    // 1 (because 2 is highest seen)
 * s(1);    // 0 (because 1 is the lowest so far)
 * s(1.5);  // 0.5 (50% of range 1-2)
 * s(0.5);  // 0 (because it's the new lowest)
 * ```
 *
 * Since normalisation is being adjusted as new min/max are encountered, it might
 * be that value normalised to 1 at one time is different to what normalises to 1
 * at a later time.
 *
 * If you already know what to expect of the number range, passing in `minDefault`
 * and `maxDefault` primes the normalisation.
 * ```js
 * const s = Normalise.MinMax.stream();
 * s(5); // 1, because it's the highest seen
 *
 * // With priming:
 * const s = Normalise.MinMax.stream({ minDefault:0, maxDefault:10 });
 * s(5); // 0.5, because we're expecting range 0-10
 * ```
 *
 * If a value exceeds the default range, normalisation adjusts.
 * Errors are thrown if min/max defaults are NaN or if one attempts to
 * normalise NaN.
 *
 * @returns
 */
declare const stream$1: (options: MinMaxStreamOptions) => (value: number) => number;
declare namespace normalise_zscore_d_exports {
  export { array$2 as array, arrayWithContext$2 as arrayWithContext, compute$1 as compute };
}
/**
 * Returns a function that computes zscore-based normalisation.
 *
 * ```js
 * // Calculate necessary components
 * const m = mean(data);
 * const s = standardDeviation(data);
 *
 * // Get the function
 * const fn = compute(m, s);
 *
 * // Use it
 * fn(10); // Yields the normalised value
 * ```
 *
 * It can be used to normalise a whole array
 * ```js
 * const normalised = someData.map(fn);
 * ```
 *
 * If you want to calculate for a whole array, use {@link array}.
 * @param mean Mean of data
 * @param standardDeviation Standard deviation of data
 * @returns
 */
declare const compute$1: (mean: number, standardDeviation: number) => (value: number) => number;
/**
 * Returns the an array of normalised values, along with the mean and standard deviation of `array`.
 * If you just want the computed results, use {@link Normalise.ZScore.array}.
 *
 * By default it will compute mean and std.dev based on `array`. If you have these already, they
 * can be passed as options.
 * @param array
 * @returns
 */
declare const arrayWithContext$2: (array: readonly number[] | number[], options?: Partial<ZScoreArrayOptions>) => {
  mean: number;
  standardDeviation: number;
  values: number[];
  original: readonly number[] | number[];
};
/**
 * Returns an array of normalised values using the 'z score' algorithm.
 *
 * By default it will compute mean and std.dev based on `array`. If you have these already, they
 * can be passed as options.
 * @param values
 * @param options
 * @returns
 */
declare const array$2: (values: readonly number[] | number[], options?: Partial<ZScoreArrayOptions>) => number[];
declare namespace normalise_robust_d_exports {
  export { array$1 as array, arrayWithContext$1 as arrayWithContext, compute };
}
/**
 * Calculates 'robust scaling' of a single value, `x`, based on provided mean and standard deviation.
 *
 * ```js
 * const m = median(someData);
 * const i = interquartileRange(someData);
 * const fn = compute(m, i);
 *
 * // Use normaliser function
 * fn(10);
 * ```
 * If you want to calculate for a whole array, use {@link array}.
 * @param median Median of data
 * @param iqr Interquartile range of data
 * @returns
 */
declare const compute: (median: number, iqr: number) => (value: number) => number;
/**
 * Returns the an array of normalised values, along with the mean and standard deviation of `array`.
 * If you just want the computed results, use {@link Normalise.Robust.array}.
 *
 * By default it will compute mean and std.dev based on `array`. If you have these already, they
 * can be passed as options.
 * @param array
 * @returns
 */
declare const arrayWithContext$1: (array: readonly number[] | number[], options?: Partial<RobustArrayOptions>) => {
  median: number;
  iqr: number;
  values: number[];
  original: number[];
};
/**
 * Returns an array of normalised values using the 'z score' algorithm.
 *
 * By default it will compute mean and std.dev based on `array`. If you have these already, they
 * can be passed as options.
 * @param values
 * @param options
 * @returns
 */
declare const array$1: (values: readonly number[] | number[], options?: Partial<RobustArrayOptions>) => number[];
declare namespace normalise_d_exports {
  export { normalise_minmax_d_exports as MinMax, MinMaxArrayOptions, MinMaxStreamOptions, NormalisationArrayOptions, NormalisationStrategy, NormalisationStreamOptions, NormalisationStreamStrategy, NormaliseStreamContext, normalise_robust_d_exports as Robust, RobustArrayOptions, normalise_zscore_d_exports as ZScore, ZScoreArrayOptions, array, arrayWithContext, stream, streamWithContext };
}
/**
 * Normalises numbers with additional context on the range.
 *
 * For more details, see:
 * * {@link MinMax.streamWithContext}
 *
 * @param strategy
 * @param options
 * @returns
 */
declare const streamWithContext: (strategy: NormalisationStreamStrategy, options?: Partial<NormalisationStreamOptions>) => NormaliseStreamContext;
/**
 * Normalises numbers. Return values will be in the range of 0-1 (inclusive).
 *
 * [ixfx Guide on Normalising](https://ixfx.fun/cleaning/normal/)
 *
 * Use {@link streamWithContext} if you want to be able to check the min/max or reset the normaliser.
 *
 * @example
 * ```js
 * const s = Normalise.stream(`minmax`);
 * s(2);    // 1 (because 2 is highest seen)
 * s(1);    // 0 (because 1 is the lowest so far)
 * s(1.5);  // 0.5 (50% of range 1-2)
 * s(0.5);  // 0 (because it's the new lowest)
 * ```
 *
 * For more details, see:
 * * {@link MinMax.stream}
 * @returns
 */
declare const stream: (strategy?: NormalisationStreamStrategy, options?: Partial<NormalisationStreamOptions>) => (value: number) => number;
/**
 * Normalise an array of values with added context, depending on strategy.
 *
 * Strategies are available: minmax, zscore & robust
 *
 * [ixfx Guide on Normalising](https://ixfx.fun/cleaning/normal/)
 *
 * Use {@link array} to get back the min/max/range and original values
 *
 * ```js
 * const { values, min, max, range } = Normalise.arrayWithContext(`minmax`, [5,1,0,9,10]);
 * // values will be normalised output
 * ```
 *
 * For more details, see:
 * * {@link MinMax.array}
 * * {@link ZScore.array}
 * * {@link Robust.array}
 * @param strategy
 * @param values
 * @param options
 * @returns
 */
declare const arrayWithContext: (strategy: NormalisationStrategy, values: readonly number[], options?: Partial<NormalisationArrayOptions>) => {
  mean: number;
  standardDeviation: number;
  values: number[];
  original: readonly number[] | number[];
} | {
  values: number[];
  original: any[];
  min: number;
  max: number;
  range: number;
} | {
  median: number;
  iqr: number;
  values: number[];
  original: number[];
};
/**
 * Normalise an array of values.
 *
 * Strategies are available: minmax, zscore & robust
 *
 * [ixfx Guide on Normalising](https://ixfx.fun/cleaning/normal/)
 *
 * Use {@link arrayWithContext} to get back the min/max/range and original values
 *
 * ```js
 * // Yields: [0.5, 0.1, 0.0, 0.9, 1]
 * Normalise.array(`minmax`, [5,1,0,9,10]);
 * ```
 *
 * For more details, see:
 * * {@link MinMax.array} [Wikipedia](https://en.wikipedia.org/wiki/Feature_scaling#Rescaling_(min-max_normalization))
 * * {@link ZScore.array} [Wikipedia](https://en.wikipedia.org/wiki/Feature_scaling#Standardization_(Z-score_Normalization))
 * * {@link Robust.array} [Wikipedia](https://en.wikipedia.org/wiki/Feature_scaling#Robust_Scaling)
 *
 * @param strategy
 * @param values
 * @param options
 * @returns
 */
declare const array: (strategy: NormalisationStrategy, values: readonly number[], options?: Partial<NormalisationArrayOptions>) => number[];
//#endregion
//#region ../packages/numbers/src/number-array-compute.d.ts
/**
 * Calculate the min, max, total, average and count of input array `data`.
 * ```js
 * const { total, min, max, avg, count } = numberArrayCompute([ 1, 2, 3 ]);
 * ```
 * @param data
 * @param opts
 * @returns
 */
declare const numberArrayCompute: (data: (number | undefined)[] | readonly (number | undefined)[], opts?: NumbersComputeOptions) => NumbersComputeResult;
//#endregion
//#region ../packages/numbers/src/numeric-arrays.d.ts
/**
 * Applies a function `fn` to the elements of an array, weighting them based on their relative position.
 *
 * ```js
 * // Six items
 * weight([1,1,1,1,1,1], Modulation.gaussian());
 *
 * // Yields:
 * // [0.02, 0.244, 0.85, 0.85, 0.244, 0.02]
 * ```
 *
 * `fn` is expected to map (0..1) => (0..1), such as an easing function. The input to the
 * `fn` is the relative position of an element. Thus the first element will be 0, the middle 0.5 and so on.
 * The output of `fn` is then multiplied by the original value.
 *
 * In the below example (which is also the default if `fn` is not specified), the relative position is
 * how values are weighted:
 *
 * ```js
 * weight([1,1,1,1,1,1], (relativePos) => relativePos);
 * // Yields:
 * // [0, 0.2, 0.4, 0.6, 0.8, 1]
 * ```
 *
 * Throws TypeError if `data` is not an array or for any element not a number.
 * @param data Array of numbers
 * @param fn Returns a weighting based on the given relative position. If unspecified, `(x) => x` is used.
 */
declare const weight: (data: number[] | readonly number[], fn?: (relativePos: number) => number) => number[];
/**
 * Returns an array of all valid numbers from `data`
 *
 * @param data
 * @returns
 */
declare const validNumbers: (data: readonly number[]) => number[];
/**
 * Returns the dot product of arbitrary-sized arrays. Assumed they are of the same length.
 * @param values
 * @param nonNumber What to do if array contains an invalid number. Error: throw an exception, 'treat-as-zero' use as 0 instead, 'ignore', let math run with invalid number
 * @returns
 */
declare const dotProduct: (values: readonly (readonly number[])[], nonNumber?: `error` | `treat-as-zero` | `ignore`) => number;
/**
 * Calculates the average of all numbers in an array.
 * Array items which aren't a valid number are ignored and do not factor into averaging.
 *
 * Use {@link numberArrayCompute} if you want min, max and total as well.
 *
 * @example
 * ```js
 * // Average of a list
 * const avg = Numbers.average([1, 1.4, 0.9, 0.1]);
 *
 * // Average of a variable
 * const data = [100,200];
 * Numbers.average(data);
 * ```
 *
 * @see {@link averageWeighted} To weight items based on position in array
 * @param data Data to average.
 * @returns Average of array
 */
declare const average: (data: readonly number[]) => number;
/**
 * Returns the minimum number out of `data`.
 * Undefined and non-numbers are silently ignored.
 *
 * ```js
 * Numbers.min([10, 20, 0]); // Yields 0
 * ```
 * @param data
 * @returns Minimum number
 */
declare const min: (data: readonly number[]) => number;
/**
 * Returns the index of the largest value.
 * ```js
 * const v = [ 10, 40, 5 ];
 * Numbers.maxIndex(v); // Yields 1
 * ```
 * @param data Array of numbers
 * @returns Index of largest value
 */
declare const maxIndex: (data: readonly number[]) => number;
/**
 * Returns the index of the smallest value.
 *
 * ```js
 * const v = [ 10, 40, 5 ];
 * Numbers.minIndex(v); // Yields 2
 * ```
 * @param data Array of numbers
 * @returns Index of smallest value
 */
declare const minIndex: (data: readonly number[]) => number;
/**
 * Returns the maximum number out of `data`.
 * Undefined and non-numbers are silently ignored.
 *
 * ```js
 * Numbers.max(100, 200, 50); // 200
 * ```
 * @param data List of numbers
 * @returns Maximum number
 */
declare const max: (data: readonly number[]) => number;
/**
 * Returns the total of `data`.
 * Undefined and non-numbers are silently ignored.
 *
 * ```js
 * Numbers.total([1, 2, 3]); // 6
 * ```
 * @param data Array of numbers
 * @returns Total
 */
declare const total: (data: readonly number[]) => number;
/**
 * Returns the maximum out of `data` without pre-filtering for speed.
 *
 * For most uses, {@link max} should suffice.
 *
 * ```js
 * Numbers.maxFast([ 10, 0, 4 ]); // 10
 * ```
 * @param data
 * @returns Maximum
 */
declare const maxFast: (data: readonly number[] | Float32Array) => number;
/**
 * Returns the total of `data` without pre-filtering for speed.
 *
 * For most uses, {@link total} should suffice.
 *
 * ```js
 * Numbers.totalFast([ 10, 0, 4 ]); // 14
 * ```
 * @param data
 * @returns Maximum
 */
declare const totalFast: (data: readonly number[] | Float32Array) => number;
/**
 * Returns the maximum out of `data` without pre-filtering for speed.
 *
 * For most uses, {@link max} should suffice.
 *
 * ```js
 * Numbers.minFast([ 10, 0, 100 ]); // 0
 * ```
 * @param data
 * @returns Maximum
 */
declare const minFast: (data: readonly number[] | Float32Array) => number;
//#endregion
//#region ../packages/numbers/src/proportion.d.ts
/**
 * Scales a percentage-scale number, ie: `v * t`.
 *
 * The utility of this function is that it sanity-checks that
 * both parameters are in the 0..1 scale.
 *
 * Parameters can also be a function that takes no parameters
 * and returns a number. It will be invoked when `proportion` is called.
 * @param v Value
 * @param t Scale amount
 * @returns Scaled value
 */
declare const proportion: (v: number | (() => number), t: number | (() => number)) => number;
//#endregion
//#region ../packages/numbers/src/quantise.d.ts
/**
 * Rounds `v` by `every`. Middle values are rounded up by default.
 *
 * ```js
 * quantiseEvery(11, 10);  // 10
 * quantiseEvery(25, 10);  // 30
 * quantiseEvery(0, 10);   // 0
 * quantiseEvery(4, 10);   // 0
 * quantiseEvery(100, 10); // 100
 * ```
 *
 * Also works with decimals
 * ```js
 * quantiseEvery(1.123, 0.1); // 1.1
 * quantiseEvery(1.21, 0.1);  // 1.2
 * ```
 *
 * @param v Value to quantise
 * @param every Number to quantise to
 * @param middleRoundsUp If _true_ (default), the exact middle rounds up to next step.
 * @returns
 */
declare const quantiseEvery: (v: number, every: number, middleRoundsUp?: boolean) => number;
//#endregion
//#region ../packages/numbers/src/range.d.ts
/**
 * Computes min/max based on a new value and previous range.
 * Returns existing object reference if value is within existing range.
 *
 * If `value` is not a number, by default it will be ignored. Use the 'nonNumberHandling' param to set it
 * to throw an error instead if you want to catch that
 * @param value Value to compare against range
 * @param previous Previous range
 * @param nonNumberHandling 'skip' (default), non numbers are ignored; 'error' an error is thrown
 * @returns
 */
declare function rangeMergeValue(value: number | undefined, previous: NumericRange, nonNumberHandling?: `skip` | `error`): NumericRange;
/**
 * Returns a function that scales values in a range, by default on 0..1 scale.
 * ```js
 * const range = { min: 10, max: 20 }
 * const s = rangeScaler(range);
 * s(15); // 0.5
 * ```
 * @param range Range to scale on
 * @param outMax Output range max. Default: 1
 * @param outMin Output range min. Default: 0
 * @param easing Easing function: Default: none
 * @param clamped Whether input values should be clamped if they exceed range. Default: true
 * @returns
 */
declare function rangeScaler(range: NumericRange, outMax?: number, outMin?: number, easing?: (v: number) => number, clamped?: boolean): NumberScaler;
/**
 * Expands a range to encompass a new range.
 * Returns `existingRange` if `newRange` is within it.
 * @param newRange
 * @param existingRange
 * @returns
 */
declare function rangeMergeRange(newRange: NumericRange, existingRange: NumericRange): NumericRange;
/**
 * Returns an empty range:
 * ```js
 * {
 *  min: Number.MAX_SAFE_INTEGER,
 *  max: Number.MIN_SAFE_INTEGER
 * }
 * ```
 * @returns
 */
declare const rangeInit: () => NumericRange;
/**
 * Returns _true_ if ranges `a` and `b` have identical min/max values.
 * Returns _false_ if not, or if either/both values are _undefined_
 * @param a
 * @param b
 * @returns
 */
declare const rangeIsEqual: (a: NumericRange | undefined, b: NumericRange | undefined) => boolean;
/**
 * Returns _true_ if range 'a' is within or same as range 'b'.
 * Returns _false_ if not or if either/both ranges are _undefined_
 * @param a
 * @param b
 * @returns
 */
declare const rangeIsWithin: (a: NumericRange | undefined, b: NumericRange | undefined) => boolean;
/**
 * Keeps track of min/max values.
 *
 * ```js
 * const s = rangeStream();
 * s.seen(10);  // { min: 10, max: 10}
 * s.seen(5);   // { min:5, max: 10}
 * ```
 *
 * When calling `seen`, non-numbers, or non-finite numbers are silently ignored.
 *
 * ```js
 * s.reset();   // Reset
 * s.min/s.max; // Current min/max
 * s.range;     // Current { min, max }
 * ```
 * @param initWith
 * @returns
 */
declare const rangeStream: (initWith?: NumericRange) => {
  seen: (v: any) => {
    min: number;
    max: number;
  };
  reset: () => void;
  readonly range: {
    min: number;
    max: number;
  };
  readonly min: number;
  readonly max: number;
};
/**
 * Iterates over `values` finding the min/max.
 * By default non-numbers, as well as NaN and infinite values are skipped.
 * @param values
 * @param nonNumberHandling
 * @returns
 */
declare function rangeCompute(values: Iterable<any>, nonNumberHandling?: `skip` | `error`): NumericRange;
//#endregion
//#region ../packages/numbers/src/round.d.ts
declare function round(decimalPlaces: number, v: number, roundUp?: boolean): number;
declare function round(decimalPlaces: number, roundUp?: boolean): (v: number) => number;
//#endregion
//#region ../packages/numbers/src/scale.d.ts
/**
 * Scales `v` from an input range to an output range (aka `map`)
 *
 * For example, if a sensor's useful range is 100-500, scale it to a percentage:
 *
 * ```js
 *
 * scale(sensorReading, 100, 500, 0, 1);
 * ```
 *
 * `scale` defaults to a percentage-range output, so you can get away with:
 * ```js
 * scale(sensorReading, 100, 500);
 * ```
 *
 * If `v` is outside of the input range, it will likewise be outside of the output range.
 * Use {@link scaleClamped} to clip value to range.
 *
 * If inMin and inMax are equal, outMax will be returned.
 *
 * An easing function can be provided for non-linear scaling. In this case
 * the input value is 'pre scaled' using the function before it is applied to the
 * output range.
 *
 * ```js
 * scale(sensorReading, 100, 500, 0, 1, Easings.gaussian());
 * ```
 * @param v Value to scale
 * @param inMin Input minimum
 * @param inMax Input maximum
 * @param outMin Output minimum. If not specified, 0
 * @param outMax Output maximum. If not specified, 1
 * @param easing Easing function
 * @returns Scaled value
 */
declare const scale: (v: number, inMin: number, inMax: number, outMin?: number, outMax?: number, easing?: (v: number) => number) => number;
/**
 * Returns a scaling function
 * @param inMin Input minimum
 * @param inMax Input maximum
 * @param outMin Output minimum. If not specified, 0
 * @param outMax Output maximum. If not specified, 1
 * @param easing Easing function
 * @param clamped If true, value is clamped. Default: false
 * @returns
 */
declare const scaler: (inMin: number, inMax: number, outMin?: number, outMax?: number, easing?: (v: number) => number, clamped?: boolean) => NumberScaler;
/**
 * Returns a 'null' scaler that does nothing - the input value is returned as output.
 * @returns
 */
declare const scalerNull: () => NumberScaler;
/**
 * As {@link scale}, but result is clamped to be
 * within `outMin` and `outMax`.
 *
 * @param v
 * @param inMin
 * @param inMax
 * @param outMin 1 by default
 * @param outMax 0 by default d
 * @param easing
 * @returns
 */
declare const scaleClamped: (v: number, inMin: number, inMax: number, outMin?: number, outMax?: number, easing?: (v: number) => number) => number;
/**
 * Scales an input percentage to a new percentage range.
 *
 * If you have an input percentage (0-1), `scalePercentageOutput` maps it to an
 * _output_ percentage of `outMin`-`outMax`.
 *
 * ```js
 * // Scales 50% to a range of 0-10%
 * scalePercentages(0.5, 0, 0.10); // 0.05 - 5%
 * ```
 *
 * An error is thrown if any parameter is outside of percentage range. This added
 * safety is useful for catching bugs. Otherwise, you could just as well call
 * `scale(percentage, 0, 1, outMin, outMax)`.
 *
 * If you want to scale some input range to percentage output range, just use `scale`:
 * ```js
 * // Yields 0.5
 * scale(2.5, 0, 5);
 * ```
 * @param percentage Input value, within percentage range
 * @param outMin Output minimum, between 0-1
 * @param outMax Output maximum, between 0-1
 * @returns Scaled value between outMin-outMax.
 */
declare const scalePercentages: (percentage: number, outMin: number, outMax?: number) => number;
/**
 * Scales an input percentage value to an output range
 * If you have an input percentage (0-1), `scalePercent` maps it to an output range of `outMin`-`outMax`.
 * ```js
 * scalePercent(0.5, 10, 20); // 15
 * ```
 *
 * @see {@link scalerPercent} Returns a function
 * @param v Value to scale
 * @param outMin Minimum for output
 * @param outMax Maximum for output
 * @returns
 */
declare const scalePercent: (v: number, outMin: number, outMax: number) => number;
/**
 * Returns a function that scales an input percentage value to an output range
 * @see {@link scalePercent} Calculates value
 * @param outMin
 * @param outMax
 * @returns Function that takes a single argument
 */
declare const scalerPercent: (outMin: number, outMax: number) => (v: number) => number;
/**
 * Returns a two-way scaler
 * ```js
 * // Input range 0..100, output range 0..1
 * const s = scalerTwoWay(0,100,0,1);
 *
 * // Scale from input to output
 * s.out(50); // 0.5
 *
 * // Scale from output range to input
 * s.in(1); // 100
 * ```
 * @param inMin
 * @param inMax
 * @param outMin
 * @param outMax
 * @returns
 */
declare const scalerTwoWay: (inMin: number, inMax: number, outMin?: number, outMax?: number, clamped?: boolean, easing?: (v: number) => number) => NumberScalerTwoWay;
//#endregion
//#region ../packages/numbers/src/softmax.d.ts
/**
 * Via: https://gist.github.com/cyphunk/6c255fa05dd30e69f438a930faeb53fe
 * @param logits
 * @returns
 */
declare const softmax: (logits: number[]) => number[];
//#endregion
//#region ../packages/numbers/src/standard-deviation.d.ts
/**
 * Calculates the standard deviation of an array of numbers.
 *
 * If you already have the mean value of the array, this can be passed in.
 * Otherwise it will be computed.
 *
 * If `usePopulation` is true, `array` is assumed to be the entire population (same as Excel's STDEV.P function)
 * Otherwise, it's like Excel's STDEV.S function which assumes data represents a sample of entire population.
 *
 * @param array Array of values
 * @param meanValue Mean value if pre-computed, otherwise skip this parameter for it to be computed automatically
 * @param usePopulation If _true_ result is similar to Excel's STDEV.P. Otherwise like STDEV.S
 * @returns
 */
declare const standardDeviation: (array: number[], usePopulation?: boolean, meanValue?: number) => number;
//#endregion
//#region ../packages/numbers/src/track-simple.d.ts
/**
 * Track values
 *
 * When not yet used:
 *  total: 0
 *  count: 0
 *  min: MAX_SAFE_INTEGER,
 *  max: MIN_SAFE_INTEGER
 * @returns
 */
declare const trackSimple: () => {
  seen: (v: number) => void;
  reset: () => void;
  rangeToString: (digits?: number) => string;
  readonly avg: number;
  readonly min: number;
  readonly max: number;
  readonly total: number;
  readonly count: number;
};
//#endregion
//#region ../packages/numbers/src/wrap.d.ts
/**
 * Wraps an integer number within a specified range, defaulting to degrees (0-360). Use {@link wrap} for floating-point wrapping.
 *
 * This is useful for calculations involving degree angles and hue, which wrap from 0-360.
 * Eg: to add 200 to 200, we don't want 400, but 40.
 *
 * ```js
 * const v = wrapInteger(200+200, 0, 360); // 40
 * ```
 *
 * Or if we minus 100 from 10, we don't want -90 but 270
 * ```js
 * const v = wrapInteger(10-100, 0, 360); // 270
 * ```
 *
 * `wrapInteger` uses 0-360 as a default range, so both of these
 * examples could just as well be:
 *
 * ```js
 * wrapInteger(200+200);  // 40
 * wrapInteger(10-100);  // 270
 * ```
 *
 * Non-zero starting points can be used. A range of 20-70:
 * ```js
 * const v = wrapInteger(-20, 20, 70); // 50
 * ```
 *
 * Note that the minimum value is inclusive, while the maximum is _exclusive_.
 * So with the default range of 0-360, 360 is never reached:
 *
 * ```js
 * wrapInteger(360); // 0
 * wrapInteger(361); // 1
 * ```
 *
 * If you just want to lock values to a range without wrapping, consider {@link clamp}.
 *
 * @param v Value to wrap
 * @param min Integer minimum of range (default: 0). Inclusive
 * @param max Integer maximum of range (default: 360). Exlusive
 * @returns
 */
declare const wrapInteger: (v: number, min?: number, max?: number) => number;
/**
 * Wraps floating point numbers to be within a range (default: 0..1). Use {@link wrapInteger} if you want to wrap integer values.
 *
 * This logic makes sense for some things like rotation angle.
 *
 * If you just want to lock values to a range without wrapping, consider {@link clamp}.
 *
 * ```js
 * wrap(1.2);   // 0.2
 * wrap(2);     // 1.0
 * wrap(-0.2); // 0.8
 * ```
 *
 * A range can be provided too:
 * ```js
 * wrap(30, 20, 50);  	 // 30
 * wrap(60, 20, 50);    //  30
 * ```
 * @param v
 * @param min
 * @param max
 * @returns
 */
declare const wrap: (v: number, min?: number, max?: number) => number;
/**
 * Performs a calculation within a wrapping number range. This is a lower-level function.
 * See also: {@link wrapInteger} for simple wrapping within a range.
 *
 * `min` and `max` define the start and end of the valid range, inclusive. Eg for hue degrees it'd be 0, 360.
 * `a` and `b` is the range you want to work in.
 *
 * For example, let's say you want to get the middle point between a hue of 30 and a hue of 330 (ie warmer colours):
 * ```js
 * wrapRange(0,360, (distance) => {
 *  // for a:0 and b:330, distance would be 90 from 30 degrees to 330 (via zero)
 *  return distance * 0.5; // eg return middle point
 * }, 30, 330);
 * ```
 *
 * The return value of the callback should be in the range of 0-distance. `wrapRange` will subsequently
 * conform it to the `min` and `max` range before it's returned to the caller.
 *
 * @param a Output start (eg. 60)
 * @param b Output end (eg 300)
 * @param min Range start (eg 0)
 * @param max Range end (eg 360)
 * @param fn Returns a computed value from 0 to `distance`.
 * @returns
 */
declare const wrapRange: (min: number, max: number, fn: (distance: number) => number, a: number, b: number) => number;
//#endregion
export { BasicInterpolateOptions, bipolar_d_exports as Bipolar, BipolarWrapper, DifferenceKind, Kalman1dFilter, Kalman1dFilterOptions, MovingAverageNanOptions, MovingAverageOptions, normalise_d_exports as Normalise, NumberScaler, NumberScalerTwoWay, NumbersComputeOptions, NumbersComputeResult, NumericRange, applyToValues, average, averageWeigher, averageWeighted, clamp, clampIndex, clamper, computeIsOutlier, count, differenceFromFixed, differenceFromLast, dotProduct, filterIterable, flip, getQuantile, interpolate, interpolateAngle, interpolatorStepped, interquartileRange, isApprox, isCloseToAny, isValid, kalman1dFilter, linearSpace, max, maxAbs, maxFast, maxIndex, mean, median, min, minFast, minIndex, movingAverage, movingAverageLight, movingAverageWithContext, noiseFilter, numberArrayCompute, numericPercent, numericRange, numericRangeRaw, proportion, quantiseEvery, rangeCompute, rangeInclusive, rangeInit, rangeIsEqual, rangeIsWithin, rangeMergeRange, rangeMergeValue, rangeScaler, rangeStream, round, scale, scaleClamped, scalePercent, scalePercentages, scaler, scalerNull, scalerPercent, scalerTwoWay, softmax, standardDeviation, thresholdAtLeast, total, totalFast, trackSimple, validNumbers, weight, wrap, wrapInteger, wrapRange };