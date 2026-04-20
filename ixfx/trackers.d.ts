import { a as KeyValue, f as ToString, i as Interval } from "./types-DhLXV-YQ.js";
import { t as KeyValueSortSyles } from "./key-value-BSRo0gIs.js";
import { t as SimpleEventEmitter } from "./simple-event-emitter-B_mKSo1Q.js";
import { a as NumbersComputeResult } from "./types-DtDff87L.js";
import { a as TimestampedObject, c as TrimReason, i as Timestamped, n as ObjectTracker, o as TimestampedPrimitive, r as TrackerBase, s as TrackedValueOpts, t as TrackedValueMap } from "./tracked-value-Cpuv4L6f.js";
import { i as PrimitiveTracker, n as NumberTrackerResults, r as number, t as NumberTracker } from "./number-tracker-DbBenkRM.js";

//#region ../packages/trackers/src/changes.d.ts
type TrackChangeResult = {
  /**
   * If value has changed
   */
  changed: boolean;
  /**
   * Number of times value has changed for duration of monitor
   */
  changes: number;
  /**
   * Number of times the same value has come
   * up in a row
   */
  identicalRun: number;
  /**
   * Number of values total
   */
  total: number;
};
type TrackChangeOptions<T> = {
  includeFirstValueInCount: boolean;
  initial: T;
};
type TrackNumberChangeOptions = TrackChangeOptions<number> & {
  nanHandling: `allow` | `skip` | `error`;
};
/**
 * Run a function if a value changes
 * ```js
 * const r = handleChangeResult(trackNumberChange, (value) => {
 *  // Called when value changes
 * });
 * r(10);
 * ```
 * @param monitor
 * @param onChanged
 * @param onNotChanged
 * @returns
 */
declare function handleChangeResult<T>(monitor: (v: T) => TrackChangeResult, onChanged: (v: T, countChanges: number, countTotal: number) => void, onNotChanged?: (v: T, countIdentical: number, countTotal: number) => void): (v: T) => void;
/**
 * Returns a function to monitor value changes.
 * ```js
 * const f = trackNumberChange(true);
 * f(10); // { changed: true, changesCount: 1 }
 * f(10); // { changed: false, changesCount: 1 }
 * ```
 *
 * Default options:
 * * nanHandling: error
 * * includeFirstValueInCount: false
 *
 * NaN handling:
 * * allow: use NaN value as a legal value and report a change
 * * skip: ignore NaN values, reporting back no change and use the same changes count
 * * error: throw an error if a NaN value is received
 *
 *
 * @returns
 */
declare function trackNumberChange(options?: Partial<TrackNumberChangeOptions>): (v: number) => TrackChangeResult;
/**
 * Returns a function to track changes in a boolean value
 * ```js
 * const t = trackBooleanChange();
 * t(true); // { changed:false }
 * t(true); // { changed:false }
 * t(false); // { changed: true }
 * ```
 *
 * Default options:
 * * includeFirstValueInCount: false
 * @param options
 * @returns
 */
declare function trackBooleanChange(options?: Partial<TrackChangeOptions<boolean>>): (v: boolean) => TrackChangeResult;
//#endregion
//#region ../packages/trackers/src/frequency-mutable.d.ts
type FrequencyEventMap = {
  readonly change: {
    context: unknown;
  };
};
/**
 * Wraps a {@link FrequencyTracker}, but ignores values that come from the same source.
 */
declare class GatedFrequencyTracker<T> {
  readonly ft: FrequencyTracker<T>;
  readonly sources: Set<string>;
  constructor(keyString?: ToString<T>);
  add(value: T, source: string): void;
  clear(): void;
}
/**
 * Frequency keeps track of how many times a particular value is seen, but
 * unlike a Map it does not store the data. By default compares
 * items by value (via JSON.stringify).
 *
 * Fires `change` event when items are added or it is cleared.
 *
 * Overview
 * ```
 * const fh = new FrequencyTracker();
 * fh.add(value); // adds a value
 * fh.clear();    // clears all data
 * fh.keys() / .values() // returns an iterator for keys and values
 * fh.toArray();  //  returns an array of data in the shape [[key,freq],[key,freq]...]
 * ```
 *
 * Usage
 * ```
 * const fh = new FrequencyTracker();
 * fh.add(`apples`); // Count an occurence of `apples`
 * fh.add(`oranges)`;
 * fh.add(`apples`);
 *
 * const fhData = fh.toArray(); // Expect result [[`apples`, 2], [`oranges`, 1]]
 * fhData.forEach((d) => {
 *  const [key,freq] = d;
 *  console.log(`Key '${key}' occurred ${freq} time(s).`);
 * })
 * ```
 *
 * Custom key string
 * ```
 * const fh = frequency( person => person.name);
 * // All people with name `Samantha` will be counted in same group
 * fh.add({name:`Samantha`, city:`Brisbane`});
 * ```
 * @typeParam V - Type of items
 */
declare class FrequencyTracker<V> extends SimpleEventEmitter<FrequencyEventMap> {
  #private;
  /**
   * Constructor
   * @param keyString Function to key items. Uses JSON.stringify by default
   */
  constructor(keyString?: ToString<V>);
  /**
   * Clear data. Fires `change` event
   */
  clear(): void;
  /**
   * @returns Iterator over keys (ie. groups)
   */
  keys(): IterableIterator<string>;
  /**
   * @returns Iterator over frequency counts
   */
  values(): IterableIterator<number>;
  /**
   * @returns Copy of entries as an array of `[key, count]`
   */
  toArray(): [key: string, count: number][];
  /**
   * Returns a string with keys and counts, useful for debugging.
   * @returns
   */
  debugString(): string;
  /**
   *
   * @param value Value to count
   * @returns Frequency of value, or _undefined_ if it does not exist
   */
  frequencyOf(value: V | string): number | undefined;
  /**
   * Gets the relative frequency of `value`.
   * @param value Value to count
   * @returns Relative frequency of `value`, or _undefined_ if it does not exist
   */
  relativeFrequencyOf(value: V | string): number | undefined;
  /**
   * Returns copy of entries as an array
   * @returns Copy of entries as an array
   */
  entries(): Generator<[string, number], void, unknown>;
  /**
   * Yields key-value pairs, passing through the filter predicate
   * @param predicate
   */
  filterByTally(predicate: (tally: number) => boolean): Generator<[string, number], void, unknown>;
  /**
  * Yields key-value pairs, passing through the filter predicate.
  *
  * Passes a relative tally amount
  * ```js
  * // Get all key-value pairs where tally is 10% of total
  * for (const kv of fm.filterByRelativeTally(t=>t>0.1)) {
  * }
  * ```
  * @param predicate
  */
  filterByRelativeTally(predicate: (tally: number) => boolean): Generator<[string, number], void, unknown>;
  /**
   * Calculate min,max,avg,total & count from values
   * @returns Returns `{min,max,avg,total}`
   */
  computeValues(): NumbersComputeResult;
  /**
   * Return entries sorted
   * @param sortStyle Sorting style (default: _value_, ie. count)
   * @returns Sorted array of [key,frequency]
   */
  entriesSorted(sortStyle?: KeyValueSortSyles): KeyValue[];
  /**
   * Add one or more values, firing _change_ event.
   * @param values Values to add. Fires _change_ event after adding item(s)
   */
  add(...values: V[]): void;
}
declare const frequency: <V>(keyString?: ToString<V>) => FrequencyTracker<V>;
//#endregion
//#region ../packages/trackers/src/interval-tracker.d.ts
/**
 * A `Tracker` that tracks interval between calls to `mark()`
 */
declare class IntervalTracker extends NumberTracker {
  lastMark: number;
  mark(): void;
  onReset(): void;
}
/**
 * Returns a new {@link IntervalTracker} instance. IntervalTracker
 * records the interval between each call to `mark`.
 *
 * ```js
 * import { interval } from '@ixfx/trackers.js';
 *
 * const t = interval();
 *
 * // Call `mark` to record an interval
 * t.mark();
 * ...
 * t.mark();
 *
 * // Get average time in milliseconds between calls to `mark`
 * t.avg;
 *
 * // Longest and shortest times are available too...
 * t.min / t.max
 * ```
 *
 * Interval tracker can automatically reset after a given number of samples:
 *
 * ```
 * // Reset after 100 samples
 * const t = interval({ resetAfterSamples: 100} );
 * ```
 * @param options Options for tracker
 * @returns New interval tracker
 */
declare const interval: (options?: TrackedValueOpts) => IntervalTracker;
//#endregion
//#region ../packages/trackers/src/rate-tracker.d.ts
type RateTrackerOpts = Readonly<{
  /**
  * If above zero, tracker will reset after this many samples
  */
  resetAfterSamples?: number;
  /**
   * If set, tracker will reset after this much time
   * since last `mark()` call.
   */
  timeoutInterval?: Interval;
  /**
   * If above zero, there will be a limit to intermediate values kept.
   *
   * When the seen values is twice `sampleLimit`, the stored values will be trimmed down
   * to `sampleLimit`. We only do this when the values are double the size so that
   * the collections do not need to be trimmed repeatedly whilst we are at the limit.
   *
   * Automatically implies storeIntermediate
   */
  sampleLimit?: number;
}>;
/**
 * Tracks the rate of events.
 * It's also able to compute the min,max and average interval between events.
 *
 * @example
 * ```js
 * const clicks = Trackers.rate();
 *
 * // Mark when a click happens
 * document.addEventListener(`click`, () => clicks.mark());
 *
 * // Get details
 * clicks.perSecond; // How many clicks per second
 * clicks.perMinute; // How many clicks per minute
 * ```
 *
 * `timeoutInterval` is a useful option to make the tracker reset
 * after some period without `mark()` being called.
 *
 * Another useful option is `sampleLimit`, which sets an upper bound
 * for how many events to track. A smaller value means the results
 * will more accurately track, but it might be less smooth.
 *
 * ```js
 * // Eg reset tracker after 5 seconds of inactivity
 * const clicks = Trackers.rate({
 *  sampleLimit: 10,
 *  timeoutInterval: { secs: 5 }
 * });
 * ```
 */
declare class RateTracker {
  #private;
  constructor(opts?: Partial<RateTrackerOpts>);
  /**
   * Mark that an event has happened
   */
  mark(): void;
  /**
   * Compute {min,max,avg} for the interval _between_ events.
   * @returns
   */
  computeIntervals(): {
    min: number;
    max: number;
    avg: number;
  };
  /**
   * Returns the time period (in milliseconds) that encompasses
   * the data set. Eg, a result of 1000 means there's data that
   * covers a one second period.
   */
  get elapsed(): number;
  /**
   * Resets the tracker.
   */
  reset(): void;
  /**
   * Get the number of events per second
   */
  get perSecond(): number;
  /**
   * Get the number of events per minute
   */
  get perMinute(): number;
}
/**
 * @inheritdoc RateTracker
 * @param opts
 * @returns
 */
declare const rate: (opts?: Partial<RateTrackerOpts>) => RateTracker;
//#endregion
export { FrequencyEventMap, FrequencyTracker, GatedFrequencyTracker, IntervalTracker, NumberTracker, NumberTrackerResults, ObjectTracker, PrimitiveTracker, RateTracker, RateTrackerOpts, Timestamped, TimestampedObject, TimestampedPrimitive, TrackChangeOptions, TrackChangeResult, TrackNumberChangeOptions, TrackedValueMap, TrackedValueOpts, TrackerBase, TrimReason, frequency, handleChangeResult, interval, number, rate, trackBooleanChange, trackNumberChange };