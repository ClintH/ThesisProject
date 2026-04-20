//#region ../packages/guards/src/types.d.ts
type NumberGuardRange =
/**
 * No range checking
 */
`` | `finite`
/**
 * Can be any number, except zero
 */
| `nonZero` | `positive` | `negative`
/**
 * Must be above zero
 */
| `aboveZero` | `belowZero` | `percentage` | `bipolar`;
type ResultOk<TValue> = {
  success: true;
  value: TValue;
  info?: string;
};
type ResultError<TError> = {
  success: false;
  error: TError;
  info?: string;
};
type ResultOrFunction = Result<any, any> | (() => undefined | Result<any, any>);
type Result<TValue, TError> = ResultOk<TValue> | ResultError<TError>;
//#endregion
export { ResultOrFunction as a, ResultOk as i, Result as n, ResultError as r, NumberGuardRange as t };