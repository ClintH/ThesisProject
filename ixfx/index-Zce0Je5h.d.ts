import { a as RandomSource } from "./types-B4a9qJv9.js";
import { t as Angle } from "./angles-F5jU9AX1.js";

//#region ../packages/visual/src/colour/types.d.ts
type HslBase = {
  /**
   * Hue
   */
  h: number;
  /**
   * Saturation
   */
  s: number;
  /**
   * Lightness
   */
  l: number;
  /**
   * Opacity
   */
  opacity?: number;
  space?: `hsl`;
};
type ColourSpaces = `srgb` | `hsl` | `oklch`;
/**
 * Scalar values use 0..1 for each field
 */
type HslScalar = HslBase & {
  unit: `scalar`;
};
/**
 * Absolute values use hue:0..360, all other fields 0..100
 */
type HslAbsolute = HslBase & {
  unit: `absolute`;
};
/**
 * HSL value.
 * By default assumes scalar coordinates (0..1) for each field.
 * Use 'absolute' unit for hue:0...360, all other fields on 0..100 scale.
 */
type Hsl = HslScalar | HslAbsolute;
/**
 * Rgb.
 * Units determine how to interperet rgb values.
 * * 'scalar': 0..1 range for RGB & opacity
 * * '8bit': 0..255 range for RGB & opacity
 */
type RgbBase = {
  r: number;
  g: number;
  b: number;
  opacity?: number;
  space?: `srgb`;
};
type RgbScalar = RgbBase & {
  unit: `scalar`;
};
/**
 * RGB in 0...255 range, including opacity.
 */
type Rgb8Bit = RgbBase & {
  unit: `8bit`;
};
/**
 * Rgb.
 * Units determine how to interperet rgb values.
 * * 'scalar': 0..1 range for RGB & opacity
 * * '8bit': 0..255 range for RGB & opacity
 */
type Rgb = RgbScalar | Rgb8Bit;
type LchBase = {
  /**
   * Lightness/perceived brightnes
   */
  l: number;
  /**
   * Chroma ('amount of colour')
   */
  c: number;
  /**
   * Hue
   */
  h: number;
  /**
   * Opacity on 0..1 scale
   */
  opacity?: number;
  space: `lch` | `oklch`;
};
type ColourInterpolator<T extends Colour> = (amount: number) => T;
type OkLchBase = LchBase & {
  space: `oklch`;
};
/**
 * Oklch colour expressed in 0..1 scalar values for LCH & opacity
 */
type OkLchScalar = OkLchBase & {
  unit: `scalar`;
};
/**
 * Oklch colour expressed with:
 * l: 0..1
 * c: 0..4
 * h: 0..360 degrees
 * opacity: 0..1
 */
type OkLchAbsolute = OkLchBase & {
  unit: `absolute`;
};
type OkLch = OkLchAbsolute | OkLchScalar;
type Colour = {
  opacity?: number;
} & (Hsl | OkLch | Rgb);
/**
 * A representation of colour. Eg: `blue`, `rgb(255,0,0)`, `hsl(20,100%,50%)`
 */
type Colourish = Colour | string;
/**
 * Options for interpolation
 */
type ColourInterpolationOpts = {
  direction: `longer` | `shorter`;
  space: ColourSpaces;
};
type ColourStepOpts = ColourInterpolationOpts & {
  /**
   * If set, determines total number of steps, including colour stops.
   * Use this _or_ `stepsBetween`.
   */
  stepsTotal?: number;
  /**
   * If set, determines number of steps between colour stops.
   * Use this _or_ `stepsTotal`.
   */
  stepsBetween?: number;
};
type ParsingOptions<T> = Partial<{
  scalar: boolean;
  ensureSafe: boolean;
  /**
   * Value to use if input is invalid
   */
  fallbackString: string;
  /**
   * Fallback colour to use if value cannot be parsed
   */
  fallbackColour: T;
}>;
//#endregion
//#region ../node_modules/.pnpm/colorizr@4.0.1/node_modules/colorizr/dist/index.d.mts
type ColorType = 'hex' | 'hsl' | 'oklab' | 'oklch' | 'rgb';
type HEX = `#${string}`;
interface Analysis {
  brightnessDifference: number;
  colorDifference: number;
  compliant: number;
  contrast: number;
  largeAA: boolean;
  largeAAA: boolean;
  normalAA: boolean;
  normalAAA: boolean;
}
interface HSL {
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  h: number;
  l: number;
  s: number;
}
interface LAB {
  a: number;
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  b: number;
  l: number;
}
interface LCH {
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  c: number;
  h: number;
  l: number;
}
interface RGB {
  /** The alpha/opacity value (0-1). */
  alpha?: number;
  b: number;
  g: number;
  r: number;
}
interface ColorizrOptions {
  /**
   * Output color format.
   *
   * If not specified, the output will use the same format as the input color.
   */
  format?: ColorType;
}
declare class Colorizr {
  /** The alpha/opacity value (0-1). */
  alpha: number;
  hex: HEX;
  hsl: HSL;
  oklab: LAB;
  oklch: LCH;
  rgb: RGB;
  type: ColorType;
  constructor(color: string | HSL | LAB | LCH | RGB, options?: ColorizrOptions);
  /**
   * Get CSS string
   */
  get css(): string;
  /**
   * Get the red value
   */
  get red(): number;
  /**
   * Get the green value
   */
  get green(): number;
  /**
   * Get the blue value
   */
  get blue(): number;
  /**
   * Get the hue value
   */
  get hue(): number;
  /**
   * Get the saturation value
   */
  get saturation(): number;
  /**
   * Get the lightness value
   */
  get lightness(): number;
  /**
   * Get the luminance value
   */
  get luminance(): number;
  /**
   * Get the chroma value
   */
  get chroma(): number;
  get opacity(): number;
  /**
   * Get the most readable color (light or dark) for this color as a background.
   */
  get readableColor(): string;
  private get currentColor();
  /**
   * Get the brightness difference between this color and another.
   *
   * @param input - The color to compare against.
   * @returns The brightness difference value.
   */
  brightnessDifference(input: string): number;
  /**
   * Get the color difference between this color and another.
   *
   * @param input - The color to compare against.
   * @returns The color difference value.
   */
  colorDifference(input: string): number;
  /**
   * Test 2 colors for WCAG compliance.
   *
   * @param input - The color to compare against.
   * @returns Analysis object with compliance information.
   */
  compare(input: string): Analysis;
  /**
   * Get the contrast ratio between this color and another.
   *
   * @param input - The color to compare against.
   * @returns The contrast ratio.
   */
  contrast(input: string): number;
  /**
   * Format the color to a specific type.
   *
   * @param type - The color format to convert to.
   * @param precision - The decimal precision for the output.
   * @returns The formatted color string.
   */
  format(type: ColorType, precision?: number): string;
  /**
   * Increase lightness.
   *
   * @param amount - A number between 0 and 100.
   * @returns The lightened color string.
   */
  lighten(amount: number): string;
  /**
   * Decrease lightness.
   *
   * @param amount - A number between 0 and 100.
   * @returns The darkened color string.
   */
  darken(amount: number): string;
  /**
   * Increase saturation.
   *
   * @param amount - A number between 0 and 100.
   * @returns The saturated color string.
   */
  saturate(amount: number): string;
  /**
   * Decrease saturation.
   *
   * @param amount - A number between 0 and 100.
   * @returns The desaturated color string.
   */
  desaturate(amount: number): string;
  /**
   * Convert to grayscale.
   *
   * @returns The grayscale color string.
   */
  grayscale(): string;
  /**
   * Invert color.
   *
   * @returns The inverted color string.
   */
  invert(): string;
  /**
   * Mix with another color.
   *
   * @param color - The color to mix with.
   * @param ratio - A number between 0 and 1 (0 = this color, 1 = input color).
   * @returns The mixed color string.
   */
  mix(color: string, ratio?: number): string;
  /**
   * Add opacity to the color.
   *
   * @param alpha - A number between 0 and 1.
   * @returns The opacified color string.
   */
  opacify(alpha?: number): string;
  /**
   * Rotate color hue.
   *
   * @param degrees - A number between -360 and 360.
   * @returns The rotated color string.
   */
  rotate(degrees: number): string;
  /**
   * Make the color more transparent.
   *
   * @param alpha - A number between -1 and 1.
   * @returns The transparentized color string.
   */
  transparentize(alpha?: number): string;
}
/**
 * Check 2 colors for WCAG compliance.
 *
 * @param left - The first color string.
 * @param right - The second color string.
 * @returns Analysis object with WCAG compliance information.
 */
//#endregion
//#region ../packages/visual/src/colour/conversion.d.ts
type ConvertDestinations = `hsl-scalar` | `hsl-absolute` | `oklch-scalar` | `oklch-absolute` | `srgb-8bit` | `srgb-scalar`;
declare function convert<T extends ConvertDestinations>(colour: Colourish, destination: T): T extends "oklch-absolute" ? OkLchAbsolute : T extends "oklch-scalar" ? OkLchScalar : T extends "srgb-8bit" ? Rgb8Bit : T extends "srgb-scalar" ? RgbScalar : T extends "hsl-scalar" ? HslScalar : T extends "hsl-absolute" ? HslAbsolute : never;
/**
 * Like {@link convert}, but result is a CSS colour string
 * @param colour
 * @param destination
 * @returns
 */
declare function convertToString(colour: Colourish, destination: ConvertDestinations): string;
declare function convertScalar<T extends ColourSpaces>(colour: Colourish, destination: T): T extends "oklch" ? OkLchScalar : T extends "hsl" ? HslScalar : T extends "srgb" ? RgbScalar : never;
declare const toCssColour: (colour: Colourish | object) => string;
declare const toHexColour: (colour: Colourish | object) => string;
declare const toLibraryColour: (colour: Colourish) => Colorizr;
declare const guard$3: (colour: Colour) => void;
declare const toColour: (colourish: any) => Colour;
/**
 * Returns a CSS-ready string
 * representation.
 * ```js
 * element.style.backgroundColor = resolveToString(`red`);
 * ```
 *
 * Tries each parameter in turn, returning the value
 * for the first that resolves. This can be useful for
 * having fallback values.
 *
 * ```js
 * // Try a CSS variable, a object property or finally fallback to red.
 * element.style.backgroundColor = toStringFirst('--some-var', opts.background, `red`);
 * ```
 * @param colours Array of colours to resolve
 * @returns
 */
declare const toStringFirst: (...colours: (Colourish | undefined)[]) => string;
declare function rgbToHsl(rgb: Rgb, scalarResult: true): HslScalar;
declare function rgbToHsl(rgb: Rgb, scalarResult: false): HslAbsolute;
//#endregion
//#region ../packages/visual/src/colour/css-colours.d.ts
/**
 * Converts from some kind of colour that is legal in CSS
 * into a structured Colour type.
 *
 * Handles: hex format, CSS variables, colour names
 * ```js
 * fromCssColour(`#ffffff`);
 * fromCssColour(`blue`);
 * fromCssColour(`--some-variable`);
 * fromCssColour(`hsl(50, 50%, 50%)`);
 * fromCssColour(`rgb(50, 100, 100)`);
 * ```
 * @param colour
 * @returns
 */
declare const fromCssColour: (colour: string) => Colour;
/**
 * Resolves a named colour to a colour string.
 *
 * ```js
 * resolveCss(`red`);
 * ```
 * @param colour CSS named colour
 * @returns
 */
declare function resolveCss(colour: CssColourNames): string;
type CssColourNames = keyof typeof cssDefinedHexColours;
declare const cssDefinedHexColours: Record<string, string>;
//#endregion
//#region ../packages/visual/src/colour/generate.d.ts
/**
 * Returns a full HSL colour string (eg `hsl(20,50%,75%)`) based on a index.
 * It's useful for generating perceptually different shades as the index increments.
 *
 * ```
 * el.style.backgroundColor = goldenAgeColour(10);
 * ```
 *
 * Saturation and lightness can be specified, as numeric ranges of 0-1.
 *
 * @param saturation Saturation (0-1), defaults to 0.5
 * @param lightness Lightness (0-1), defaults to 0.75
 * @param alpha Opacity (0-1), defaults to 1.0
 * @returns HSL colour string eg `hsl(20,50%,75%)`
 */
declare const goldenAngleColour: (index: number, saturation?: number, lightness?: number, alpha?: number) => string;
/**
 * Returns a random hue component (0..359)
 *
 * ```
 * // Generate hue
 * const h = randomHue(); // 0-359
 *
 * // Generate hue and assign as part of a HSL string
 * el.style.backgroundColor = `hsl(${randomHue(), 50%, 75%})`;
 * ```
 * @param rand
 * @returns
 */
declare const randomHue: (rand?: RandomSource) => number;
//#endregion
//#region ../packages/visual/src/colour/guards.d.ts
declare const isHsl: (v: any) => v is Hsl;
declare const isRgb: (v: any) => v is Rgb;
/**
 * If the input object has r,g&b properties, it will return a fully-
 * formed Rgb type with `unit` and `space` properties.
 *
 * If it lacks these basic three properties or they are out of range,
 *  _undefined_ is returned.
 *
 * If RGB values are less than 1 assumes unit:scalar. Otherwise unit:8bit.
 * If RGB values exceed 255, _undefined_ returned.
 * @param v
 * @returns
 */
declare const tryParseObjectToRgb: (v: any) => Rgb | undefined;
declare const tryParseObjectToHsl: (v: any) => Hsl | undefined;
declare const isOkLch: (v: any) => v is OkLch;
declare const isColourish: (v: any) => v is Colourish;
//#endregion
//#region ../packages/visual/src/colour/math.d.ts
declare function multiplyOpacity<T extends Colourish>(colourish: T, amount: number): T extends string ? string : T extends Hsl ? Hsl : T extends OkLch ? OkLch : T extends Rgb ? Rgb : never;
/**
 * Does a computation with the opacity of a colour, returning colour string
 * @param colourish Colour
 * @param fn Function that takes original opacity as input and returns output opacity
 */
/**
 * Does a computation with the opacity of a colour in a HSL structure
 * @param hsl Colour
 * @param fn Function that takes original opacity as input and returns output opacity
 */
/**
 * Does a computation with the opacity of a colour in a RGB structure
 * @param colourish Colour
 * @param fn Function that takes original opacity as input and returns output opacity
 */
declare function withOpacity$3<T extends Colourish>(colourish: T, fn: (scalarOpacity: number) => number): T extends string ? string : T extends Hsl ? Hsl : T extends OkLch ? OkLch : T extends Rgb ? Rgb : never;
declare function setOpacity<T extends Colourish>(colourish: T, amount: number): T extends string ? string : T extends Hsl ? Hsl : T extends OkLch ? OkLch : T extends Rgb ? Rgb : never;
//#endregion
//#region ../packages/visual/src/colour/interpolate.d.ts
/**
 * Returns a CSS `linear-gradient` with stops corresponding to the given list of `colours`.
 * ```js
 * element.style.background = Colour.cssLinearGradient(['red','green','blue']);
 * ```
 * @param colours
 * @returns
 */
declare const cssLinearGradient: (colours: Colourish[]) => string;
/**
 * Returns a function that interpolates between two colours. Returns string colour values.
 *
 * By default takes a shorter direction and uses the OkLCH colourspace.
 * ```js
 * const i = interpolator(`blue`, `red`);
 * i(0.5); // Get the colour at 50%, as a string.
 * ```
 *
 * To work with structured colour values, use one of the space's `interpolate` functions.
 *
 * If you want to create discrete steps, consider {@link createSteps} or {@link scale}.
 *
 * @param colourA
 * @param colourB
 * @param options
 * @returns
 */
declare const interpolator$3: (colourA: Colourish, colourB: Colourish, options?: Partial<ColourInterpolationOpts>) => (amount: number) => string;
/**
 * Produces a stepped scale of colours.
 *
 * Builds off {@link createSteps} which can only step between two colours.
 *
 * ```js
 * // A scale of from red to green, with three colours in-between
 * const steps = Colour.scale([ `red`, `green` ], { stepsBetween: 3 });
 * for (const step of steps) {
 *  // A CSS colour string
 * }
 * ```
 *
 * {@link cssLinearGradient} can produce a smooth gradient in CSS on the basis
 * of the stepped colours.
 * @param colours
 * @param opts
 * @returns
 */
declare const scale: (colours: Colourish[], opts?: Partial<ColourStepOpts>) => string[];
type CreateStepsOptions = Partial<{
  space: ColourSpaces;
  steps: number;
  direction: `longer` | `shorter`;
  exclusive: boolean;
}>;
/**
 * Creates discrete colour steps between two colours.
 *
 * Use {@link scale} to create steps between any number of colours.
 *
 * Start and end colours are included (and counted as a step) unless `exclusive` is set to _true_
 *
 * ```js
 * // Array of five HslScalar
 * createSteps(`red`,`blue`, { steps: 5 });
 * ```
 *
 * Defaults to the oklch colour space, 5 steps and non-exclusive.
 * @param a Start colour
 * @param b End colour
 * @param options
 * @returns
 */
declare function createSteps<T extends CreateStepsOptions>(a: Colourish | string, b: Colourish, options: T): T extends {
  space: `oklch`;
} ? OkLchScalar[] : T extends {
  space: `srgb`;
} ? RgbScalar[] : T extends {
  space: `hsl`;
} ? HslScalar[] : OkLchScalar[];
declare namespace hsl_d_exports {
  export { absolute$1 as absolute, changeLightness$1 as changeLightness, fromCss$2 as fromCss, fromHexString$2 as fromHexString, generateScalar$1 as generateScalar, guard$2 as guard, interpolator$2 as interpolator, parseCssHslFunction, scalar$2 as scalar, toAbsolute$1 as toAbsolute, toCssString$2 as toCssString, toHexString$2 as toHexString, toLibraryRgb, toScalar$2 as toScalar, withOpacity$2 as withOpacity };
}
/**
 * Scales the opacity value of an input HSL value
 * ```js
 * withOpacity()
 * ```
 * @param value Colour
 * @param fn Function that calcules opacity based on input scalar value
 * @returns
 */
declare const withOpacity$2: <T extends Hsl>(value: T, fn: (opacityScalar: number, value: T) => number) => T;
/**
 * Increases or decreases lightness by this percentage, returning new colour
 *
 * Amount to change:
 * * 'fixed': a fixed amount
 * * 'delta': increase/decrease by this amount
 * * 'pdelta': proportion of current value to change by ('percentage delta')
 *
 * ```
 * const colour = { h: 0.5, s: 0.5, l: 0.5, space: `hsl`, unit: `scalar` };
 * changeLightness(colour, { pdelta: 0.1 }); // l: 0.55
 * changeLightness(colour, { delta: 0.1 });  // l: 0.6
 * changeLightness(colour, { fixed: 0.5 });  // l: 0.5
 * ```
 *
 * Keep in mind the numerical value will depend on the unit of `value`. If it's scalar,
 * lightness is 0..1 scale, otherwise 0..100 scale.
 *
 * Use negative values to decrease (does not apply to 'fixed')
 * @param value Hsl colour
 * @param amount Amount to change
 */
declare const changeLightness$1: (value: Hsl, amount: Partial<{
  pdelta: number;
  delta: number;
  fixed: number;
}>) => Hsl;
declare function fromHexString$2<T extends ParsingOptions<Hsl>>(hexString: string, scalar: T): T extends {
  scalar: true;
} ? HslScalar : HslAbsolute;
declare function fromCss$2<T extends ParsingOptions<Hsl>>(value: string, options?: T): T extends {
  scalar: true;
} ? HslScalar : HslAbsolute;
declare const toCssString$2: (hsl: Hsl) => string;
declare const toHexString$2: (hsl: Hsl) => string;
declare const toAbsolute$1: (hslOrString: Hsl | Rgb | string) => HslAbsolute;
/**
 * Generates a {@link HslScalar} value.
 *
 * ```js
 * generateScaler(10); // 10deg, default to full saturation, half lightness and full opacity
 *
 * // Generate HSL value from radian angle and 50% saturation
 * generateScalar(`10rad`, 0.5);
 *
 * // Generate from numeric CSS variable
 * generateScalar(`--hue`);
 * ```
 * @param absoluteHslOrVariable Hue angle or CSS variable
 * @param saturation
 * @param lightness
 * @param opacity
 */
declare const generateScalar$1: (absoluteHslOrVariable: string | number | Angle, saturation?: number, lightness?: number, opacity?: number) => HslScalar;
/**
 * Converts a {@link Hsl} value to scalar units, or parses a colour string
 * and converts it.
 *
 * ```js
 * toScalar({ h: 100, s: 50, l: 100, unit: `absolute` });
 * toScalar(`red`);
 * ```
 * @param hslOrString
 * @returns
 */
declare const toScalar$2: (hslOrString: Rgb | Hsl | string) => HslScalar;
declare const guard$2: (hsl: Hsl) => void;
declare const interpolator$2: (a: Hsl | string, b: Hsl | string, direction?: `longer` | `shorter`) => (amount: number) => HslScalar;
/**
 * Creates a HslScalar value from scalar (0..1) values
 * @param hue
 * @param sat
 * @param lightness
 * @param opacity
 * @returns
 */
declare function scalar$2(hue?: number, sat?: number, lightness?: number, opacity?: number): HslScalar;
declare function absolute$1(hue?: number, sat?: number, lightness?: number, opacity?: number): HslAbsolute;
/**
 * It seems Colorizr can't handle 'deg' units
 * @param value
 */
declare function parseCssHslFunction(value: string): Hsl;
/**
 * Converts a Hsl structure (or CSS string) to Colorizr's RGB format
 * @param hsl HSL colour
 * @returns
 */
declare function toLibraryRgb(hsl: Hsl | string): RGB;
declare namespace oklch_d_exports {
  export { OKLCH_CHROMA_MAX, absolute, fromCss$1 as fromCss, fromHexString$1 as fromHexString, fromLibrary, generateScalar, guard$1 as guard, interpolator$1 as interpolator, scalar$1 as scalar, toAbsolute, toCssString$1 as toCssString, toHexString$1 as toHexString, toScalar$1 as toScalar, withOpacity$1 as withOpacity };
}
declare const OKLCH_CHROMA_MAX = 0.4;
declare const guard$1: (lch: OkLch) => void;
/**
 * Coverts from the Colorizr library
 * Tests ranges:
 * * l: 0..1
 * * c: 0..1
 * * h: 0..360
 * * alpha: 0..1
 *
 * Default option: { scalar: true }
 * @param lch LCH value
 * @param parsingOptions Options for parsing
 * @returns
 */
declare function fromLibrary<T extends ParsingOptions<OkLch>>(lch: LCH, parsingOptions: T): T extends {
  scalar: true;
} ? OkLchScalar : OkLchAbsolute;
/**
 * Parse a HEX-formatted colour into OkLch structured format
 * @param hexString
 * @param options
 * @returns
 */
declare const fromHexString$1: (hexString: string, options?: ParsingOptions<OkLch>) => OkLch;
/**
 * Converts from some CSS-representation of colour to a structured OkLch format.
 *
 * ```js
 * fromCss(`yellow`);
 * fromCss(`rgb(100,200,90)`);
 * fromCss(`#ff00ff`);
 * ```
 *
 * By default returns a {@link OkLchScalar} (relative) representation. Use the flag 'scalar:true' to get back
 * {@link OkLchAbsolute}.
 * @param value
 * @param options
 */
declare function fromCss$1<T extends ParsingOptions<OkLch>>(value: string, options: T): T extends {
  scalar: true;
} ? OkLchScalar : OkLchAbsolute;
/**
 * Returns a string or {@link OkLch} value to absolute form.
 *
 * This means ranges are:
 * * lightness: 0..1
 * * chroma: 0...CHROMA_MAX (0.4)
 * * hue: 0..360
 * @param lchOrString
 * @returns
 */
declare const toAbsolute: (lchOrString: OkLch | string) => OkLchAbsolute;
declare const toScalar$1: (lchOrString: OkLch | string) => OkLchScalar;
/**
 * Returns the colour as a CSS colour string: `oklch(l c h / opacity)`.
 *
 * @param lch Colour
 * @param precision Set precision of numbers, defaults to 3
 * @returns CSS colour string
 */
declare const toCssString$1: (lch: OkLch, precision?: number) => string;
declare const toHexString$1: (lch: OkLch) => string;
declare const generateScalar: (absoluteHslOrVariable: string | number | Angle, chroma?: number, lightness?: number, opacity?: number) => OkLchScalar;
/**
 * Scales the opacity value of an input Oklch value
 * ```js
 * withOpacity()
 * ```
 * @param value
 * @param fn
 * @returns
 */
declare const withOpacity$1: <T extends OkLch>(value: T, fn: (opacityScalar: number, value: T) => number) => T;
declare const interpolator$1: (a: OkLch | string, b: OkLch | string, direction?: `longer` | `shorter`) => (amount: number) => OkLchScalar;
declare function scalar$1(lightness?: number, chroma?: number, hue?: number, opacity?: number): OkLchScalar;
/**
 * Create an LCH colour using absolute hue
 * @param l Lightness 0..1
 * @param c Chroma 0..4
 * @param h Hue 0..360
 * @param opacity
 * @returns
 */
declare const absolute: (l: number, c: number, h: number, opacity?: number) => OkLchAbsolute;
declare namespace srgb_d_exports {
  export { changeLightness, eightBit, fromCss, fromHexString, guard, interpolator, lightness, parseCssRgbFunction, scalar, to8bit, toCssString, toHexString, toLibraryHsl, toScalar, withOpacity };
}
declare const withOpacity: <T extends Rgb>(value: T, fn: (opacityScalar: number, value: T) => number) => T;
declare function fromHexString<T extends boolean>(hexString: string, scalar: T): T extends true ? RgbScalar : Rgb8Bit;
declare function fromCss<T extends ParsingOptions<Rgb>>(value: string, options: T): T extends {
  scalar: true;
} ? RgbScalar : Rgb8Bit;
declare const toHexString: (rgb: Rgb) => string;
declare const toCssString: (rgb: Rgb) => string;
declare const to8bit: (rgbOrString: Rgb | string) => Rgb8Bit;
declare const toScalar: (rgbOrString: Rgb | Hsl | string) => RgbScalar;
declare const guard: (rgb: Rgb) => void;
/**
 * Sets the lightness value.
 *
 * Amount to change:
 * * 'fixed': a fixed amount
 * * 'delta': increase/decrease by this amount
 * * 'pdelta': proportion of current value to change by ('percentage delta')
 *
 * Use negative values to decrease
 * @param rgb Colour
 * @param amount Amount to change
 */
declare const changeLightness: (rgb: Rgb, amount: Partial<{
  pdelta: number;
  delta: number;
  fixed: number;
}>) => Rgb;
/**
 * Returns a lightness value (0..1) for an RGB input
 *
 * Calculates lightness by converting to Oklab and using the 'L' value
 * @param rgb
 * @returns
 */
declare function lightness(rgb: Rgb): number;
/**
 * Creates a Rgb8Bit value from 8bit (0..255) values
 * @param red
 * @param green
 * @param blue
 * @param opacity
 * @returns
 */
declare function eightBit(red?: number, green?: number, blue?: number, opacity?: number): Rgb8Bit;
/**
 * Creates a RgbScalar value from scalar (0..1) values
 * @param red
 * @param green
 * @param blue
 * @param opacity
 * @returns
 */
declare function scalar(red?: number, green?: number, blue?: number, opacity?: number): RgbScalar;
/**
 * It seems Colorizr can't handle % values properly :'(
 * @param value
 */
declare function parseCssRgbFunction(value: string): Rgb;
/**
 * Interpolates colours in Srgb space. Probably
 * really ugly, use OkLch space isntead.
 *
 * ```js
 * const i = interpolator(`red`, `blue`);
 * i(0.5); // Get 50% between these colours
 * ```
 * @param colourA
 * @param colourB
 * @returns
 */
declare const interpolator: (colourA: Rgb | string, colourB: Rgb | string) => (amount: number) => RgbScalar;
/**
 * Converts a Rgb structure (or CSS string) to Colorizr's HSL format
 * @param rgb
 * @returns
 */
declare function toLibraryHsl(rgb: Rgb | string): HSL;
//#endregion
//#region ../packages/visual/src/colour/to-integer.d.ts
/**
 * Encode 8-bit RGB values into a 24-bit value (0...16_777_215)
 *
 * Assumes RGB values are within 0..255 range
 * @param rgb
 * @returns
 */
declare function encodeRgbTo24Bit(rgb: Rgb8Bit | RgbBase): number;
/**
 * Decode a 24-bit number (0...16_777_215) into 8-bit RGB
 * @param colour
 * @returns
 */
declare function decodeRgbFrom24Bit(colour: number): Rgb8Bit;
/**
 * Encodes 8-bit RGB value into 16-bit RGB565 (0..65_535)
 * 5-bit are used for R & B channels, 6 bits for G
 *
 * Read more: https://rgbcolorpicker.com/565
 * @param rgb
 * @returns
 */
declare function encodeRgbTo16Bit565(rgb: Rgb8Bit | RgbBase): number;
/**
 * Decodes 8-bit RGB value from a 16-bit RGB565 value (0...65_535)
 * Read more: https://rgbcolorpicker.com/565
 * @param colour
 * @returns
 */
declare function decodeRgbFrom16Bit565(colour: number): Rgb8Bit;
declare namespace index_d_exports {
  export { Colour, ColourInterpolationOpts, ColourInterpolator, ColourSpaces, ColourStepOpts, Colourish, ConvertDestinations, CreateStepsOptions, CssColourNames, Hsl, HslAbsolute, HslBase, HslScalar, hsl_d_exports as HslSpace, LchBase, OkLch, OkLchAbsolute, OkLchBase, OkLchScalar, oklch_d_exports as OklchSpace, ParsingOptions, Rgb, Rgb8Bit, RgbBase, RgbScalar, srgb_d_exports as SrgbSpace, convert, convertScalar, convertToString, createSteps, cssDefinedHexColours, cssLinearGradient, decodeRgbFrom16Bit565, decodeRgbFrom24Bit, encodeRgbTo16Bit565, encodeRgbTo24Bit, fromCssColour, goldenAngleColour, guard$3 as guard, interpolator$3 as interpolator, isColourish, isHsl, isOkLch, isRgb, multiplyOpacity, randomHue, resolveCss, rgbToHsl, scale, setOpacity, toColour, toCssColour, toHexColour, toLibraryColour, toStringFirst, tryParseObjectToHsl, tryParseObjectToRgb, withOpacity$3 as withOpacity };
}
//#endregion
export { Rgb8Bit as i, HslScalar as n, Rgb as r, index_d_exports as t };