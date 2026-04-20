import { r as Processors } from "./types-lFRpBv6A.js";
import { $ as PassedValue, $t as SyncOptions, A as messageIsDoneSignal, At as average, B as OpInterpolateOptions, C as isTrigger, Ct as Unsubscriber, D as isWrapped, Dt as Wrapped, E as isTriggerValue, Et as WithValueOptions, F as toArray, Ft as tally, G as InitLazyStreamInitedOptions, Gt as DebounceOptions, H as CombineLatestToObject, Ht as TimeoutValueOptions, I as toArrayOrThrow, It as SetHtmlOptions, J as Lazy, Jt as OpAsAnnotation, K as InitLazyStreamOptions, Kt as FieldOptions, L as prepare, Lt as SetHtmlOptionsElement, M as opify, Mt as min, N as resolveTriggerValue, Nt as rank, O as isWritable, Ot as symbol, P as toGenerator, Pt as sum, Q as PassedSignal, Qt as SwitcherOptions, R as index_d_exports, Rt as SetHtmlOptionsQuery, S as isReactive, St as ToArrayOptions, T as isTriggerGenerator, Tt as UpstreamOptions, U as combineLatestToObject, Ut as ValueToPingOptions, V as interpolate, Vt as TimeoutPingOptions, W as CombineLatestOptions, Wt as ChunkOptions, X as Optional, Xt as SingleFromArrayOptions, Y as ObjectFieldHandler, Yt as OpMathOptions, Z as Passed, Zt as SplitOptions, _ as wrap, _t as RxValueTypeObject, a as takeNextValue, at as ReactiveFinite, b as hasLast, bt as RxValueTypes, c as initLazyStream, ct as ReactiveNonInitial, d as initUpstream, dt as ReactiveOpLinks, en as ThrottleOptions, et as PipeSet, f as CacheStream, ft as ReactiveOrSource, g as resolveSource, gt as ResolveOptions, h as ResolveSourceOptions, ht as ReactiveWritable, i as run, it as ReactiveDiff, j as messageIsSignal, jt as max, k as messageHasValue, kt as TallyOptions, l as initLazyStreamWithInitial, lt as ReactiveOp, m as cache, mt as ReactiveStream, n as Sinks, nt as Reactive, o as to, ot as ReactiveInitial, p as CacheStreamInitial, pt as ReactivePingable, q as InitStreamOptions, qt as FilterPredicate, r as manual, rt as ReactiveArray, s as writable, st as ReactiveInitialStream, t as Ops, tn as TransformOpts, tt as PrimitiveValueTypeObject, u as initStream, ut as ReactiveOpInit, v as ResolveTriggerDone, vt as RxValueTypeObjectOrUndefined, w as isTriggerFunction, wt as UpstreamInitialOptions, x as isPingable, xt as SignalKinds, y as ResolveTriggerValue, yt as RxValueTypeRx, z as index_d_exports$1, zt as setHtmlText } from "./index-C2pL5Gby.js";

//#region ../packages/rx/src/ops/annotate.d.ts
/**
 * Annotates values from `source`. Output values will be
 * in the form `{ value: TIn, annotation: TAnnotation }`.
 * Where `TIn` is the type of the input, and `TAnnotation` is
 * the return type of the annotator function.
 *
 * Example calculating area from width & height:
 * ```js
 * const data = Rx.From.array(
 *  { w: 1, h: 3 }, { w: 1, h: 1 }, { w: 2, h: 2 }
 * );
 * const annotated = Rx.Ops.annotate(data, v => {
 *  return { area: v.w * v.h }
 * });
 * const data = await Rx.toArray(annotated);
 * // Data =  [ { value: { w:1, h:3 }, annotation: { area:3 } } ...]
 * ```
 *
 * If you would rather annotate and have values merge with the input,
 * use `transform`:
 * ```js
 * const data = Rx.From.array(
 *  { w: 1, h: 3 }, { w: 1, h: 1 }, { w: 2, h: 2 }
 * );
 * const withArea = Rx.Ops.transform(data, v => {
 *  return { ...v, area: v.w * v.h }
 * });
 * const data = await Rx.toArray(withArea);
 * // Data =  [ { w:1, h:3, area:3 }, ...]
 * ```
 */
declare function annotate<In, TAnnotation>(input: ReactiveOrSource<In>, annotator: (value: In) => TAnnotation, options?: Partial<TransformOpts>): Reactive<{
  value: In;
  annotation: TAnnotation;
}>;
/**
 * Annotates the input stream using {@link ReactiveOp} as the source of annotations.
 * The output values will have the shape of `{ value: TIn, annotation: TAnnotation }`.
 * Meaning that the original value is stored under `.value`, and the annotation under `.annotation`.
 *
 * ```js
 * const data = Rx.From.array([ 1, 2, 3 ]);
 * const annotated = Rx.Ops.annotateWithOp(data, Rx.Ops.sum());
 * const data = await annotated.toArray(annotated);
 * // Data =  [ { value: 1, annotation: 1 }, { value: 2, annotation: 3 }, { value: 3, annotation: 6 } ]
 * ```
 * @param annotatorOp Operator to generate annotations
 * @param input Input stream
 * @returns
 */
declare function annotateWithOp<In, TAnnotation>(input: ReactiveOrSource<In>, annotatorOp: ReactiveOp<In, TAnnotation>): Reactive<{
  value: In;
  annotation: TAnnotation;
}>;
//#endregion
//#region ../packages/rx/src/ops/chunk.d.ts
/**
 * Queue from `source`, emitting when thresholds are reached.
 * The resulting Reactive produces arrays.
 *
 * Can use a combination of elapsed time or number of data items.
 *
 * By default options are OR'ed together.
 *
 * ```js
 * // Emit data in chunks of 5 items
 * chunk(source, { quantity: 5 });
 * // Emit a chunk of data every second
 * chunk(source, { elapsed: 1000 });
 * ```
 * @param source
 * @param options
 * @returns
 */
declare function chunk<V>(source: ReactiveOrSource<V>, options?: Partial<ChunkOptions>): Reactive<V[]>;
//#endregion
//#region ../packages/rx/src/ops/clone-from-fields.d.ts
/**
 * Create a new object from input, based on cloning fields rather than a destructured copy.
 * This is useful for event args.
 * @param source
 * @returns
 */
declare const cloneFromFields: <In>(source: ReactiveOrSource<In>) => Reactive<In>;
//#endregion
//#region ../packages/rx/src/ops/combine-latest-to-array.d.ts
/**
 * Monitors input reactive values, storing values as they happen to an array.
 * Whenever a new value is emitted, the whole array is sent out, containing current
 * values from each source, or _undefined_ if not yet emitted.
 *
 * See {@link combineLatestToObject} to combine streams by name into an object, rather than array.
 *
 * ```
 * const sources = [
 *  Rx.fromFunction(Math.random, { loop: true, interval: 100 }),
 *  Rx.fromFunction(Math.random, { loop: true, interval: 200 })
 * ];
 * const r = Rx.combineLatestToArray(sources);
 * r.onValue(value => {
 *  // Value will be an array of last value from each source:
 *  // [number,number]
 * });
 * ```
 *
 * The tempo of this stream will be set by the fastest source stream.
 * See {@link syncToArray} to have pace determined by slowest source, and only
 * send when each source has produce a new value compared to last time.
 *
 * Set `onSourceDone` to choose behaviour if a source stops. By default it
 * is 'break', meaning the whole merged stream stops.
 *
 * Note: unlike RxJS's `combineLatest`, does not wait for each source to emit once
 * before emitting first value.
 * @param reactiveSources Sources to merge
 * @param options Options for merging
 * @returns
 */
declare function combineLatestToArray<const T extends readonly ReactiveOrSource<any>[]>(reactiveSources: T, options?: Partial<CombineLatestOptions>): Reactive<RxValueTypes<T>>;
//#endregion
//#region ../packages/rx/src/ops/compute-with-previous.d.ts
/**
 * When there is a value from `input`, or the reactive is pinged,
 * this reactive emits the result of `fn`.
 *
 * `fn` is provided the previous value as well as the most recent value.
 *
 * If no previous value is available, the current value is emitted and `fn` is not called.
 * @param input
 * @param fn
 * @returns
 */
declare function computeWithPrevious<TIn>(input: ReactiveOrSource<TIn>, fn: (previous: TIn, current: TIn) => TIn): ReactivePingable<TIn>;
//#endregion
//#region ../packages/rx/src/ops/debounce.d.ts
declare function debounce<V>(options: Partial<DebounceOptions>): ReactiveOp<V, V>;
//#endregion
//#region ../packages/rx/src/ops/elapsed.d.ts
/**
 * Emits time in milliseconds since last message.
 * If it is the first value, 0 is used.
 * @param input
 * @returns
 */
declare const elapsed: <In>(input: ReactiveOrSource<In>) => Reactive<number>;
//#endregion
//#region ../packages/rx/src/ops/field.d.ts
/**
 * From a source value, yields a field from it. Only works
 * if stream values are objects.
 *
 * If a source value doesn't have that field, it is skipped.
 *
 * @returns
 */
declare function field<TIn extends object, TFieldType>(fieldSource: ReactiveOrSource<TIn>, fieldName: keyof TIn, options?: Partial<FieldOptions<TIn, TFieldType>>): Reactive<TFieldType>;
//#endregion
//#region ../packages/rx/src/ops/filter.d.ts
/**
 * Passes all values where `predicate` function returns _true_.
 */
declare function filter<In>(input: ReactiveOrSource<In>, predicate: FilterPredicate<In>, options: Partial<InitStreamOptions>): Reactive<In>;
/**
 * Drops all values where `predicate` function returns _true_.
 */
declare function drop<In>(input: ReactiveOrSource<In>, predicate: FilterPredicate<In>, options: Partial<InitStreamOptions>): Reactive<In>;
//#endregion
//#region ../packages/rx/src/ops/pipe.d.ts
/**
 * Pipes the output of one stream into another, in order.
 * The stream returned is a new stream which captures the final output.
 *
 * If any stream in the pipe closes the whole pipe is closed.
 * @param streams
 * @returns
 */
declare const pipe: <TInput, TOutput>(...streams: PipeSet<TInput, TOutput>) => Reactive<TOutput>;
//#endregion
//#region ../packages/rx/src/ops/single-from-array.d.ts
/**
 * For a stream that emits arrays of values, this op will select a single value.
 *
 * Can select based on:
 * * predicate: a function that returns _true_ for a value
 * * at: selection based on array index (can be combined with random ordering to select a random value)
 *
 * ```js
 * // If source is Reactive<Array<number>>, picks the first even number
 * singleFromArray(source, {
 *  predicate: v => v % 2 === 0
 * });
 *
 * // Selects a random value from source
 * singleFromArray(source, {
 *  order: `random`,
 *  at: 0
 * });
 * ```
 *
 * If neither `predicate` or `at` options are given, exception is thrown.
 * @param source Source to read from
 * @param options Options for selection
 * @returns
 */
declare function singleFromArray<V>(source: ReactiveOrSource<V[]>, options?: Partial<SingleFromArrayOptions<V>>): Reactive<V>;
//#endregion
//#region ../packages/rx/src/ops/split.d.ts
/**
 * Creates a set of streams each of which receives data from `source`.
 * By default these are lazy and dispose if the upstream source closes.
 *
 * See also {@link splitLabelled} to split into named streams.
 * @param rxOrSource
 * @param options
 * @returns
 */
declare const split: <T>(rxOrSource: ReactiveOrSource<T>, options?: Partial<SplitOptions>) => ReactiveStream<T>[];
/**
 * Splits `source` into several duplicated streams.
 * Returns an object with keys according to `labels`.
 * Each value is a stream which echos the values from `source`.
 * ```js
 * const { a, b, c} = splitLabelled(source, `a`, `b`, `c`);
 * // a, b, c are Reactive types
 * ```
 *
 * See also {@link split} to get an unlabelled split
 * @param rxOrSource
 * @param labels
 * @returns
 */
declare const splitLabelled: <T, K extends PropertyKey>(rxOrSource: ReactiveOrSource<T>, labels: K[]) => Record<K, Reactive<T>>;
//#endregion
//#region ../packages/rx/src/ops/switcher.d.ts
/**
 * Switcher generates several output streams, labelled according to the values of `cases`.
 * Values from `source` are fed to the output streams if their associated predicate function returns _true_.
 *
 * In this way, we can split one input stream into several output streams, each potentially getting a different
 * subset of the input.
 *
 * With `options`, you can specify whether to send to multiple outputs if several match, or just the first (default behaviour).
 *
 * The below example shows setting up a switcher and consuming the output streams.
 * @example
 * ```js
 * // Initialise a reactive number, starting at 0
 * const switcherSource = Reactive.number(0);
 * // Set up the switcher
 * const x = Reactive.switcher(switcherSource, {
 *  even: v => v % 2 === 0,
 *  odd: v => v % 2 !== 0
 * });
 * // Listen for outputs from each of the resulting streams
 * x.even.on(msg => {
 *   log(`even: ${msg.value}`);
 * });
 * x.odd.on(msg => {
 *   log(`odd: ${msg.value}`);
 * })
 * // Set new values to the number source, counting upwards
 * // ...this will in turn trigger the outputs above
 * setInterval(() => {
 *   switcherSource.set(switcherSource.last() + 1);
 * }, 1000);
 * ```
 *
 * If `source` closes, all the output streams will be closed as well.
 * @param reactiveOrSource
 * @param cases
 * @param options
 * @returns
 */
declare const switcher: <TValue, TRec extends Record<string, FilterPredicate<TValue>>, TLabel extends keyof TRec>(reactiveOrSource: ReactiveOrSource<TValue>, cases: TRec, options?: Partial<SwitcherOptions>) => Record<TLabel, Reactive<TValue>>;
//#endregion
//#region ../packages/rx/src/ops/sync-to-array.d.ts
/**
 * Waits for all sources to produce a value, sending the combined results as an array.
 * After sending, it waits again for each source to send at least one value.
 *
 * Use {@link syncToObject} to output objects based on labelled sources rather than an array of values.
 *
 * Pace will be set by the slowest source. Alternatively, use {@link combineLatestToArray} where the rate is determined by fastest source.
 *
 * Only complete results are sent. For example if source A & B finish and source C is still producing values,
 * synchronisation is not possible because A & B stopped producing values. Thus the stream will self-terminate
 * after `maximumWait` (2 seconds). The newer values from C are lost.
 */
declare function syncToArray<const T extends readonly ReactiveOrSource<any>[]>(reactiveSources: T, options?: Partial<SyncOptions>): Reactive<RxValueTypes<T>>;
//#endregion
//#region ../packages/rx/src/ops/sync-to-object.d.ts
declare function syncToObject<const T extends Record<string, ReactiveOrSource<any>>>(reactiveSources: T, options?: Partial<SyncOptions>): Reactive<RxValueTypeObject<T>>;
//#endregion
//#region ../packages/rx/src/ops/tap.d.ts
/**
 * 'Taps' the values from 'input', passing them to the 'process' function.
 * Return stream is the input stream, unaffected by what 'process' does.
 * @param input Input stream
 * @param processors List of processors
 * @returns
 */
declare function tapProcess<In, T2, T3, T4, T5, T6>(input: ReactiveOrSource<In>, ...processors: Processors<In, T2, T3, T4, T5, T6>): Reactive<In>;
/**
 * 'Taps' the values from 'input', passing them to 'diverged'
 * Returns the original input stream, unaffected by what 'diverged' does.
 * @param input Input stream
 * @param diverged Stream to write to
 * @returns
 */
declare function tapStream<In>(input: ReactiveOrSource<In>, diverged: ReactiveWritable<In>): Reactive<In>;
/**
 * Create a parallel 'tap' of processing
 * @param input Input stream
 * @param ops Series of ops to process data
 * @returns
 */
declare const tapOps: <TIn, TOut>(input: ReactiveOrSource<TIn>, ...ops: ReactiveOp<TIn, TOut>[]) => Reactive<TOut>;
//#endregion
//#region ../packages/rx/src/ops/throttle.d.ts
/**
 * Only allow a value through if a minimum amount of time has elapsed.
 * since the last value. This effectively slows down a source to a given number
 * of values/ms. Values emitted by the source which are too fast are discarded.
 *
 * Throttle will fire on the first value received.
 *
 * In more detail:
 * Every time throttle passes a value, it records the time it allowed something through. For every
 * value received, it checks the elapsed time against this timestamp, throwing away values if
 * the period hasn't elapsed.
 *
 * With this logic, a fury of values of the source might be discarded if they fall within the elapsed time
 * window. But then if there is not a new value for a while, the actual duration between values can be longer
 * than expected. This is in contrast to {@link debounce}, which will emit the last value received after a duration,
 * even if the source stops sending.
 * @param options
 * @returns
 */
declare function throttle<V>(throttleSource: ReactiveOrSource<V>, options?: Partial<ThrottleOptions>): Reactive<V>;
//#endregion
//#region ../packages/rx/src/ops/timeout-value.d.ts
/**
 * Emits a value if `source` does not emit a value after `interval`
 * has elapsed. This can be useful to reset a reactive to some
 * 'zero' state if nothing is going on.
 *
 * If `source` emits faster than the `interval`, it won't get triggered.
 *
 * Default for 'timeout': 1000s.
 *
 * ```js
 * // Emit 'hello' if 'source' doesn't emit a value after 1 minute
 * const r = Rx.timeoutValue(source, { value: 'hello', interval: { mins: 1 } });
 * ```
 *
 * Can also emit results from a function or generator
 * ```js
 * // Emits a random number if 'source' doesn't emit a value after 500ms
 * const r = Rx.timeoutValue(source, { fn: Math.random, interval: 500 });
 * ```
 *
 * If `immediate` option is _true_ (default), the timer starts from stream initialisation.
 * Otherwise it won't start until it observes the first value from `source`.
 * @param source
 * @param options
 */
declare function timeoutValue<TSource, TTriggerValue>(source: ReactiveOrSource<TSource>, options: TimeoutValueOptions<TTriggerValue>): Reactive<TSource | TTriggerValue>;
//#endregion
//#region ../packages/rx/src/ops/timeout-ping.d.ts
/**
 * Pings a reactive if no value is emitted at after `interval`.
 * Returns `source`.
 *
 * ```js
 * // Ping `source` if no value is emitted after one minute
 * const r = Rx.timeoutPing(source, { mins: 1 });
 * ```
 *
 * Behavior can be stopped using an abort signal.
 * @see {@link ReactivePingable}
 * @param source
 * @param options
 */
declare function timeoutPing<TSource>(source: ReactiveOrSource<TSource>, options: TimeoutPingOptions): Reactive<TSource>;
//#endregion
//#region ../packages/rx/src/ops/transform.d.ts
/**
 * Transforms values from `source` using the `transformer` function.
 * @param transformer
 * @returns
 */
declare function transform<In, Out>(input: ReactiveOrSource<In>, transformer: (value: In) => Out, options?: Partial<TransformOpts>): Reactive<Out>;
//#endregion
//#region ../packages/rx/src/ops/value-to-ping.d.ts
/**
 * Pings `target` whenever `source` emits a value. The value itself is ignored, it just
 * acts as a trigger.
 *
 * Returns a new stream capturing the output of `target`.
 *
 * It `source` or `target` closes, output stream closes too.
 *
 * @returns
 */
declare function valueToPing<TSource, TTarget>(source: ReactiveOrSource<TSource>, target: ReactivePingable<TTarget>, options?: Partial<ValueToPingOptions<TSource>>): Reactive<TTarget>;
//#endregion
//#region ../packages/rx/src/ops/with-value.d.ts
/**
 * A reactive where the last value can be read at any time.
 * An initial value must be provided.
 * ```js
 * const r = Rx.withValue(source, { initial: `hello` });
 * r.last(); // Read last value
 * ```
 *
 * Warning: Since most reactives only active when subscribed to, it's important to also subscribe
 * to the results of `r` for this flow to happen. Alternatively, use `lazy: 'never'` as an option.
 * @param input
 * @param options
 * @returns
 */
declare function withValue<In>(input: ReactiveOrSource<In>, options: WithValueOptions<In>): ReactiveInitial<In>;
//#endregion
export { CacheStream, CacheStreamInitial, ChunkOptions, index_d_exports as Collections, CombineLatestOptions, CombineLatestToObject, DebounceOptions, FieldOptions, FilterPredicate, index_d_exports$1 as From, InitLazyStreamInitedOptions, InitLazyStreamOptions, InitStreamOptions, Lazy, ObjectFieldHandler, OpAsAnnotation, OpInterpolateOptions, OpMathOptions, Ops, Optional, Passed, PassedSignal, PassedValue, PipeSet, PrimitiveValueTypeObject, Reactive, ReactiveArray, ReactiveDiff, ReactiveFinite, ReactiveInitial, ReactiveInitialStream, ReactiveNonInitial, ReactiveOp, ReactiveOpInit, ReactiveOpLinks, ReactiveOrSource, ReactivePingable, ReactiveStream, ReactiveWritable, ResolveOptions, ResolveSourceOptions, ResolveTriggerDone, ResolveTriggerValue, RxValueTypeObject, RxValueTypeObjectOrUndefined, RxValueTypeRx, RxValueTypes, SetHtmlOptions, SetHtmlOptionsElement, SetHtmlOptionsQuery, SignalKinds, SingleFromArrayOptions, Sinks, SplitOptions, SwitcherOptions, SyncOptions, TallyOptions, ThrottleOptions, ToArrayOptions, TransformOpts, Unsubscriber, UpstreamInitialOptions, UpstreamOptions, WithValueOptions, Wrapped, annotate, annotateWithOp, average, cache, chunk, cloneFromFields, combineLatestToArray, combineLatestToObject, computeWithPrevious, debounce, drop, elapsed, field, filter, hasLast, initLazyStream, initLazyStreamWithInitial, initStream, initUpstream, interpolate, isPingable, isReactive, isTrigger, isTriggerFunction, isTriggerGenerator, isTriggerValue, isWrapped, isWritable, manual, max, messageHasValue, messageIsDoneSignal, messageIsSignal, min, opify, pipe, prepare, rank, resolveSource, resolveTriggerValue, run, setHtmlText, singleFromArray, split, splitLabelled, sum, switcher, symbol, syncToArray, syncToObject, takeNextValue, tally, tapOps, tapProcess, tapStream, throttle, timeoutPing, timeoutValue, to, toArray, toArrayOrThrow, toGenerator, transform, valueToPing, withValue, wrap, writable };