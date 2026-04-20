import { a as ResultOrFunction, i as ResultOk, n as Result, r as ResultError, t as NumberGuardRange } from "./types-CSh98G0p.js";

//#region ../packages/guards/src/arrays.d.ts
/**
 * Throws an error if parameter is not an array
 * @param value
 * @param parameterName
 */
declare const arrayTest: (value: unknown, parameterName?: string) => Result<any[], string>;
/**
 * Throws if `index` is an invalid array index for `array`, and if
 * `array` itself is not a valid array.
 * @param array
 * @param index
 */
declare const arrayIndexTest: <V>(array: ArrayLike<V>, index: number, name?: string) => Result<ArrayLike<V>, string>;
/**
 * Returns true if parameter is an array of strings
 * @param value
 * @returns
 */
declare const arrayStringsTest: (value: unknown) => Result<string[], string>;
//#endregion
//#region ../packages/guards/src/empty.d.ts
declare const nullUndefTest: <TValue>(value: TValue, parameterName?: string) => Result<TValue, string>;
declare const isDefined: <T>(argument: T | undefined) => argument is T;
//#endregion
//#region ../packages/guards/src/function.d.ts
declare const isFunction: (object: unknown) => object is (...args: any[]) => any;
declare const functionTest: (value: unknown, parameterName?: string) => Result<Function, string>;
//#endregion
//#region ../packages/guards/src/numbers.d.ts
/**
 * Returns true if `x` is a power of two
 * @param x
 * @returns True if `x` is a power of two
 */
declare const isPowerOfTwo: (x: number) => boolean;
/**
 * Returns `fallback` if `v` is NaN, otherwise returns `v`.
 *
 * Throws if `v` is not a number type, null or undefined
 * @param v
 * @param fallback
 * @returns
 */
declare const ifNaN: (v: unknown, fallback: number) => number;
/**
 * Parses `value` as an integer, returning it if it meets the `range` criteria.
 * If not, `defaultValue` is returned.
 *
 * ```js
 * const i = integerParse('10', 'positive');    // 10
 * const i = integerParse('10.5', 'positive');  // 10
 * const i = integerParse('0', 'nonZero', 100); // 100
 * ```
 *
 * NaN is returned if criteria does not match and no default is given
 * ```js
 * const i = integerParse('10', 'negative');    // NaN
 * ```
 *
 * @param value
 * @param range
 * @param defaultValue
 * @returns
 */
declare const integerParse: (value: string | number | null, range?: NumberGuardRange, defaultValue?: number) => number;
/**
 * Checks if `t` is not a number or within specified range.
 * Returns `[false, reason:string]` if invalid or `[true]` if valid.
 *
 * Alternatives: {@link integerTest} for additional integer check, {@link percentTest} for percentage-range.
 *
 * * (empty, default): must be a number type and not NaN.
 * * finite: must be a number, not NaN and not infinite
 * * positive: must be at least zero
 * * negative: must be zero or lower
 * * aboveZero: must be above zero
 * * belowZero: must be below zero
 * * percentage: must be within 0-1, inclusive
 * * nonZero: can be anything except zero
 * * bipolar: can be -1 to 1, inclusive
 * @param value Value to check
 * @param parameterName Name of parameter (for more helpful exception messages)
 * @param range Range to enforce
 * @returns
 */
declare const numberTest: (value?: unknown, range?: NumberGuardRange, parameterName?: string, info?: string) => Result<number, string>;
/**
 * Checks if `t` is not a number or within specified range.
 * Throws if invalid. Use {@link numberTest} to test without throwing.
 *
* * (empty, default): must be a number type and not NaN.
* * positive: must be at least zero
* * negative: must be zero or lower
* * aboveZero: must be above zero
* * belowZero: must be below zero
* * percentage: must be within 0-1, inclusive
* * nonZero: can be anything except zero
* * bipolar: can be -1 to 1, inclusive
*
 * Alternatives: {@link integerTest} for additional integer check, {@link percentTest} for percentage-range.
 * @param value Value to test
 * @param range Range
 * @param parameterName Name of parameter
 */
/**
 * Compares two numbers with a given number of decimal places
 * ```js
 * a: 10.123 b: 10.1    decimals: 1 = true
 * a: 10.123 b: 10.2    decimals: 0 = true
 * a: 10.123 b: 10.14   decimals: 1 = true
 * a: 10.123 b: 10.14   decimals: 2 = false
 * ``
 * @param a
 * @param b
 * @param decimals How many decimals to include
 * @returns
 */
declare const numberDecimalTest: (a: number, b: number, decimals?: number) => Result<number, string>;
/**
 * Returns test of `value` being in the range of 0-1.
 * Equiv to `number(value, `percentage`);`
 *
 * This is the same as calling ```number(t, `percentage`)```
 * @param value Value to check
 * @param parameterName Param name for customising exception message
 * @returns
 */
declare const percentTest: (value: number, parameterName?: string, info?: string) => Result<number, string>;
/**
 * Checks if `value` an integer and meets additional criteria.
 * See {@link numberTest} for guard details, or use that if integer checking is not required.
 *
 * Note:
 * * `bipolar` will mean -1, 0 or 1.
 * * positive: must be at least zero
 * * negative: must be zero or lower
 * * aboveZero: must be above zero
 * * belowZero: must be below zero
 * * percentage: must be within 0-1, inclusive
 * * nonZero: can be anything except zero
 * @param value Value to check
 * @param parameterName Param name for customising exception message
 * @param range Guard specifier.
 */
declare const integerTest: (value: unknown, range?: NumberGuardRange, parameterName?: string) => Result<number, string>;
declare const integerArrayTest: (numbers: Iterable<number>) => Result<Iterable<number>, string>;
/**
 * Returns _true_ if `value` is an integer in number or string form
 * @param value
 * @returns
 */
declare const isInteger: (value: number | string) => boolean;
declare const numberInclusiveRangeTest: (value: number | undefined, min: number, max: number, parameterName?: string) => Result<number, string>;
/**
 * Returns a success if values are equal, considering the set digits of precision (1..21)
 *
 * @param expected Expected value
 * @param got Received value
 * @param precision Precision in terms of decimal digits. 1...21, default 21
 * @param parameterName
 * @returns
 */
declare const equalWithPrecisionTest: (expected: number, got: number, precision?: number, parameterName?: string) => Result<number, string>;
//#endregion
//#region ../packages/guards/src/object.d.ts
/**
 * Tests_if `value` is a plain object
 *
 * ```js
 * isPlainObject(`text`); // false
 * isPlainObject(document); // false
 * isPlainObject({ hello: `there` }); // true
 * ```
 * @param value
 * @returns
 */
declare const testPlainObject: (value: unknown) => Result<object, string>;
/**
 * Tests if `value` is primitive value (bigint,number,string or boolean) or plain object
 * @param value
 * @returns
 */
declare const testPlainObjectOrPrimitive: (value: unknown) => Result<object | bigint | number | string | boolean, string>;
//#endregion
//#region ../packages/guards/src/range.d.ts
type ExpectedOpts = {
  minInclusive?: number;
  maxInclusive?: number;
  minExclusive?: number;
  maxExclusive?: number;
};
declare const rangeIntegerTest: (v: Iterable<number>, expected: ExpectedOpts) => Result<Iterable<number>, string>;
/**
 * Inclusive range 4-6 = 4, 5, 6
 * Exclusive range 4-6 = 5
 *
 * @param numbers
 * @param expected
 * @returns
 */
declare const rangeTest: (numbers: Iterable<number>, expected: ExpectedOpts) => Result<Iterable<number>, string>;
//#endregion
//#region ../packages/guards/src/result.d.ts
declare const getErrorMessage: (ex: unknown) => string;
/**
 * Throws an error if any result is a failure.
 * Error message will be the combined from all errors.
 * @param results
 * @returns
 */
declare const throwIfFailed: (...results: Result<any, any>[]) => void;
/**
 * If any of `results` is an error, throws it, otherwise ignored.
 * @param results
 * @returns _true_ or throws
 */
declare function resultThrow(...results: ResultOrFunction[]): boolean;
declare function resultThrowSingle<TValue>(result: Result<TValue, any>): result is ResultOk<TValue>;
/**
 * Returns the first failed result, or _undefined_ if there are no fails
 * @param results
 * @returns
 */
declare const resultFirstFail_: <TError>(...results: ResultOrFunction[]) => ResultError<TError> | undefined;
/**
 * Returns _true_ if `result` is an error
 * @param result
 * @returns
 */
declare function resultIsError<TValue, TError>(result: Result<TValue, TError>): result is ResultError<TError>;
/**
 * Returns _true_ if `result` is OK and has a value
 * @param result
 * @returns
 */
declare function resultIsOk<TValue, TError>(result: Result<TValue, TError>): result is ResultOk<TValue>;
declare class IxfxError extends Error {
  cause: string | undefined;
  constructor(message: string, cause?: string);
  static fromError(error: Error, cause?: string): IxfxError;
  static fromString(message: string, cause?: string): IxfxError;
}
/**
 * Gets the result as an Error
 * @param result
 * @returns
 */
declare function resultToError(result: ResultError<any>): Error;
/**
 * Unwraps the result, returning its value if OK.
 * If not, an exception is thrown.
 * @param result
 * @returns
 */
declare function resultToValue<TValue, TError>(result: Result<TValue, TError>): TValue;
/**
 * Returns the error as a string.
 * @param result
 * @returns
 */
declare function resultErrorToString(result: ResultError<any>): string;
/**
 * Returns a {@link ResultError} using 'error' as the message.
 * @param error
 * @param info
 * @returns
 */
declare function errorResult(error: string, info?: string): ResultError<string>;
/**
 * Returns first failed result or final value.
 * @param results
 * @returns
 */
declare const resultsCollate: <TValue, TError>(...results: ResultOrFunction[]) => Result<TValue, TError>;
/**
 * If `result` is an error, calls `callback`, passing the error.
 * Otherwise does nothing
 * @param result
 * @param callback
 */
declare const resultWithFail: <TError>(result: Result<any, TError>, callback: (r: ResultError<TError>) => void) => void;
//#endregion
//#region ../packages/guards/src/string.d.ts
type StringGuardRange = `` | `non-empty`;
/**
 * Throws an error if parameter is not an string
 * @param value
 * @param parameterName
 */
declare const stringTest: (value: unknown, range?: StringGuardRange, parameterName?: string) => Result<string, string>;
//#endregion
export { ExpectedOpts, IxfxError, NumberGuardRange, Result, ResultError, ResultOk, ResultOrFunction, StringGuardRange, arrayIndexTest, arrayStringsTest, arrayTest, equalWithPrecisionTest, errorResult, functionTest, getErrorMessage, ifNaN, integerArrayTest, integerParse, integerTest, isDefined, isFunction, isInteger, isPowerOfTwo, nullUndefTest, numberDecimalTest, numberInclusiveRangeTest, numberTest, percentTest, rangeIntegerTest, rangeTest, resultErrorToString, resultFirstFail_, resultIsError, resultIsOk, resultThrow, resultThrowSingle, resultToError, resultToValue, resultWithFail, resultsCollate, stringTest, testPlainObject, testPlainObjectOrPrimitive, throwIfFailed };