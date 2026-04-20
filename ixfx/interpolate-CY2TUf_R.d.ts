import { i as Interval } from "./types-DhLXV-YQ.js";
import { a as HasCompletion } from "./continuously-BdZhuIkm.js";
import { r as Point } from "./point-type-DLbh1Hzz.js";
import { t as BasicInterpolateOptions } from "./interpolate-CCr7T6z3.js";

//#region ../packages/modulation/src/types.d.ts
type ModSettableOptions = {
  /**
   * Starting absolute value of source.
   */
  startAt: number;
  /**
   * Starting relative value of source (eg 0.5 for 50%)
   */
  startAtRelative: number;
  /**
   * If set, determines how many cycles. By default unlimited.
   * Use 1 for example for a one-shot wave.
   */
  cycleLimit: number;
  /**
   * Function that returns current time in milliseconds.
   * Defaults to `performance.now`. Useful for testing.
   */
  timeSource: () => number;
};
type ModSettableFeedback = {
  /**
   * If set, resets absolute position of clock
   */
  resetAt: number;
  /**
   * If set, resets relative position of clock
   */
  resetAtRelative: number;
};
type ModSettable = (feedback?: Partial<ModSettableFeedback>) => number;
/**
 * A mod source returns numbers on a 0..1 scale.
 * Usually invoked just a function, some sources also support
 * 'feedback' allowing source to be adjusted dynamically.
 *
 * See Modulation.Sources for more.
 */
type ModSource = (feedback?: any) => number;
/**
 * A function that modulates `v`.
 *
 * Example modulators:
 * * {@link wave}: Generate different wave shapes
 * * Raw access to waves: {@link arcShape}, {@link sineShape},{@link sineBipolarShape}, {@link triangleShape}, {@link squareShape}
 * * {@link Easings}: Easing functions
 * * {@link springShape}: Spring
 */
type ModFunction = (v: number) => number;
type ModulatorTimed = HasCompletion & {
  /**
   * Computes the current value of the easing
   *
   * @returns {number}
   */
  compute(): number;
  /**
   * Reset the easing
   */
  reset(): void;
  /**
   * Returns true if the easing is complete
   *
   * @returns {boolean}
   */
  get isDone(): boolean;
};
type SpringOptions = Partial<{
  /**
   * How much 'weight' the spring has.
   * Favour adjusting 'damping' or 'stiffness' before changing mass.
   * Default: 1
   */
  readonly mass: number;
  /**
   * Absorbs the energy, acting as a kind of friction. Helps
   * to avoid oscillations where the spring doesn't 'end'
   * Default: 10
   */
  readonly damping: number;
  /**
   * How bouncy the spring is
   * Default: 100
   */
  readonly stiffness: number;
  /**
   * Default: false
   */
  readonly soft: boolean;
  /**
   * Default: 0.1
   */
  readonly velocity: number;
  /**
   * How many iterations to wait for spring settling. Longer values may be
   * needed if it seems the spring gets prematurely cut off.
   * Default: 10
   */
  readonly countdown: number;
}>;
declare namespace easings_named_d_exports {
  export { arch, backIn, backInOut, backOut, bell, bounceIn, bounceInOut, bounceOut, circIn, circInOut, circOut, cubicIn, cubicOut, elasticIn, elasticInOut, elasticOut, expoIn, expoInOut, expoOut, quadIn, quadInOut, quadOut, quartIn, quartOut, quintIn, quintInOut, quintOut, sineIn, sineInOut, sineOut, smootherstep, smoothstep };
}
declare const bounceOut: (x: number) => number;
declare const quintIn: (x: number) => number;
declare const quintOut: (x: number) => number;
declare const arch: (x: number) => number;
declare const smoothstep: (x: number) => number;
declare const smootherstep: (x: number) => number;
declare const sineIn: (x: number) => number;
declare const sineOut: (x: number) => number;
declare const quadIn: (x: number) => number;
declare const quadOut: (x: number) => number;
declare const sineInOut: (x: number) => number;
declare const quadInOut: (x: number) => number;
declare const cubicIn: (x: number) => number;
declare const cubicOut: (x: number) => number;
declare const quartIn: (x: number) => number;
declare const quartOut: (x: number) => number;
declare const expoIn: (x: number) => number;
declare const expoOut: (x: number) => number;
declare const quintInOut: (x: number) => number;
declare const expoInOut: (x: number) => number;
declare const circIn: (x: number) => number;
declare const circOut: (x: number) => number;
declare const backIn: (x: number) => number;
declare const backOut: (x: number) => number;
declare const circInOut: (x: number) => number;
declare const backInOut: (x: number) => number;
declare const elasticIn: (x: number) => number;
declare const elasticOut: (x: number) => number;
declare const bounceIn: (x: number) => number;
declare const bell: (t: number) => number;
declare const elasticInOut: (x: number) => number;
declare const bounceInOut: (x: number) => number;
//#endregion
//#region ../packages/modulation/src/easing/line.d.ts
/**
 * Interpolates points along a line.
 * By default it's a straight line, so use `bend` to make a non-linear curve.
 * @param bend -1...1. -1 will pull line up, 1 will push it down.
 * @returns
 */
declare const line: (bend?: number, warp?: number) => (value: number) => Point;
//#endregion
//#region ../packages/modulation/src/easing/types.d.ts
/**
 * Easing name
 */
type EasingName = keyof typeof easings_named_d_exports;
type EasingOptions = (EasingTickOptions | EasingTimeOptions) & {
  name?: EasingName;
  fn?: ModFunction;
};
type EasingTimeOptions = {
  duration: Interval;
};
type EasingTickOptions = {
  ticks: number;
};
declare namespace easing_d_exports {
  export { EasingName, EasingOptions, EasingTickOptions, EasingTimeOptions, easings_named_d_exports as Named, create, get, getEasingNames, line, tickEasing, ticks, time, timeEasing };
}
/**
 * Creates an easing function
 * ```js
 * const e = Easings.create({ duration: 1000, name: `quadIn` });
 * const e = Easings.create({ ticks: 100, name: `sineOut` });
 * const e = Easings.create({
 *  duration: 1000,
 *  fn: (v) => {
 *    // v will be 0..1 based on time
 *    return Math.random() * v
 *  }
 * });
 * ```
 * @param options
 * @returns
 */
declare const create: (options: EasingOptions) => () => number;
/**
 * Creates an easing based on clock time. Time
 * starts being counted when easing function is created.
 *
 * `timeEasing` allows you to reset and check for completion.
 * Alternatively, use {@link time} which is a simple function that just returns a value.
 *
 *
 * @example Time based easing
 * ```
 * const t = Easings.timeEasing(`quintIn`, 5*1000); // Will take 5 seconds to complete
 * ...
 * t.compute(); // Get current value of easing
 * t.reset();   // Reset to 0
 * t.isDone;    // _True_ if finished
 * ```
 *
 * Thisi function is just a wrapper around Modulator.timedModulator.
 * @param nameOrFunction Name of easing, or an easing function
 * @param duration Duration
 * @returns Easing
 */
declare const timeEasing: (nameOrFunction: EasingName | ((v: number) => number), duration: Interval) => ModulatorTimed;
/**
 * Produce easing values over time. When the easing is complete, the final
 * value continues to return. Timer starts when return function is first invoked.
 *
 * If you need to check if an easing is done or reset it, consider {@link timeEasing}.
 *
 * ```js
 * // Quad-in easing over one second
 * const e = Easings.time(`quadIn`, 1000);
 *
 * // Keep calling e() to get the current value
 * e();
 * ```
 *
 * This function is just a wrapper around Modulate.time
 * @param nameOrFunction Easing name or a function that produces 0..1 scale
 * @param duration Duration
 * @returns
 */
declare const time: (nameOrFunction: EasingName | ((v: number) => number), duration: Interval) => () => number;
/**
 * Produce easing values with each invocation. When the easing is complete, the final
 * value continues to return. Timer starts when return function is first invoked.
 *
 * If you need to check if an easing is done or reset it, consider {@link tickEasing}.
 *
 * ```js
 * // Quad-in easing over 100 ticks
 * const e = Easings.ticks(`quadIn`, 100);
 *
 * // Keep calling e() to get the current value
 * e();
 * ```
 *
 * This is just a wrapper around Modulator.ticks
 * @param nameOrFunction Easing name or a function that produces 0..1 scale
 * @param totalTicks Total length of ticks
 * @returns
 */
declare const ticks: (nameOrFunction: EasingName | ((v: number) => number), totalTicks: number) => () => number;
/**
 * Creates an easing based on ticks.
 *
 * `tickEasing` allows you to reset and check for completion.
 * Alternatively, use {@link ticks} which is a simple function that just returns a value.
 *
 * @example Tick-based easing
 * ```
 * const t = Easings.tickEasing(`sineIn`, 1000);   // Will take 1000 ticks to complete
 * t.compute(); // Each call to `compute` progresses the tick count
 * t.reset();   // Reset to 0
 * t.isDone;    // _True_ if finished
 * ```
 * @param nameOrFunction Name of easing, or an easing function
 * @param durationTicks Duration in ticks
 * @returns Easing
 */
declare const tickEasing: (nameOrFunction: EasingName | ((v: number) => number), durationTicks: number) => ModulatorTimed;
/**
 * Returns an easing function by name. Throws an error if
 * easing is not found.
 *
 * ```js
 * const fn = Easings.get(`sineIn`);
 * // Returns 'eased' transformation of 0.5
 * fn(0.5);
 * ```
 * @param easingName eg `sineIn`
 * @returns Easing function
 */
declare const get: (easingName: EasingName) => ModFunction;
/**
 * Iterate over available easings.
 * @private
 * @returns Returns list of available easing names
 */
declare function getEasingNames(): Iterable<string>;
//#endregion
//#region ../packages/modulation/src/interpolate.d.ts
/**
 * Interpolation options.
 *
 * Limit: What to do if interpolation amount exceeds 0..1 range
 * * clamp: lock to A & B (inclusive) Default.
 * * wrap: wrap from end to start again
 * * ignore: allow return values outside of A..B range
 *
 * Easing: name of easing function for non-linear interpolation
 *
 * Transform: name of function to transform `amount` prior to interpolate. This is useful for creating non-linear interpolation results.
 *
 * For example:
 * ```js
 * // Divide interpolation amount in half
 * const interpolatorInterval({ mins: 1 }, 10, 100, {
 *  transform: (amount) => amount * Math.random()
 * });
 * ```
 * In the above example, the results would get more random over time.
 * `interpolatorInterval` will still step through the interpolation range of 0..1 in an orderly fashion, but we're transforming that range using a custom function before producing the result.
 *
 */
type InterpolateOptions = BasicInterpolateOptions & {
  easing: EasingName;
};
/**
 * Returns a function that interpolates from A to B.
 *
 * It steps through the interpolation with each call to the returned function.
 * This means that the `incrementAmount` will hinge on the rate
 * at which the function is called. Alternatively, consider {@link interpolatorInterval}
 * which steps on the basis of clock time.
 *
 * ```js
 * // Interpolate from 0..1 by 0.01
 * const v = interpolatorStepped(0.01, 100, 200);
 * v(); // Each call returns a value closer to target
 * // Eg: 100, 110, 120, 130 ...
 * ```
 *
 * Under the hood, it calls `interpolate` with an amount that
 * increases by `incrementAmount` each time.
 *
 * When calling `v()` to step the interpolator, you can also pass
 * in new B and A values. Note that the order is swapped: the B (target) is provided first, and
 * then optionally A.
 *
 * ```js
 * const v = interpolatorStepped(0.1, 100, 200); // Interpolate 100->200
 * v(300, 200); // Retarget to 200->300 and return result
 * v(150); // Retarget 200->150 and return result
 * ```
 *
 * This allows you to maintain the current interpolation progress.
 * @param incrementAmount Amount to increment by
 * @param a Start value. Default: 0
 * @param b End value. Default: 1
 * @param startInterpolationAt Starting interpolation amount. Default: 0
 * @param options Options for interpolation
 * @returns
 */
declare const interpolatorStepped: (incrementAmount: number, a?: number, b?: number, startInterpolationAt?: number, options?: Partial<InterpolateOptions>) => (retargetB?: number, retargetA?: number) => number;
/**
 * Interpolate between angles `a` and `b` by `amount`. Angles are in radians.
 *
 * ```js
 * interpolateAngle(0.5, Math.PI, Math.PI/2);
 * ```
 * @param amount
 * @param aRadians Start angle (radian)
 * @param bRadians End angle (radian)
 * @returns
 */
declare const interpolateAngle: (amount: number, aRadians: number, bRadians: number, options?: Partial<InterpolateOptions>) => number;
/**
 * Interpolates between A->B over `duration`.
 * Given the same A & B values, steps will be larger if it's a longer
 * duration, and shorter if it's a smaller duration.
 *
 * A function is returned, which when invoked yields a value between A..B.
 *
 * Alternatively to step through by the same amount regardless
 * of time, use {@link interpolatorStepped}.
 *
 * ```js
 * // Interpolate from 0..1 over one minute
 * const v = interpolatorInterval({mins:1});
 * v(); // Compute current value
 * ```
 *
 * Use start and end points:
 * ```js
 * // Interpolate from 100-200 over 10 seconds
 * const v = interpolatorInterval({secs:10}, 100, 200);
 * v(); // Compute current value
 * ```
 * @param duration Duration for interpolation
 * @param a Start point
 * @param b End point
 * @param options Options for interpolation
 * @returns
 */
declare const interpolatorInterval: (duration: Interval, a?: number, b?: number, options?: Partial<InterpolateOptions>) => (retargetB?: number, retargetA?: number) => number;
//#endregion
export { easing_d_exports as a, EasingTickOptions as c, ModSettable as d, ModSettableFeedback as f, SpringOptions as g, ModulatorTimed as h, interpolatorStepped as i, EasingTimeOptions as l, ModSource as m, interpolateAngle as n, EasingName as o, ModSettableOptions as p, interpolatorInterval as r, EasingOptions as s, InterpolateOptions as t, ModFunction as u };