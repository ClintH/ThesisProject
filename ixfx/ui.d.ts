import { t as PathDataChange } from "./pathed-BfYQGFeu.js";
import { n as RecursivePartial } from "./ts-utility-RjBTNYlE.js";
import { i as Interval } from "./types-DhLXV-YQ.js";
import { n as HslScalar } from "./index-Zce0Je5h.js";
import { Bt as EventSourceOptions, Y as ObjectFieldHandler, ct as ReactiveNonInitial, ht as ReactiveWritable, it as ReactiveDiff, nt as Reactive, ot as ReactiveInitial } from "./index-C2pL5Gby.js";

//#region ../packages/ui/src/rx/browser-resize.d.ts
/**
 * Observe when element resizes. Specify `interval` to debounce, uses 100ms by default.
 *
 * ```
 * const o = resizeObservable(myEl, 500);
 * o.subscribe(() => {
 *  // called 500ms after last resize
 * });
 * ```
 * @param elem
 * @param interval Tiemout before event gets triggered
 * @returns
 */
declare const browserResizeObservable: (elem: Readonly<Element>, interval?: Interval) => any;
/**
 * Returns an Reactive for window resize. Default 100ms debounce.
 * @param elapsed
 * @returns
 */
declare const windowResize: (elapsed?: Interval) => any;
//#endregion
//#region ../packages/ui/src/rx/browser-theme-change.d.ts
/**
 * Observe when a class changes on a target element, by default the document.
 * Useful for tracking theme changes.
 *
 * ```js
 * const c = cssClassChange();
 * c.on(msg => {
 *  // some class has changed on the document
 * });
 * ```
 */
declare const cssClassChange: (target?: HTMLElement) => Reactive<MutationRecord[]>;
//#endregion
//#region ../packages/ui/src/rx/colour.d.ts
type ReactiveColour = ReactiveWritable<HslScalar> & {
  setHsl: (hsl: HslScalar) => void;
};
declare function colour(initialValue: HslScalar): ReactiveColour & ReactiveInitial<HslScalar>;
declare function colour(): ReactiveColour & ReactiveNonInitial<HslScalar>;
//#endregion
//#region ../packages/ui/src/rx/dom-types.d.ts
type DomBindValueTarget = {
  /**
   * If _true_ `innerHTML` is set (a shortcut for elField:`innerHTML`)
   */
  htmlContent?: boolean;
  /**
   * If _true_, 'textContent' is set (a shortcut for elField:'textContext')
   */
  textContent?: boolean;
  /**
   * If set, this DOM element field is set. Eg 'textContent'
   */
  elField?: string;
  /**
   * If set, this DOM attribute is set, Eg 'width'
   */
  attribName?: string;
  /**
   * If set, this CSS variable is set, Eg 'hue' (sets '--hue')
   */
  cssVariable?: string;
  /**
   * If set, this CSS property is set, Eg 'background-color'
   */
  cssProperty?: string;
};
type ElementBind = {
  /**
   * Tag name for this binding.
   * Overrides `defaultTag`
   */
  tagName?: string;
  /**
   * If _true_, sub-paths are appended to element, rather than `container`
   */
  nestChildren?: boolean;
  transform?: (value: any) => string;
};
type ElementsOptions = {
  container: HTMLElement | string;
  defaultTag: string;
  binds: Record<string, DomBindValueTarget & ElementBind>;
};
type DomBindTargetNode = {
  query?: string;
  element?: HTMLElement;
};
type DomBindTargetNodeResolved = {
  element: HTMLElement;
};
type DomBindUnresolvedSource<TSource, TDestination> = DomBindTargetNode & DomBindSourceValue<TSource, TDestination> & DomBindValueTarget;
type DomBindResolvedSource<TSource, TDestination> = DomBindTargetNodeResolved & DomBindSourceValue<TSource, TDestination> & DomBindValueTarget;
type DomBindSourceValue<TSource, TDestination> = {
  twoway?: boolean;
  /**
   * Field from source value to pluck and use.
   * This will also be the value passed to the transform
   */
  sourceField?: keyof TSource;
  transform?: (input: TSource) => TDestination;
  transformValue?: (input: any) => TDestination;
};
type DomBindInputOptions<TSource, TDestination> = DomBindSourceValue<TSource, TDestination> & {
  transformFromInput: (input: TDestination) => TSource;
};
type BindUpdateOpts<V> = {
  initial: (v: V, el: HTMLElement) => void;
  binds: Record<string, DomBindValueTarget & {
    transform?: (value: any) => string;
  }>;
};
type DomCreateOptions = {
  tagName: string;
  parentEl: string | HTMLElement;
};
type PipeDomBinding = {
  /**
   * Remove binding and optionally delete element(s) (false by default)
   */
  remove(deleteElements: boolean): void;
};
type DomValueOptions = EventSourceOptions & {
  /**
   * If true, the current value will be emitted even though it wasn't
   * triggered by an event.
   * Default: false
   */
  emitInitialValue: boolean;
  attributeName: string;
  fieldName: string;
  /**
   * Respond to when value has changed or when value is changing
   * Default: `changed`
   */
  when: `changed` | `changing`;
  fallbackValue: string;
  upstreamSource?: Reactive<unknown>;
  upstreamFilter?: (value: unknown) => string;
};
type DomFormOptions<T extends Record<string, unknown>> = EventSourceOptions & {
  /**
   * If true, the current value will be emitted even though it wasn't
   * triggered by an event.
   * Default: false
   */
  emitInitialValue: boolean;
  /**
   * Respond to when value has changed or when value is changing
   * Default: `changed`
   */
  when: `changed` | `changing`;
  upstreamSource?: Reactive<T>;
  upstreamFilter?: (name: string, value: unknown) => string;
};
type DomNumberInputValueOptions = DomValueOptions & {
  /**
   * If true, sets up INPUT element to operate with relative values
   */
  relative?: boolean;
  /**
   * If true, when setting up, sets max to be on left side
   */
  inverted?: boolean;
  upstreamSource?: Reactive<number>;
};
//#endregion
//#region ../packages/ui/src/rx/dom-source.d.ts
/**
 * Reactive getting/setting of values to a HTML INPUT element.
 *
 * Options:
 * - relative: if _true_, values are 0..1 (default: false)
 * - inverted: if _true_, values are 1..0 (default: false)
 *
 * If element is missing a 'type' attribute, this will be set to 'range'.
 * @param targetOrQuery
 * @param options
 * @returns
 */
declare function domNumberInputValue(targetOrQuery: HTMLInputElement | string, options?: Partial<DomNumberInputValueOptions>): ReactiveInitial<number> & ReactiveWritable<number>;
declare function domHslInputValue(targetOrQuery: HTMLInputElement | string, options?: Partial<DomValueOptions>): ReactiveInitial<HslScalar> & Reactive<HslScalar> & ReactiveWritable<HslScalar>;
/**
 * A stream of values when the a HTMLInputElement changes. Eg a <input type="range">
 * ```js
 * const r = Rx.From.domInputValue(`#myEl`);
 * r.onValue(value => {
 *  // value will be string
 * });
 * ```
 *
 * Options:
 * * emitInitialValue: If _true_ emits the HTML value of element (default: false)
 * * attributeName: If set, this is the HTML attribute value is set to when writing to stream (default: 'value')
 * * fieldName: If set, this is the DOM object field set when writing to stream (default: 'value')
 * * when: 'changed'|'changing' when values are emitted. (default: 'changed')
 * * fallbackValue:  Fallback value to use if field/attribute cannot be read (default: '')
 * @param targetOrQuery
 * @param options
 * @returns
 */
declare function domInputValue(targetOrQuery: HTMLInputElement | string, options?: Partial<DomValueOptions>): {
  el: HTMLInputElement;
} & ReactiveInitial<string> & ReactiveWritable<string>;
/**
 * Listens for data changes from elements within a HTML form element.
 * Input elements must have a 'name' attribute.
 *
 * Simple usage:
 * ```js
 * const rx = Rx.From.domForm(`#my-form`);
 * rx.onValue(value => {
 *  // Object containing values from form
 * });
 *
 * rx.last(); // Read current values of form
 * ```
 *
 * UI can be updated
 * ```js
 * // Set using an object of key-value pairs
 * rx.set({
 *  size: 'large'
 * });
 *
 * // Or set a single name-value pair
 * rx.setNamedValue(`size`, `large`);
 * ```
 *
 * If an 'upstream' reactive is provided, this is used to set initial values of the UI, overriding
 * whatever may be in the HTML. Upstream changes modify UI elements, but UI changes do not modify the upstream
 * source.
 *
 * ```js
 * // Create a reactive object
 * const obj = Rx.From.object({
 *  when: `2024-10-03`,
 *  size: 12,
 *  checked: true
 * });
 *
 * // Use this as initial values for a HTML form
 * // (assuming appropriate INPUT/SELECT elements exist)
 * const rx = Rx.From.domForm(`form`, {
 *  upstreamSource: obj
 * });
 *
 * // Listen for changes in the UI
 * rx.onValue(value => {
 *
 * });
 * ```
 * @param formElOrQuery
 * @param options
 * @returns
 */
declare function domForm<T extends Record<string, any>>(formElOrQuery: HTMLFormElement | string, options?: Partial<DomFormOptions<T>>): {
  setNamedValue: (name: string, value: any) => void;
  el: HTMLFormElement;
} & ReactiveInitial<T> & ReactiveWritable<T>;
//#endregion
//#region ../packages/ui/src/rx/dom.d.ts
/**
 * Reactive stream of array of elements that match `query`.
 * @param query
 * @returns
 */
declare function fromDomQuery(query: string): Reactive<HTMLElement[]> & {
  set(value: HTMLElement[]): void;
} & {
  onField(fieldName: string, handler: (result: ObjectFieldHandler) => void): () => void;
  onDiff(changes: (changes: PathDataChange<any>[]) => void): () => void;
  update(changedPart: (RecursivePartial<HTMLElement> | undefined)[]): HTMLElement[];
  updateField(field: string, value: any): void;
} & {
  last(): HTMLElement[];
};
/**
 * Updates an element's `textContent` when the source value changes.
 * ```js
 * bindText(source, `#blah`);
 * ```
 * @param elOrQuery
 * @param source
 * @param bindOpts
 */
declare const bindText: <TSource>(source: Reactive<TSource>, elOrQuery: string | HTMLElement | null, bindOpts?: Partial<DomBindSourceValue<TSource, string>>) => PipeDomBinding;
/**
 * Updates an element's `value` (as well as the 'value' attribute) when the source value changes.s
 * @param source
 * @param elOrQuery
 * @param bindOpts
 * @returns
 */
declare const bindValueText: <TSource>(source: Reactive<TSource>, elOrQuery: string | HTMLInputElement | null, bindOpts?: Partial<DomBindSourceValue<TSource, string>>) => PipeDomBinding;
/**
 * Updates an element's `innerHTML` when the source value changes
 * ```js
 * bindHtml(source, `#blah`);
 * ```
 *
 * Uses {@link bindElement}, with `{elField:'innerHTML'}` as the options.
 * @param elOrQuery
 * @param source
 * @param bindOpts
 * @returns
 */
declare const bindHtml: <TSource>(source: Reactive<TSource>, elOrQuery: string | HTMLElement | null, bindOpts?: DomBindSourceValue<TSource, string>) => PipeDomBinding;
/**
 * Shortcut to bind to an elements attribute
 * @param elOrQuery
 * @param source
 * @param attribute
 * @param bindOpts
 * @returns
 */
/**
 * Shortcut to bind to a CSS variable
 * @param elOrQuery
 * @param source
 * @param cssVariable
 * @param bindOpts
 * @returns
 */
/**
 * Creates a new HTML element, calling {@link bind} on it to update when `source` emits new values.
 *
 *
 * ```js
 * // Set textContent of a SPAN with values from `source`
 * create(source, { tagName: `span`, parentEl: document.body })
 * ```
 *
 * If `parentEl` is not given in the options, the created element needs to be manually added
 * ```js
 * const b = create(source);
 * someEl.append(b.el); // Append manually
 * ```
 *
 * ```
 * // Set 'title' attribute based on values from `source`
 * create(source, { parentEl: document.body, attribName: `title` })
 * ```
 * @param source
 * @param options
 * @returns
 */
/**
 * Update a DOM element's field, attribute or CSS variable when `source` produces a value.
 *
 * ```js
 * // Access via DOM query. Binds to 'textContent' by default
 * bind(readableSource, `#someEl`);
 *
 * // Set innerHTML instead
 * bind(readableSource, someEl, { elField: `innerHTML` });
 *
 * // An attribute
 * bind(readableSource, someEl, { attribName: `width` });
 *
 * // A css variable ('--' optiona)
 * bind(readableSource, someEl, { cssVariable: `hue` });
 *
 * // Pluck a particular field from source data.
 * // Ie someEl.textContent = value.colour
 * bind(readableSource, someEl, { sourceField: `colour` });
 *
 * // Transform value before setting it to field
 * bind(readableSource, someEl, {
 *  field: `innerHTML`,
 *  transform: (v) => `Colour: ${v.colour}`
 * })
 * ```
 *
 * If `source` has an initial value, this is used when first bound.
 *
 * Returns {@link PipeDomBinding} to control binding:
 * ```js
 * const bind = bind(source, `#someEl`);
 * bind.remove();     // Unbind
 * bind.remove(true); // Unbind and remove HTML element
 * ```
 *
 * If several fields need to be updated based on a new value, consider using {@link bindUpdate} instead.
 * @param elOrQuery Element to update to, or query string such as '#someid'
 * @param source Source of data
 * @param binds Bindings
 */
declare const bindElement: <TSource, TDestination>(source: Reactive<TSource>, elOrQuery: string | HTMLElement | null, ...binds: (DomBindSourceValue<TSource, TDestination> & DomBindValueTarget)[]) => PipeDomBinding;
/**
 * Binds `source` to one or more element(s). One or more bindings for the same source
 * can be provided.
 *
 * ```js
 * bind(source,
 *  // Binds .name field of source values to textContent of #some-element
 *  { query: `#some-element`, sourceField: `name` },
 *  { query: `section`, }
 * );
 * ```
 *
 * Can update
 * * CSS variables
 * * CSS styles
 * * textContent / innerHTML
 * * HTML DOM attributes and object fields
 *
 * Can use a particular field on source values, or use the whole value. These can
 * pass through `transformValue` or `transform` respectively.
 *
 * Returns a function to unbind from source and optionally remove HTML element
 * ```js
 * const unbind = bind( . . . );
 * unbind();     // Unbind
 * unbind(true); // Unbind and remove HTML element(s)
 * ```
 * @param source
 * @param bindsUnresolvedElements
 * @returns
 */
declare const bind: <TSource, TDestination>(source: Reactive<TSource>, ...bindsUnresolvedElements: DomBindUnresolvedSource<TSource, TDestination>[]) => PipeDomBinding;
/**
 * Calls `updater` whenever `source` produces a value. Useful when several fields from a value
 * are needed to update an element.
 * ```js
 * bindUpdate(source, `#someEl`, (v, el) => {
 *  el.setAttribute(`width`, v.width);
 *  el.setAttribute(`height`, v.height);
 * });
 * ```
 *
 * Returns a {@link PipeDomBinding} to manage binding
 * ```js
 * const b = bindUpdate(...);
 * b.remove();     // Disconnect binding
 * b.remove(true); // Disconnect binding and remove element
 * b.el;           // HTML element
 * ```
 * @param elOrQuery
 * @param source
 * @param updater
 * @returns
 */
declare const bindUpdate: <V>(source: Reactive<V>, elOrQuery: string | HTMLElement, updater: (v: V, el: HTMLElement) => void) => PipeDomBinding;
/**
 * Updates a HTML element based on diffs on an object.
 * ```js
 * // Wrap an object
 * const o = Rx.object({ name: `Jane`, ticks: 0 });
 * const b = bindDiffUpdate(`#test`, o, (diffs, el) => {
 *  // el = reference to #test
 * // diff = Array of Changes,
 * //  eg [ { path: `ticks`, value: 797, previous: 0 } ]
 *  for (const diff of diffs) {
 *    if (diff.path === `ticks`) el.textContent = `${diff.previous} -> ${diff.value}`
 *  }
 * })
 *
 * // Eg. update field
 * o.updateField(`ticks`, Math.floor(Math.random()*1000));
 * ```
 *
 * If `initial` is provided as an option, this will be called if `source` has an initial value. Without this, the DOM won't be updated until the first data
 * update happens.
 * ```js
 * bindDiffUpdate(el, source, updater, {
 *  initial: (v, el) => {
 *    el.innerHTML = v.name;
 *  }
 * })
 * ```
 * @param elOrQuery
 * @param source
 * @param updater
 * @param opts
 * @returns
 */
declare const bindDiffUpdate: <V>(source: ReactiveDiff<V>, elOrQuery: string | HTMLElement | null, updater: (diffs: PathDataChange<any>[], el: HTMLElement) => void, opts?: Partial<BindUpdateOpts<V>>) => PipeDomBinding & {
  refresh: () => void;
};
/**
 * Creates a new HTML element and calls `bindUpdate` so values from `source` can be used
 * to update it.
 *
 *
 * ```js
 * // Creates a span, adding it to <body>
 * const b = createUpdate(dataSource, (value, el) => {
 *  el.width = value.width;
 *  el.height = value.height;
 * }, {
 *  tagName: `SPAN`,
 *  parentEl: document.body
 * })
 * ```
 * @param source
 * @param updater
 * @param options
 * @returns
 */
/**
 * Creates, updates & deletes elements based on pathed values from a reactive.
 *
 * This means that elements are only manipulated if its associated data changes,
 * and elements are not modified if there's no need to.
 * @param source
 * @param options
 */
declare const elements: <T>(source: ReactiveDiff<T> | (ReactiveDiff<T> & ReactiveInitial<T>), options: Partial<ElementsOptions>) => void;
declare function win(): {
  dispose: (reason?: string) => void;
  size: Reactive<{
    lazy: string;
    transform: () => {
      width: number;
      height: number;
    };
  }> & {
    last(): {
      lazy: string;
      transform: () => {
        width: number;
        height: number;
      };
    };
  };
  pointer: Reactive<{
    lazy: string;
    transform: (args: Event | undefined) => {
      x: number;
      y: number;
    };
  }> & {
    last(): {
      lazy: string;
      transform: (args: Event | undefined) => {
        x: number;
        y: number;
      };
    };
  };
};
declare namespace index_d_exports {
  export { BindUpdateOpts, DomBindInputOptions, DomBindResolvedSource, DomBindSourceValue, DomBindTargetNode, DomBindTargetNodeResolved, DomBindUnresolvedSource, DomBindValueTarget, DomCreateOptions, DomFormOptions, DomNumberInputValueOptions, DomValueOptions, ElementBind, ElementsOptions, PipeDomBinding, ReactiveColour, bind, bindDiffUpdate, bindElement, bindHtml, bindText, bindUpdate, bindValueText, browserResizeObservable, colour, cssClassChange, domForm, domHslInputValue, domInputValue, domNumberInputValue, elements, fromDomQuery, win, windowResize };
}
//#endregion
export { index_d_exports as RxUi };