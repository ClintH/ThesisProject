//#region ../packages/process/src/types.d.ts
type Process<TIn, TOut> = (value: TIn) => TOut;
type ProcessFactory<TIn, TOut> = () => Process<TIn, TOut>;
type Processors1<T1, T2> = [Process<T1, T2>];
type Processors2<T1, T2, T3> = [Process<T1, T2>, Process<T2, T3>];
type Processors3<T1, T2, T3, T4> = [Process<T1, T2>, Process<T2, T3>, Process<T3, T4>];
type Processors4<T1, T2, T3, T4, T5> = [Process<T1, T2>, Process<T2, T3>, Process<T3, T4>, Process<T4, T5>];
type Processors5<T1, T2, T3, T4, T5, T6> = [Process<T1, T2>, Process<T2, T3>, Process<T3, T4>, Process<T4, T5>, Process<T5, T6>];
type Processors<T1, T2, T3, T4, T5, T6> = Processors1<T1, T2> | Processors2<T1, T2, T3> | Processors3<T1, T2, T3, T4> | Processors4<T1, T2, T3, T4, T5> | Processors5<T1, T2, T3, T4, T5, T6>;
/**
 * A rank function that compares A and B.
 * Returns the highest value, 'a' or 'b'.
 * Returns 'eq' if values are equal
 */
type RankFunction<T> = (a: T, b: T) => `a` | `b` | `eq`;
type RankOptions = {
  /**
   * If set, only values with this JS type are included
   */
  includeType?: `string` | `number` | `object` | `boolean`;
  /**
   * If _true_, also emits values when they rank equal with current highest.
   * _false_ by default
   */
  emitEqualRanked?: boolean;
  /**
   * If _true_, emits the current highest value even if it hasn't changed.
   * This means it will match the tempo of the incoming stream.
   */
  emitRepeatHighest?: boolean;
};
//#endregion
export { Processors2 as a, Processors5 as c, Processors1 as i, RankFunction as l, ProcessFactory as n, Processors3 as o, Processors as r, Processors4 as s, Process as t, RankOptions as u };