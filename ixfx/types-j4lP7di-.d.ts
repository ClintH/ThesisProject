//#region ../packages/arrays/src/util/is-equal.d.ts
/**
 * Function that returns true if `a` and `b` are considered equal
 */
type IsEqual<T> = (a: T, b: T) => boolean;
//#endregion
//#region ../packages/arrays/src/types.d.ts
/**
 * Returns a result of a merged into b.
 * B is always the 'newer' data that takes
 * precedence.
 */
type MergeReconcile<V> = (a: V, b: V) => V;
type MovingWindowOptions<T> = {
  /**
   * How many values to keep
   */
  samples: number;
  /**
   * If specified, this function is called to filter values
   * before they are added to the window. If the reject function
   * returns _true_, the value is NOT added.
   *
   * If the 'allow' function is also specified, it only gets used if
   * 'reject' returns _false_.
   * @param value
   * @returns
   */
  reject?: (value: T) => boolean;
  /**
   * If specified, this function is called to filter values before
   * they are added to the window. If the allow function returns _true_,
   * the value IS added.
   *
   * If 'reject' is also specified and it returns _true_, the allow function will not override it.
   * @param value
   * @returns
   */
  allow?: (value: T) => boolean;
};
//#endregion
export { MovingWindowOptions as n, IsEqual as r, MergeReconcile as t };