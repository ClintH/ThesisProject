import { n as Result } from "./types-CSh98G0p.js";
import { i as Point3d, r as Point } from "./point-type-DLbh1Hzz.js";
import { o as GridCardinalDirection } from "./index-3c5aUDaq.js";
import { a as RectPositioned } from "./rect-types-C3cN9Uxl.js";
import { n as ElementSizer, r as ElementSizerOptions, t as ElementResizeLogic } from "./element-sizing-DdN9JoCS.js";

//#region ../packages/dom/src/data-table.d.ts
declare namespace data_table_d_exports {
  export { DataFormatter, DataTable, DataTableOpts, FormattingOptions, NumberFormattingOptions, fromList, fromObject };
}
type NumberFormattingOptions = Readonly<{
  precision?: number;
  roundNumbers?: number;
  leftPadding?: number;
}>;
type FormattingOptions = Readonly<{
  numbers: NumberFormattingOptions;
}>;
type DataTableOpts = FormattingOptions & {
  readonly formatter?: DataFormatter;
  readonly objectsAsTables?: boolean;
  readonly idPrefix?: string;
};
type DataTable<V> = {
  update(data: V): void;
  remove(): boolean;
};
/**
 * Creates a table of data points for each object in the map
 * ```
 * const t = DataTable.fromList(parentEl, map);
 * t.update(newMap);
 * ```
 */
declare const fromList: (parentOrQuery: HTMLElement | string, data: Map<string, object>) => DataTable<Map<string, object>>;
/**
 * Format data. Return _undefined_ to signal that
 * data was not handled.
 */
type DataFormatter = (data: object, path: string) => string | undefined;
/**
 * Creates a HTML table where each row is a key-value pair from `data`.
 * First column is the key, second column data.
 *
 * ```js
 * const dt = fromObject(`#hostDiv`);
 * ```
 *
 * `dt` is a function to call when you want to update data:
 *
 * ```js
 * dt({
 *  name: `Blerg`,
 *  height: 120
 * });
 * ```
 */
declare const fromObject: (parentOrQuery: HTMLElement | string, data?: object, opts?: Partial<DataTableOpts>) => DataTable<object>;
declare namespace drag_drop_d_exports {
  export { DragListener, DragOptions, DragProgress, DragStart, DragState, draggable };
}
/**
 * State of drag
 */
type DragState = Readonly<{
  /**
   * Optional data, if this was given during drag start
   */
  token?: object;
  /**
   * Initial pointer position in viewport coordinates
   */
  initial: Point;
  /**
   * Delta of movement from initial position
   */
  delta: Point;
  /**
   * Viewport-relative current position
   */
  viewport: Point;
}>;
/**
 * Return data for `start` function
 */
type DragStart = Readonly<{
  /**
   * If _true_, drag start is allowed
   */
  allow: boolean;
  /**
   * Optional data to associate with drag
   */
  token?: object;
}>;
/**
 * Return data for `progress` function
 */
type DragProgress = Readonly<{
  /**
   * If true, aborts drag operation
   */
  abort?: boolean;
  /**
   * If returned, this will be viewport coordinates
   * to snap the drag to
   */
  viewport?: Point;
}>;
type DragListener = Readonly<{
  start?: () => DragStart;
  progress?: (state: DragState) => DragProgress;
  abort?: (reason: string, state: DragState) => void;
  success?: (state: DragState) => void;
}>;
type DragOptions = {
  autoTranslate: boolean;
  /**
   * If true, it's not necessary to select item first
   */
  quickDrag: boolean;
  fence: HTMLElement | string;
  fenceViewport: RectPositioned;
};
declare const draggable: (elemOrQuery: SVGElement | HTMLElement | string, listener: DragListener, options?: Partial<DragOptions>) => () => void;
declare namespace forms_d_exports {
  export { SelectHandler, SelectOpts, button, buttonCreate, checkbox, numeric, select, textAreaKeyboard };
}
/**
 * Adds tab and shift+tab to TEXTAREA
 * @param el
 */
declare const textAreaKeyboard: (el: HTMLTextAreaElement) => void;
/**
 * Quick access to <input type="checkbox"> value.
 * Provide a checkbox by string id or object reference. If a callback is
 * supplied, it will be called when the checkbox changes value.
 *
 * ```
 * const opt = checkbox(`#chkMate`);
 * opt.checked; // Gets/sets
 *
 * const opt = checkbox(document.getElementById(`#chkMate`), newVal => {
 *  if (newVal) ...
 * });
 * ```
 * @param {(string | HTMLInputElement)} domIdOrEl
 * @param {(currentVal:boolean) => void} [onChanged]
 * @returns
 */
declare const checkbox: (domIdOrEl: string | HTMLInputElement, onChanged?: (currentValue: boolean) => void) => {
  checked: boolean;
};
/**
 * Numeric INPUT
 *
 * ```
 * const el = numeric(`#num`, (currentValue) => {
 *  // Called when input changes
 * })
 * ```
 *
 * Get/set value
 * ```
 * el.value = 10;
 * ```
 * @param domIdOrEl
 * @param onChanged
 * @param live If true, event handler fires based on `input` event, rather than `change`
 * @returns
 */
declare const numeric: (domIdOrEl: string | HTMLInputElement, onChanged?: (currentValue: number) => void, live?: boolean) => {
  value: number;
};
/**
 * SELECT options
 */
type SelectOpts = {
  /**
   * Placeholder item
   */
  readonly placeholderOpt?: string;
  /**
   * If true, a placeholder option 'Choose' is added to the list
   */
  readonly shouldAddChoosePlaceholder?: boolean;
  /**
   * Item to choose after a selection is made
   */
  readonly autoSelectAfterChoice?: number;
};
/**
 * Button
 *
 * ```
 * const b = button(`#myButton`, () => {
 *  console.log(`Button clicked`);
 * });
 * ```
 *
 * ```
 * b.click(); // Call the click handler
 * b.disabled = true / false;
 * ```
 * @param domQueryOrEl Query string or element instance
 * @param onClickHandler Callback when button is clicked
 * @returns
 */
declare const button: (domQueryOrEl: string | HTMLButtonElement, onClickHandler?: () => void) => {
  /**
   * Gets text content of button
   */
  get title(): string | null;
  /**
   * Sets text content of button
   */
  set title(value: string);
  /**
   * Disposes the button.
   * Removes event handler and optionally removes from document
   * @param deleteElement
   */
  dispose(deleteElement?: boolean): void;
  /**
   * Sets the click handler, overwriting existing.
   * @param handler
   */
  onClick(handler?: () => void): void;
  /**
   * Trigger onClick handler
   */
  click(): void;
  /**
   * Sets disabled state of button
   */
  disabled: boolean;
  /**
   * Gets the button element
   */
  readonly el: HTMLButtonElement;
};
/**
 * Creates a BUTTON element, wrapping it via {@link button} and returning it.
 * ```js
 * const b = buttonCreate(`Stop`, () => console.log(`Stop`));
 * someParent.addNode(b.el);
 * ```
 * @param title
 * @param onClick
 * @returns
 */
declare const buttonCreate: (title: string, onClick?: () => void) => {
  /**
   * Gets text content of button
   */
  get title(): string | null;
  /**
   * Sets text content of button
   */
  set title(value: string): any;
  /**
   * Disposes the button.
   * Removes event handler and optionally removes from document
   * @param deleteElement
   */
  dispose(deleteElement?: boolean): void;
  /**
   * Sets the click handler, overwriting existing.
   * @param handler
   */
  onClick(handler?: () => void): void;
  /**
   * Trigger onClick handler
   */
  click(): void;
  /**
   * Sets disabled state of button
   */
  disabled: boolean;
  /**
   * Gets the button element
   */
  readonly el: HTMLButtonElement;
};
/**
 * SELECT handler
 */
type SelectHandler = {
  /**
   * Gets/Sets disabled
   */
  set disabled(value: boolean);
  get disabled(): boolean;
  /**
   * Gets value
   */
  get value(): string;
  /**
   * Sets selected index
   */
  get index(): number;
  /**
   * _True_ if currently selected item is the placeholder
   */
  get isSelectedPlaceholder(): boolean;
  /**
   * Set options
   * @param options Options
   * @param preSelect Item to preselect
   */
  setOpts(options: readonly string[], preSelect?: string): void;
  /**
   * Select item by index
   * @param index Index
   * @param trigger If true, triggers change event
   */
  select(index?: number, trigger?: boolean): void;
};
/**
 * SELECT element.
 *
 * Handle changes in value:
 * ```
 * const mySelect = select(`#mySelect`, (newValue) => {
 *  console.log(`Value is now ${newValue}`);
 * });
 * ```
 *
 * Enable/disable:
 * ```
 * mySelect.disabled = true / false;
 * ```
 *
 * Get currently selected index or value:
 * ```
 * mySelect.value / mySelect.index
 * ```
 *
 * Is the currently selected value a placeholder?
 * ```
 * mySelect.isSelectedPlaceholder
 * ```
 *
 * Set list of options
 * ```
 * // Adds options, preselecting `opt2`.
 * mySelect.setOpts([`opt1`, `opt2 ...], `opt2`);
 * ```
 *
 * Select an element
 * ```
 * mySelect.select(1); // Select second item
 * mySelect.select(1, true); // If true is added, change handler fires as well
 * ```
 * @param domQueryOrEl Query (eg `#id`) or element
 * @param onChanged Callback when a selection is made
 * @param options Options
 * @return
 */
declare const select: (domQueryOrEl: string | HTMLSelectElement, onChanged?: (currentValue: string) => void, options?: SelectOpts) => SelectHandler;
//#endregion
//#region ../packages/dom/src/css-variables.d.ts
/**
 * CSS Variable
 */
type CssVariable = {
  /**
   * CSS variable to read for the value. `--` prefix is not needed
   */
  variable: string;
  /**
   * Attribute name, eg 'width' for a Canvas element.
   */
  attribute?: string;
  field?: string;
  /**
   * Optional default value
   */
  defaultValue: string | undefined;
};
/**
 * CSS Variable by id
 */
type CssVariableByIdOption = CssVariable & {
  id: string;
};
/**
 * CSS variable by query
 */
type CssVariableByQueryOption = CssVariable & {
  query: string;
};
/**
 * CSS variable by element reference
 */
type CssVariableByObjectOption = CssVariable & {
  object: object | object[];
};
/**
 * CSS variable option
 */
type CssVariableOption = CssVariable & (CssVariableByObjectOption | CssVariableByIdOption | CssVariableByQueryOption);
/**
 * Parses input in the form of: `['elementid-attribute', 'default-value']`.
 * Eg, `['indicator-fill', 'gray']` will yield:
 * ```
 * { variable: `indicator-fill`, attribute: `fill`, id: `indicator`, defaultValue: `gray` }
 * ```
 *
 * Once parsed, use {@link setFromCssVariables} to apply data.
 *
 * ```js
 * // Array of arrays is treated as a set of key-value pairs
 * const options = [ [`indicator-fill`, `gray`], [`backdrop-fill`, `whitesmoke`] ]
 * const attrs = parseCssVariablesAsAttributes(options);
 * Yields:
 * [
 *  { variable: `indicator-fill`, attribute: `fill`, id: `indicator`, defaultValue: `gray` }
 *  { variable: `backdrop-fill`, attribute: `fill`, id: `backdrop`, defaultValue: `whitesmoke` }
 * ]
 *
 * // Assign
 * setFromCssVariables(document.body, attrs);
 * ```
 * @param options
 * @returns
 */
declare const parseCssVariablesAsAttributes: (options: (string | string[])[]) => (CssVariable & CssVariableByIdOption)[];
/**
 * Reads the value of a CSS variable and assign it to HTML attributes or object field.
 *
 * ```js
 * const options = [
 *  // Set the 'width' attribute to the value of --some-css-variable to all elements with class 'blah'
 *  { query: `.blah`, variable: `some-css-variable`, attribute: `width` }
 *
 *  // Set #blah's 'size' attribute to the value of css variable '--size'
 *  { id: 'blah', variable: 'size', attribute: 'size' }
 *
 *  // Sets someEL.blah = css variable '--hue'
 *  { element: someEl, variable: `hue`, field: `blah` }
 * ]
 *
 * setFromCssVariables(document.body, ...options);
 * ```
 *
 * The first parameter is the context for which CSS variable values are fetched
 * as well as for resolving query selectors. This can usually be `document.body`.
 * @param context Context element which is needed for relative querying. Otherwise use document.body
 * @param options Details of what to do
 */
declare const setFromCssVariables: (context: HTMLElement | string, ...options: CssVariableOption[]) => void;
/**
 * Computes the styles for `elt` (or defaults to document.body) using `fallback`
 * as a set of default values.
 *
 * ```js
 * // Fetch styles
 * const styles = getCssVariablesWithFallback({
 *  my_var: `red` // reads CSS variable '--my-var'
 * }, element);
 *
 * // Access --my-var, or if it doesn't exist returns 'red'
 * styles.my_var;
 * ```
 *
 * Hyphen case (eg 'my-var') is a common way of delimiting words in CSS variables, but
 * can't be (elegantly) used in object properties. Instead, use '_' in the
 * object key, which is replaced with '-'.
 *
 * The leading '--' is not needed either.
 * @param fallback
 * @param elt
 * @returns
 */
declare function getCssVariablesWithFallback<T extends Record<string, string | number>>(fallback: T, elt?: Element): T;
/**
 * Returns the value of a CSS variable. If it is no defined, returns `fallbackValue`;
 * ```js
 * // Returns the value of --fg, or 'white' otherwise
 * getCssVariable(`--fg`, `white`);
 * ```
 *
 * `--` prefix can be omitted:
 * ```js
 * getCssVariable(`fg`, `white`);
 * ```
 * @param cssVariable
 * @param fallbackValue
 * @returns
 */
declare function getCssVariable(cssVariable: string, fallbackValue: string): string;
/**
 * Sets CSS variables using an object.
 *
 * ```js
 * const vars = {
 *  my_var: `red`,
 *  my_size: 10
 * }
 *
 * // Set to document.body
 * setCssVariables(vars);
 *
 * // Set to an element
 * setCssVariables(vars, elem);
 *
 * // Or to a CSSStyleDeclaration
 * setCssVariables(vars, styles);
 * ```
 *
 * @param variables
 * @param stylesOrEl
 */
declare function setCssVariables<T extends Record<string, string | number>>(variables: T, stylesOrEl?: CSSStyleDeclaration | HTMLElement): void;
/**
 * Returns a CSS variable from a CSS style declaration, or returning `fallback`.
 * ```js
 * // These will all access --my-var
 * getCssVariablesFromStyles(getComputedStyle(element), `--my-var`, `red`);
 * getCssVariablesFromStyles(getComputedStyle(element), `my-var`, `red`);
 * getCssVariablesFromStyles(getComputedStyle(element), `my_var`, `red`);
 * ```
 * @param styles
 * @param name
 * @param fallback
 * @returns
 */
declare function getCssVariablesFromStyles<T extends string | number>(styles: CSSStyleDeclaration, name: string, fallback: T): T;
//#endregion
//#region ../packages/dom/src/resolve-el.d.ts
/**
 * Resolves either a string or HTML element to an element.
 * Useful when an argument is either an HTML element or query.
 *
 * ```js
 * resolveEl(`#someId`);
 * resolveEl(someElement);
 * ```
 * @param domQueryOrEl
 * @returns
 */
declare const resolveEl: <V extends Element>(domQueryOrEl: string | V | null | undefined) => V;
/**
 * Tries to resolve a query, returning a `Result`.
 *
 * ```js
 * const { success, value, error } = resolveElementTry(`#some-element`);
 * if (success) {
 *  // Do something with value
 * } else {
 *  console.error(error);
 * }
 * ```
 * @param domQueryOrEl
 * @returns
 */
declare const resolveElementTry: <V extends Element>(domQueryOrEl: string | V | null | undefined) => Result<V, string>;
type QueryOrElements = string | Element[] | HTMLElement[] | HTMLElement | Element;
/**
 * Returns a set of elements.
 *
 * Returns an empty list if `selectors` is undefined or null.
 *
 * @param selectors
 * @returns
 */
declare const resolveEls: (selectors: QueryOrElements) => HTMLElement[];
//#endregion
//#region ../packages/dom/src/css.d.ts
type ComputedPixelsMap<T extends readonly (keyof CSSStyleDeclaration)[]> = Record<T[number], number>;
/**
 * Returns the value of `getBoundingClientRect` plus the width of all the borders
 * @param elOrQuery
 * @returns
 */
declare const getBoundingClientRectWithBorder: (elOrQuery: SVGElement | HTMLElement | string) => RectPositioned;
/**
 * Returns the computed measurements of CSS properties via [getComputedStyle](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle).
 *
 * ```js
 * const v = getComputedPixels(`#some-el`, `borderTopWidth`, `borderLeftWidth`);
 * v.borderTopWidth;  // number
 * b.borderLeftWidth; // number
 * ```
 *
 * Throws an error if value from `getComputedStyle` is not a string or does not end in 'px'.
 * @param elOrQuery
 * @param properties
 * @returns
 */
declare const getComputedPixels: <T extends readonly (keyof CSSStyleDeclaration)[]>(elOrQuery: HTMLElement | string, ...properties: T) => ComputedPixelsMap<T>;
/**
 * If `value` is _true_, the provided CSS class is added to element(s), otherwise it is removed.
 *
 * ```js
 * setClass(`#someId`, true, `activated`); // Add 'activated'
 * setClass(`#someId`, false, `activated`); // Removes 'activated'
 * ```
 *
 * @param selectors
 * @param value
 * @param cssClass
 * @returns
 */
declare const setCssClass: (selectors: QueryOrElements, value: boolean, cssClass: string) => void;
/**
 * Toggles a CSS class on all elements that match selector.
 *
 * ```js
 * setCssToggle(`span`, `activated`); // Toggles the 'activated' class on all SPAN elements
 * ```
 *
 * Uses `HTMLElement.classList.toggle`
 * @param selectors
 * @param cssClass
 * @returns
 */
declare const setCssToggle: (selectors: QueryOrElements, cssClass: string) => void;
/**
 * Sets the CSS 'display' property
 *
 * ```js
 * setCssDisplay(`span`, `block`); // Sets display:block for all spans
 * ```
 *
 * @param selectors
 * @param value
 * @returns
 */
declare const setCssDisplay: (selectors: QueryOrElements, value: string) => void;
//#endregion
//#region ../packages/dom/src/data-display.d.ts
type DataDisplayOptions = FormattingOptions & {
  theme?: `dark` | `light`;
};
/**
 * Creates a simple display for data. Designed to show ixfx state data
 *
 * ```js
 * // Create once
 * const display = new DataDisplay();
 *
 * // Call .update to show state
 * display.update(state);
 * ```
 */
declare class DataDisplay {
  dataTable: DataTable<object>;
  /**
   * Constructor
   * @param options Options
   */
  constructor(options?: Partial<DataDisplayOptions>);
  update(data: object): void;
}
//#endregion
//#region ../packages/dom/src/el.d.ts
/**
 * Wraps an element (or set of elements) with handy functions
 * for manipulation.
 */
type WrappedElement = {
  /**
   * Sets inner text
   * @param value
   * @returns
   */
  text: (value: string | number) => string;
  /**
   * Sets inner HTML
   * @param value
   * @returns
   */
  html: (value: string | number) => string;
  /**
   * Sets the CSS 'display' property to `value`
   * @param value
   * @returns
   */
  cssDisplay: (value: string) => void;
  /**
   * Adds/removes a CSS class depending on `value`
   * @param value
   * @param cssClass
   * @returns
   */
  cssClass: (value: boolean, cssClass: string) => void;
  /**
   * Toggles a CSS class
   * @param cssClass
   * @returns
   */
  cssToggle: (cssClass: string) => void;
  /**
   * Gets the HTML element corresponding to original selector.
   * If the selector returns multiple items, the first is yielded
   * @returns
   */
  el: () => HTMLElement;
  /**
   * Returns a set of HTML elements that match selector
   * @returns
   */
  els: () => HTMLElement[];
};
/**
 * Returns an object with handy functions for working on/against the provided selector.
 *
 * ```js
 * const e = el(`#my-element`);
 * e.text(`hello`);           // Set the inner text of the elemenet
 * e.cssDisplay(`block`);    // Sets display:block
 * e.cssToggle(`activated`);  // Toggles the 'activated' CSS class
 * e.cssClass(true, `activated`); // Turns on the 'activated' CSS class
 * e.el();                    // Returns the HTML Element
 * ```
 *
 * The selector is only queried when created. Use {@link elRequery} to continually
 * re-query the selector before each operation.
 *
 * @param selectors
 * @returns
 */
declare const el: (selectors: QueryOrElements) => WrappedElement;
declare const elRequery: (selectors: string) => WrappedElement;
//#endregion
//#region ../packages/dom/src/error-handler.d.ts
/**
 * Creates an error handler to show errors on-screen.
 * This is useful when testing on mobile devices that lack access to the console.
 *
 * ```js
 * const e = defaultErrorHandler();
 * ```
 *
 * Manual control:
 * ```js
 * const e = defaultErrorHandler();
 * e.show(someError);
 * e.hide();
 * ```
 * @returns
 */
declare const defaultErrorHandler: () => {
  show: (ex: Error | string | Event) => void;
  hide: () => void;
};
//#endregion
//#region ../packages/dom/src/log.d.ts
type LogOpts = {
  readonly reverse?: boolean;
  readonly capacity?: number;
  readonly timestamp?: boolean;
  readonly collapseDuplicates?: boolean;
  readonly monospaced?: boolean;
  readonly minIntervalMs?: number;
  readonly css?: string;
};
type Log = {
  clear(): void;
  error(messageOrError: unknown): void;
  log(message?: string | object | number): HTMLElement | undefined;
  warn(message?: string | object | number): HTMLElement | undefined;
  append(el: HTMLElement): void;
  dispose(): void;
  readonly isEmpty: boolean;
};
/**
 * Allows writing to a DOM element in console.log style. Element grows in size, so use
 * something like `overflow-y: scroll` on its parent
 *
 * ```
 * const l = log(`#dataStream`); // Assumes HTML element with id `dataStream` exists
 * l.log(`Hi`);
 * l.log(); // Displays a horizontal rule
 *
 * const l = log(document.getElementById(`dataStream`), {
 *  timestamp: true,
 *  truncateEntries: 20
 * });
 * l.log(`Hi`);
 * l.error(`Some error`); // Adds class `error` to line
 * ```
 *
 * For logging high-throughput streams:
 * ```
 * // Silently drop log if it was less than 5ms since the last
 * const l = log(`#dataStream`, { minIntervalMs: 5 });
 *
 * // Only the last 100 entries are kept
 * const l = log(`#dataStream`, { capacity: 100 });
 * ```
 *
 * @param domQueryOrElement Element or id of element
 * @param opts
 */
declare const log: (domQueryOrElement: HTMLElement | string, opts?: LogOpts) => Log;
//#endregion
//#region ../packages/dom/src/inline-console.d.ts
type InlineConsoleOptions = LogOpts & Partial<{
  /**
   * If true, styling is not applied
   */
  witholdCss: boolean;
  /**
   * If provided, entries are added to this element.
   * By default a new element, #ixfx-log is created and added
   * to the document.
   */
  insertIntoEl: string | HTMLElement;
}>;
/**
 * Adds an inline console to the page. A DIV is added to display log messages.
 *
 * Captures all console.log, console.warn and console.error calls, as well as unhandled exceptions.
 *
 * ```js
 * // Adds the DIV and intercepts console logs
 * inlineConsole();
 *
 * console.log(`Hello`); // message is displayed in the inline console
 * ```
 * @param options
 */
declare const inlineConsole: (options?: InlineConsoleOptions) => void;
//#endregion
//#region ../packages/dom/src/query.d.ts
type ElementQueryOptions = {
  /**
   * If true, elements are only returned once, even if that match several queries
   */
  ensureUnique: boolean;
};
/**
 * Async iterator over DOM query strings
 * ```js
 * query(`div`); // all DIVs
 * query([`.class`, `.and-other-class`]); // All things with these two classes
 * ```
 * @param queryOrElement
 * @returns
 */
declare function query(queryOrElement: string | HTMLElement | (string | HTMLElement)[] | AsyncGenerator<string | HTMLElement>, options?: Partial<ElementQueryOptions>): AsyncGenerator<HTMLElement>;
//#endregion
//#region ../packages/dom/src/set-property.d.ts
declare function setText(selectors: QueryOrElements): (value: any) => string;
declare function setText(selectors: QueryOrElements, value?: any): string;
declare function setHtml(selectors: QueryOrElements): (value: any) => string;
declare function setHtml(selectors: QueryOrElements, value?: any): string;
declare function setProperty(property: string, selectors: QueryOrElements): (value: any) => string;
declare function setProperty(property: string, selectors: QueryOrElements, value: any): string;
//#endregion
//#region ../packages/dom/src/shadow-dom.d.ts
declare const addShadowCss: (parentEl: Readonly<HTMLElement>, styles: string) => ShadowRoot;
//#endregion
//#region ../packages/dom/src/tabbed-panel.d.ts
type Panel<TNotifyArgs> = {
  mount: (parentEl: HTMLElement) => void;
  dismount: () => void;
  id: string;
  label: string;
  /**
   * Panel gets a notification
   * @param name
   * @param args
   * @returns
   */
  notify?: (name: string, args: TNotifyArgs) => void;
};
declare const tabSet: <TNotifyArgs>(options: {
  panels: Panel<TNotifyArgs>[];
  parent: HTMLElement | string;
  preselectId?: string;
  onPanelChanging?: (priorPanel: Panel<TNotifyArgs> | undefined, newPanel: Panel<TNotifyArgs> | undefined) => boolean | void;
  onPanelChange?: (priorPanel: Panel<TNotifyArgs> | undefined, newPanel: Panel<TNotifyArgs> | undefined) => void;
}) => {
  select: (id: string) => void;
  panels: Panel<TNotifyArgs>[];
  hostEl: HTMLElement;
  tabSetEl: HTMLElement;
  notify: (name: string, args: TNotifyArgs) => void;
};
//#endregion
//#region ../packages/dom/src/utility.d.ts
type PointSpaces = `viewport` | `screen` | `document`;
/**
 * Convert an absolute point to relative, in different coordinate spaces.
 *
 * When calling the returned function, the input value must be in the same
 * scale as the intended output scale.
 *
 * Viewport-relative is used by default.
 *
 * @example Get relative position of click in screen coordinates
 * ```js
 * const f = pointScaler({ to: 'screen' });
 * document.addEventListener('click', evt => {
 *  const screenRelative = f(evt.screenX, evt.screenY);
 *  // Yields {x,y} on 0..1 scale
 * });
 * ```
 *
 * @example Get relative position of click in viewport coordinates
 * ```js
 * const f = pointScaler({ to: 'viewport' });
 * document.addEventListener('click', evt => {
 *  const viewportRelative = f(evt.clientX, evt.clientY);
 *  // Yields {x,y} on 0..1 scale
 * });
 * ```
 *
 * @example Get relative position of click in document coordinates
 * ```js
 * const f = pointScaler({ to: 'document' });
 * document.addEventListener('click', evt => {
 *  const documentRelative = f(evt.pageX, evt.pageY);
 *  // Yields {x,y} on 0..1 scale
 * });
 * ```
 *
 * @param reference
 * @returns
 */
declare const pointScaler: (reference?: PointSpaces) => (a: Readonly<Point | number | number[]>, b?: number) => Readonly<{
  x: number;
  y: number;
}>;
type ElPositionOpts = {
  readonly target?: PointSpaces;
  readonly relative?: boolean;
  readonly anchor?: GridCardinalDirection | `center`;
};
/**
 * Returns a function which yields element position in target coordinate space with optional scaling.
 * Live position is calculated when the function is invoked.
 * Use {@link positionRelative} to simply get relative position of element in given coordinate space.
 *
 * @example Absolute position of #blah in viewport coordinate space
 * ```js
 * const f = positionFn('#blah');
 * f(); // Yields: {x,y}
 * // Or:
 * positionFn('#blah')(); // Immediately invoke
 * ```
 *
 * @example Relative position of element in viewport-space
 * ```js
 * const f = positionFn(evt.target, { relative: true });
 * f(); // Yields: {x,y}
 * ```
 *
 * @example Relative position of #blah in screen-space
 * ```js
 * const f = positionFn('#blah', { target: 'screen', relative: true });
 * f(); // Yields: {x,y}
 * ```
 *
 * By default, top-left corner (north west) is used. Other cardinal points or 'center' can be specified:
 * ```js
 * // Relative position by center
 * positionFn('#blah', { relative: true, anchor: 'center' });
 *
 * // ...by bottom-right corner
 * positionFn('#blah', { relative: true, anchor: 'se' });
 * ```
 *
 * This function is useful if you have a stable DOM element and conversion target.
 * If the DOM element is changing continually, consider using {@link viewportToSpace} to
 * convert from viewport coordinates to target coordinates:
 *
 * ```js
 * // Eg.1 Absolute coords in screen space
 * const vpToScreen = viewportToSpace('screen');
 * vpToScreen(el.getBoundingClientRect());
 *
 * // Eg.2 Relative coords in viewport space
 * const vpRelative = pointScaler(); // Re-usable scaler. Default uses viewport
 * vpRelative(el.getBoundingClientRect()); // Yields: { x,y }
 *
 * // Eg.3 Relative coords in screen space
 * const vpToScreen = viewportToSpace('screen'); // Map viewport->screen
 * const screenRelative = pointScaler('screen'); // Scale screen units
 *
 * // Combine into a resuable function that takes an element
 * const mapAndScale = (el) => screenRelative(vpToScreen(el.getBoundingClientRect()));
 *
 * // Call
 * mapAndScale(document.getElementById('blah')); // Yields: { x,y }
 * ```
 * @param domQueryOrEl
 * @param options
 * @returns
 */
declare const positionFn: (domQueryOrEl: Readonly<string | HTMLElement>, options?: ElPositionOpts) => (() => Point);
/**
 * Returns a {x,y} Point on a cardinal position of element.
 * ```
 * // Top edge, middle horizontal position
 * const pos = cardinalPosition(`#blah`, `n`);
 * ```
 * @param domQueryOrEl
 * @param anchor
 * @returns
 */
declare const cardinalPosition: (domQueryOrEl: Readonly<string | HTMLElement>, anchor?: GridCardinalDirection | `center`) => Point;
/**
 * Returns relative position of element in target coordinate space, or viewport by default.
 * Relative means that { x:0.5, y: 0.5 } is the middle of the target space. Eg for viewport, that means its the middle of the browser window.
 * ```js
 * // These all yield { x, y }
 * elPositionRelative('#blah');
 * elPositionRelative(evt.target, 'screen');
 * ```
 * @param domQueryOrEl DOM query or element
 * @param target Target coordinate space, or viewport by default
 * @returns Point
 */
declare const positionRelative: (domQueryOrEl: Readonly<string | HTMLElement>, target?: PointSpaces) => Point;
/**
 * Returns a function that converts input viewport coordinate space
 * to an output coordinate space.
 *
 * ```js
 * // f() will convert from viewport to document coordinate space
 * const f = viewportToSpace('document');
 *
 * // {x:100,y:100} is viewport coordinate space
 * f(100,100); // Yields: { x, y } converted to document space
 * ```
 *
 * Or immediately invoke for one-off use:
 * ```js
 * viewportToSpace('document')(100,100); // Yields: { x, y }
 * ```
 * @param targetSpace
 * @returns
 */
declare const viewportToSpace: (targetSpace?: PointSpaces) => (a: Readonly<Point | number[] | number>, b?: number) => Readonly<{
  x: number;
  y: number;
}>;
/**
 * Position element by relative coordinate. Relative to window dimensions by default
 * @param relativePos Window-relative coordinate. 0.5/0.5 is middle of window.
 */
declare const positionFromMiddle: (domQueryOrEl: string | HTMLElement, relativePos: Point, relativeTo?: `window` | `screen`) => void;
/**
 * Given an array of class class names, this will cycle between them each time
 * it is called.
 *
 * Eg, assume `list` is: [ `a`, `b`, `c` ]
 *
 * If `el` already has the class `a`, the first time it is called, class `a`
 * is removed, and `b` added. The next time `b` is swapped for `c`. Once again,
 * `c` will swap with `a` and so on.
 *
 * If `el` is undefined or null, function silently returns.
 * @param el Element
 * @param list List of class names
 * @returns
 */
declare const cycleCssClass: (el: Readonly<HTMLElement>, list: readonly string[]) => void;
/**
 * Source: https://zellwk.com/blog/translate-in-javascript
 * @param domQueryOrEl
 */
declare const getTranslation: (domQueryOrEl: Readonly<string | HTMLElement>) => Point3d;
/**
 * Creates an element after `sibling`
 * ```
 * const el = createAfter(siblingEl, `DIV`);
 * ```
 * @param sibling Element
 * @param tagName Element to create
 * @returns New element
 */
declare const createAfter: (sibling: Readonly<HTMLElement>, tagName: string) => HTMLElement;
/**
 * Creates an element inside of `parent`
 * ```
 * const newEl = createIn(parentEl, `DIV`);
 * ```
 * @param parent Parent element
 * @param tagName Tag to create
 * @returns New element
 */
declare const createIn: (parent: Readonly<HTMLElement>, tagName: string) => HTMLElement;
/**
 * Remove all child nodes from `parent`
 * @param parent
 */
declare const clear: (parent: Readonly<HTMLElement>) => void;
/**
 * Copies string representation of object to clipboard
 * @param object
 * @returns Promise
 */
declare const copyToClipboard: (object: object) => Promise<unknown>;
/**
 * Inserts `element` into `parent` sorted according to its HTML attribute `data-sort`.
 *
 * Assumes:
 * * Every child of `parent` and `element`, has a `data-sort` attribute. This is the basis for sorting.
 * * `parent` starts off empty or pre-sorted.
 * * Order of `parent`'s children is not changed (ie it always remains sorted)
 * @param parent Parent to insert into
 * @param element Element to insert
 */
declare const insertSorted: (parent: HTMLElement, element: HTMLElement) => void;
/**
 * Creates or updates an element based on an input value.
 * This function should not add the element to the DOM.
 */
type CreateUpdateElement<V> = (
/**
 * Value to create/update for
 */

item: V,
/**
 * Element to update, or null if it needs to be created
 */

el: HTMLElement | null) => HTMLElement;
/**
 * Creates a DOM tree, based on provided data.
 *
 * This will create new DOM elements if needed, update
 * existing ones or remove them if the value is no longer present.
 *
 *
 * @param parentEl
 * @param list Values to create elements for
 * @param createUpdate Function to create/update elements based on a value
 */
declare const reconcileChildren: <V>(parentEl: HTMLElement, list: Map<string, V>, createUpdate: CreateUpdateElement<V>) => void;
/**
 * Gets a HTML element by id, throwing an error if not found
 * @param id
 * @returns
 */
declare const byId: <T extends HTMLElement>(id: string) => T;
//#endregion
export { ComputedPixelsMap, CreateUpdateElement, CssVariable, CssVariableByIdOption, CssVariableByObjectOption, CssVariableByQueryOption, CssVariableOption, DataDisplay, DataDisplayOptions, data_table_d_exports as DataTable, drag_drop_d_exports as DragDrop, ElPositionOpts, ElementQueryOptions, ElementResizeLogic, ElementSizer, ElementSizerOptions, forms_d_exports as Forms, InlineConsoleOptions, Log, LogOpts, Panel, PointSpaces, QueryOrElements, WrappedElement, addShadowCss, byId, cardinalPosition, clear, copyToClipboard, createAfter, createIn, cycleCssClass, defaultErrorHandler, el, elRequery, getBoundingClientRectWithBorder, getComputedPixels, getCssVariable, getCssVariablesFromStyles, getCssVariablesWithFallback, getTranslation, inlineConsole, insertSorted, log, parseCssVariablesAsAttributes, pointScaler, positionFn, positionFromMiddle, positionRelative, query, reconcileChildren, resolveEl, resolveElementTry, resolveEls, setCssClass, setCssDisplay, setCssToggle, setCssVariables, setFromCssVariables, setHtml, setProperty, setText, tabSet, viewportToSpace };