import { r as Point } from "./point-type-DLbh1Hzz.js";
import { t as PointAverageKinds } from "./averager-Ccipf-pP.js";

//#region ../packages/geometry/src/angles.d.ts
/**
 * Convert angle in degrees to angle in radians.
 * @param angleInDegrees
 * @returns
 */
declare function degreeToRadian(angleInDegrees: number): number;
/**
 * Convert angles in degrees to angles in radians
 * @param angleInDegrees
 */
declare function degreeToRadian(angleInDegrees: readonly number[]): readonly number[];
/**
 * Inverts the angle so it points in the opposite direction of a unit circle
 * @param angleInRadians
 * @returns
 */
declare function radianInvert(angleInRadians: number): number;
declare function degreeToGradian(angleInDegrees: number): number;
/**
 * Returns the gradian value converted to degrees.
 * By default it wraps, so any value 360 or greater wraps around.
 * @param angleInGradians
 * @param wrap
 * @returns
 */
declare function gradianToDegree(angleInGradians: number, wrap?: boolean): number;
declare function radianToGradian(angleInRadians: number): number;
declare function gradianToRadian(angleInGradian: number): number;
/**
 * Convert angle in radians to angle in degrees
 * @param angleInRadians
 * @returns
 */
declare function radianToDegree(angleInRadians: number): number;
/**
 * Convert angles in radians to angles in degrees
 * @param angleInRadians
 */
declare function radianToDegree(angleInRadians: readonly number[]): readonly number[];
/**
 * Angle from x-axis to point (ie. `Math.atan2`)
 * @param point
 * @returns
 */
declare const radiansFromAxisX: (point: Point) => number;
/**
 * Sum angles together, accounting for the 'wrap around'.
 *
 * `clockwise` of _true_ (default) means angles are added in clockwise direction
 *
 * ```js
 * // From 180deg, add 90deg in the clockwise direction
 * radiansSum(Math.PI, Math.PI/2, true);
 * ```
 *
 * Orientation of angles is as follows:
 * ```
 *       90deg
 *       Pi/2
 *        |
 * Pi  ---+--- 0
 * 180    |
 *       3PI/2
 *       270deg
 * ```
 * {@link degreesSum} is the same, but uses degrees (0..360)
 * @param start Starting angle, in radian
 * @param amount Angle to add, in radian
 * @param clockwise Add in clockwise direction (default: _true_)
 * @returns Sum result, in radians
 */
declare const radiansSum: (start: number, amount: number, clockwise?: boolean) => number;
/**
 * Sum angles together, accounting for the 'wrap around'.
 *
 * `clockwise` of _true_ (default) means angles are added in clockwise direction
 *
 * ```js
 * // From 180deg, add 90deg in the clockwise direction
 * radiansSum(180, 90, true);
 * ```
 *
 * {@link radiansSum} is the same, but uses radians (0..2 Pi)
 *
 * Orientation of angles is as follows:
 * ```
 *       90
 *        |
 * 180 ---+--- 0
 *        |
 *       270
 * ```
 * @param start Starting angle, in degrees
 * @param amount Angle to add, in degrees
 * @param clockwise Add in clockwise direction (default: _true_)
 * @returns Sum result, in degrees
 */
declare const degreesSum: (start: number, amount: number, clockwise?: boolean) => number;
/**
 * Computes the angle arc between a start and end angle,
 * given in radians. It properly accounts for the wrap-around
 * values.
 *
 * ```js
 * // Between 0-90deg in clockwise direction
 * radianArc(0, Math.PI/2, true); // Yields: 3Pi/2 (270 deg)
 *
 * // In counter-clockwise direction
 * radianArc(0, Math.PI/2, false); // Yields: Math.PI/2 (90deg)
 * ```
 *
 * See {@link degreeArc} to operate in degrees.
 *
 * Orientation of angles is as follows:
 * ```
 *       90deg
 *       Pi/2
 *        |
 * Pi  ---+--- 0
 * 180    |
 *       3PI/2
 *       270deg
 * ```
 * @param start Start angle, in radians
 * @param end End angle, in radians
 * @param clockwise Calculate in clockwise direction (default: _true_)
 * @returns Angle of arc, in radians.
 */
declare const radianArc: (start: number, end: number, clockwise?: boolean) => number;
/**
 * Computes the angle arc between a start and end angle,
 * given in degrees. It properly accounts for the wrap-around
 * values.
 *
 * ```js
 * // Between 0-90 in clockwise direction
 * degreeArc(0, 90, true); // Yields: 270
 *
 * // In counter-clockwise direction
 * degreeArc(0, 90, false); // Yields: 90
 * ```
 *
 * See {@link radianArc} to operate in radians.
 *
 * Orientation of angles is as follows:
 * ```
 *       90
 *        |
 * 180 ---+--- 0
 *        |
 *       270
 * ```
 * @param start Start angle, in degrees
 * @param end End angle, in degrees
 * @param clockwise Calculate in clockwise direction (default: _true_)
 * @returns Angle of arc, in degrees.
 */
declare const degreeArc: (start: number, end: number, clockwise?: boolean) => number;
type Angle = {
  value: number;
  unit: `deg` | `rad` | `turn` | `grad`;
};
/**
 * Parses CSS-style angle strings into an 'Angle' type. By default assumes degrees.
 *
 * ```js
 * angleParse(`100`);     // { value: 100, unit: `deg` }
 * angleParse(100);       // { value: 100, unit: `deg` }
 * angleParse(`100deg`);  // { value: 100, unit: `deg` }
 *
 * // More exotic units:
 * angleParse(`100rad`);  // { value: 100, unit: `rad` }
 * angleParse(`100turn`); // { value: 100, unit: `turn` }
 * angleParse(`100grad`); // { value: 100, unit: `grad` }
 * ```
 *
 * Once parsed in this format, use {@link angleConvert} to convert to
 * a different unit.
 * @param value
 * @returns
 */
declare const angleParse: (value: string | number | Angle) => Angle;
declare const isAngleType: (v: any) => v is Angle;
/**
 * Converts some angle representation to a simple numeric radian angle.
 *
 * ```js
 * toRadian(90); // 90deg
 * toRadian(`90`); // 90deg
 * toRadian(`1.2rad`)
 * toRadian(`90deg`)
 * ```
 *
 * Unitless values provided as a number or string are assumed to be degrees.
 * @param angleOrDegrees
 * @returns
 */
declare const toRadian: (angleOrDegrees: Angle | number | string) => number;
/**
 * Converts an angle to another representation.
 * Input value is assumed degrees unless it's an {@link Angle} type of has the unit.
 *
 * These are all identical inputs: 100, `100`, `100deg`
 * ```js
 * angleConvert(100, `rad`); // Converts 100deg to radians
 * ```
 *
 * Other units can be used for string input: `2turn`, `1grad`, `2rad`.
 * ```js
 * angleConvert(`2rad`, `deg`); // Converts 2radians to degrees
 * ```
 *
 * Can also use an object input:
 * ```js
 * angleConvert({ value: 10, unit: `deg`}, `rad`);
 * ```
 * @param angleOrDegrees
 * @param destination
 * @returns
 */
declare const angleConvert: (angleOrDegrees: Angle | number | string, destination: Angle[`unit`]) => Angle;
/**
 * Compute [unit vector](https://en.wikipedia.org/wiki/Unit_vector) of an angle. The unit vector is essentially the direction of an angle.
 *
 * ```js
 * unitVector(90); // 90 deg
 * unitVector(`1.2rad`); // 1.2 in radians
 * ```
 *
 * The coordinate space is -1..1:
 * ```
 *    y 1
 *      |
 *      |
 * -1 --+--- 1 x
 *      |
 *      |
 *     -1
 * ```
 *
 * See {@link fromUnitVector} to convert back to an angle
 * @param angleOrDegrees Angle specified in degrees, or an angle with units
 */
declare const toUnitVector: (angleOrDegrees: Angle | string | number) => {
  x: number;
  y: number;
};
/**
 * Convert from a [unit vector](https://en.wikipedia.org/wiki/Unit_vector) to an angle,
 * by default radians.
 *
 * ```js
 * fromUnitVector({ x: 1, y: 0.5 });          // { unit: `rad`, value: ... }
 * fromUnitVector({ x: -0.2, y: 0.4 }, `deg`) // { unit: `deg`, value ... }
 * ```
 * @param vector
 * @param unit
 * @returns
 */
declare const fromUnitVector: (vector: Point, unit?: Angle[`unit`]) => Angle;
/**
 * Converts 'turns' to degrees. By defaults wraps the value, so
 * turn value of 1 or 2 equal 0deg instead of 360 or 720deg.
 * @param turns
 * @param wrap
 * @returns
 */
declare const turnToDegree: (turns: number, wrap?: boolean) => number;
/**
 * Calculates the average of angles
 * @param angles
 * @returns
 */
declare const average: (angles: (Angle | string | number)[], kind?: PointAverageKinds) => Angle;
declare const turnToRadian: (turns: number) => number;
declare const degreeToTurn: (degrees: number) => number;
declare const radianToTurn: (radians: number) => number;
/**
 * Normalise a radian angle to 0..2*PI range
 * @param angleRadian
 * @returns
 */
declare const radiansNormalise: (angleRadian: number) => number;
/**
 * Returns _true_ if `check` is between `start` and `end` angles, using 0...2PI range.
 *
 * Assumes a clockwise order. Ie. the checked angle is a wedge from `start`,
 * clockwise to `end`.
 *
 * Tip: use {@link radiansNormalise} on all angles first if uncertain if they are on 0...2PI range.
 * @param check
 * @param start
 * @param end
 * @returns
 */
declare const radiansBetweenCircular: (check: number, start: number, end: number) => boolean;
/**
 * Given two radian (0..2PI) angles, it returns the sweep angles
 * between them that is either minimised or maximised.
 * @param a
 * @param b
 */
declare const radianRange: (a: number, b: number) => {
  min: {
    start: number;
    end: number;
    sweep: number;
  };
  max: {
    start: number;
    end: number;
    sweep: number;
  };
};
//#endregion
export { radiansSum as C, turnToRadian as D, turnToDegree as E, radiansNormalise as S, toUnitVector as T, radianToDegree as _, degreeArc as a, radiansBetweenCircular as b, degreeToTurn as c, gradianToDegree as d, gradianToRadian as f, radianRange as g, radianInvert as h, average as i, degreesSum as l, radianArc as m, angleConvert as n, degreeToGradian as o, isAngleType as p, angleParse as r, degreeToRadian as s, Angle as t, fromUnitVector as u, radianToGradian as v, toRadian as w, radiansFromAxisX as x, radianToTurn as y };