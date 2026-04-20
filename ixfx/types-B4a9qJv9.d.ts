//#region ../packages/random/src/types.d.ts
/**
 * A random source.
 *
 * Predefined sources: Math.random, {@link gaussianSource}, {@link weightedSource}
 */
type RandomSource = () => number;
type WeightedOptions = RandomNumberOptions & Readonly<{
  easingFunction: (v: number) => number;
  easing?: string;
}>;
type StringOptions = Readonly<{
  length: number;
  source?: RandomSource;
}>;
type RandomOptions = Readonly<{
  source?: RandomSource;
}>;
type RandomNumberOptions = RandomOptions & Readonly<{
  max?: number;
  min?: number;
}>;
/**
 * Options for generating a random boolean
 */
type RandomBooleanOptions = RandomOptions & Readonly<{
  /**
   * If a random value is above threshold, _true_ is returned,
   * otherwise _false_.
   * Defaults to 0.5
   */
  threshold?: number;
}>;
type GenerateRandomOptions = RandomNumberOptions & Readonly<{
  /**
   * If true, number range is looped
   */
  loop?: boolean;
}>;
//#endregion
export { RandomSource as a, RandomOptions as i, RandomBooleanOptions as n, StringOptions as o, RandomNumberOptions as r, WeightedOptions as s, GenerateRandomOptions as t };