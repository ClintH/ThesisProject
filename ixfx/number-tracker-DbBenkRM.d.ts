import { c as TrimReason, o as TimestampedPrimitive, r as TrackerBase, s as TrackedValueOpts } from "./tracked-value-Cpuv4L6f.js";

//#region ../packages/trackers/src/primitive-tracker.d.ts
declare abstract class PrimitiveTracker<V extends number | string, TResult> extends TrackerBase<V, TResult> {
  values: V[];
  timestamps: number[];
  constructor(opts?: TrackedValueOpts);
  /**
   * Reduces size of value store to `limit`. Returns
   * number of remaining items
   * @param limit
   */
  trimStore(limit: number): number;
  onTrimmed(reason: TrimReason): void;
  get last(): V | undefined;
  get initial(): V | undefined;
  /**
   * Returns number of recorded values (this can include the initial value)
   */
  get size(): number;
  /**
   * Returns the elapsed time, in milliseconds since the instance was created
   */
  get elapsed(): number;
  /**
   * Returns the time, in milliseconds, covering the initial and last values.
   * Returns NaN if either of these is missing.
   */
  get timespan(): number;
  onReset(): void;
  /**
   * Tracks a value
   */
  filterData(rawValues: V[]): TimestampedPrimitive<V>[];
}
//#endregion
//#region ../packages/trackers/src/number-tracker.d.ts
type NumberTrackerResults = {
  readonly total: number;
  readonly min: number;
  readonly max: number;
  readonly avg: number;
};
declare class NumberTracker extends PrimitiveTracker<number, NumberTrackerResults> {
  #private;
  /**
   * Difference between last value and initial.
   * Eg. if last value was 10 and initial value was 5, 5 is returned (10 - 5)
   * If either of those is missing, undefined is returned
   */
  difference(): number | undefined;
  /**
   * Relative difference between last value and initial.
   * Eg if last value was 10 and initial value was 5, 2 is returned (200%)
   */
  relativeDifference(): number | undefined;
  onReset(): void;
  /**
   * When trimmed, recomputes to set total/min/max to be based on
   * current values.
   * @param reason
   */
  onTrimmed(reason: TrimReason): void;
  computeResults(values: TimestampedPrimitive<number>[]): NumberTrackerResults;
  getMinMaxAvg(): {
    min: number;
    max: number;
    avg: number;
  };
  get max(): number;
  get total(): number;
  get min(): number;
  get avg(): number;
}
/**
 * Keeps track of the total, min, max and avg in a stream of values. By default values
 * are not stored.
 *
 * Usage:
 *
 * ```js
 * import { number } from '@ixfx/trackers.js';
 *
 * const t = number();
 * t.seen(10);
 *
 * t.avg / t.min/ t.max
 * t.initial; // initial value
 * t.size;    // number of seen values
 * t.elapsed; // milliseconds since intialisation
 * t.last;    // last value
 * ```
 *
 * To get `{ avg, min, max, total }`
 * ```
 * t.getMinMax()
 * ```
 *
 * Use `t.reset()` to clear everything.
 *
 * Trackers can automatically reset after a given number of samples
 * ```
 * // reset after 100 samples
 * const t = number({ resetAfterSamples: 100 });
 * ```
 *
 * To store values, use the `storeIntermediate` option:
 *
 * ```js
 * const t = number({ storeIntermediate: true });
 * ```
 *
 * Difference between last value and initial value:
 * ```js
 * t.relativeDifference();
 * ```
 *
 * Get raw data (if it is being stored):
 * ```js
 * t.values; // array of numbers
 * t.timestampes; // array of millisecond times, indexes correspond to t.values
 * ```
 */
declare const number: (opts?: TrackedValueOpts) => NumberTracker;
//#endregion
export { PrimitiveTracker as i, NumberTrackerResults as n, number as r, NumberTracker as t };