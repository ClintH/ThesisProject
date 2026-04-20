import { i as Interval } from "./types-DhLXV-YQ.js";
import { a as RectPositioned, t as Rect } from "./rect-types-C3cN9Uxl.js";

//#region ../packages/dom/src/element-sizing.d.ts
/**
 * * width: use width of parent, set height based on original aspect ratio of element. Assumes parent has a determined width.
 * * height: use height of parent, set width based on original aspect ratio of element. Assumes parent has a determined height.
 * * both: use height & width of parent, so the element adopts the ratio of the parent. Be sure that parent has a width and height set.
 * * min: use the smallest dimension of parent
 * * max: use the largest dimension of parent
 */
type ElementResizeLogic = `width` | `height` | `both` | `none` | `min` | `max`;
/**
 * Options
 */
type ElementSizerOptions<T extends HTMLElement | SVGElement> = {
  /**
   * @defaultValue 'none'
   */
  stretch?: ElementResizeLogic;
  naturalSize?: Rect;
  /**
   * If not specified, the element's parent is used
   */
  containerEl?: HTMLElement | string | null;
  onSizeChanging?: (size: Rect, el: T) => void;
  onSizeDone?: (size: Rect, el: T) => void;
  debounceTimeout?: Interval;
};
/**
 * Consider using static methods:
 *
 * ```js
 * // Resize an <SVG> element to match viewport
 * Dom.ElementSizer.svgViewport(svg);
 *
 * // Resize canvas to match its parent
 * Dom.ElementSizer.canvasParent(canvas);
 *
 * // Resize canvas to match viewport
 * Dom.ElementSizer.canvasViewport(canvas);
 * ```
 */
declare class ElementSizer<T extends HTMLElement | SVGElement> {
  #private;
  constructor(elOrQuery: T | string, options: ElementSizerOptions<T>);
  dispose(reason?: string): void;
  static canvasParent(canvasElementOrQuery: HTMLCanvasElement | string, options: ElementSizerOptions<HTMLCanvasElement>): ElementSizer<HTMLCanvasElement>;
  static canvasViewport(canvasElementOrQuery: HTMLCanvasElement | string, options: {
    zIndex?: number;
  } & ElementSizerOptions<HTMLCanvasElement>): ElementSizer<HTMLCanvasElement>;
  /**
   * Size an SVG element to match viewport
   * @param svg
   * @returns
   */
  static svgViewport(svg: SVGElement, onSizeSet?: (size: Rect) => void): ElementSizer<SVGElement>;
  /**
   * Sets the 'natural' size of an element.
   * This can also be specified when creating ElementSizer.
   * @param size
   */
  setNaturalSize(size: Rect): void;
  get naturalSize(): Rect;
  get viewport(): RectPositioned;
  set size(size: Rect);
  get size(): Rect;
}
//#endregion
export { ElementSizer as n, ElementSizerOptions as r, ElementResizeLogic as t };