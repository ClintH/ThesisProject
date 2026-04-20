import { a as RemapObjectPropertyType } from "./ts-utility-RjBTNYlE.js";
import { n as IsEqualContext, t as IsEqual } from "./is-equal--ZpQv_rE.js";
import { n as Result } from "./types-CSh98G0p.js";

//#region ../packages/core/src/records/circular.d.ts
declare const removeCircularReferences: (value: object, replaceWith?: any, seen?: WeakSet<WeakKey>, path?: string) => {
  [k: string]: any;
};
//#endregion
//#region ../packages/core/src/records/clone-from-fields.d.ts
declare const cloneFromFields: <T extends object>(source: T) => T;
//#endregion
//#region ../packages/core/src/types-compare.d.ts
/**
 * Kind of change
 */
type ChangeKind = `mutate` | `add` | `del`;
/**
 * Change record
 */
type ChangeRecord<TKey extends string | number | symbol> = [kind: ChangeKind, path: TKey, value: unknown];
/**
 * Result of compareObjectData
 */
type CompareChangeSet<TKey extends string | number> = {
  /**
   * _True_ if there are any changes
   */
  hasChanged: boolean;
  /**
   * Results for child objects
   */
  children: Record<TKey, CompareChangeSet<string | number>>;
  /**
   * Values that have changed
   */
  changed: Record<TKey, unknown>;
  /**
   * Fields that have been added
   */
  added: Record<TKey, unknown>;
  /**
   * Fields that have been removed
   */
  removed: TKey[];
  /**
   * _True_ if value is an array
   */
  isArray: boolean;
  /**
   * Summary of changes
   */
  summary: ChangeRecord<TKey>[];
};
//#endregion
//#region ../packages/core/src/records/compare.d.ts
/**
 * Compares the keys of two objects, returning a set of those in
 * common, and those in either A or B exclusively.
 * ```js
 * const a = { colour: `red`, intensity: 5 };
 * const b = { colour: `pink`, size: 10 };
 * const c = compareObjectKeys(a, b);
 * // c.shared = [ `colour` ]
 * // c.a = [ `intensity` ]
 * // c.b = [ `size`  ]
 * ```
 * @param a
 * @param b
 * @returns
 */
declare const compareObjectKeys: (a: object, b: object) => {
  shared: string[];
  isSame: boolean;
  a: string[];
  b: string[];
};
/**
 * Returns the changed fields from A -> B. It's assumed that A and B have the same shape.
 * ie. returns an object that only consists of fields which have changed in B compared to A.
 *
 * ```js
 * const a = { msg: `hi`, v: 10 };
 *
 * changedObjectDataFields(a, { msg: `hi`,   v: 10 }); // {}
 * changedObjectDataFields(a, { msg: `hi!!`, v: 10 }); // { msg: `hi!!` }
 * changedObjectDataFields(a, { msg: `hi!!` });       // { msg: `hi!!`, v: undefined }
 * ```
 *
 * If B has additional or removed fields, this is considered an error.
 *
 * If a field is an array, the whole array is returned, rather than a diff.
 * @param a
 * @param b
 */
declare const changedObjectDataFields: (a: object, b: object) => object[] | Record<string, unknown>;
/**
 * Produces a {@link CompareChangeSet} between two arrays.
 *
 * @param a Earlier array to compare
 * @param b Later array to compare
 * @param eq Equality comparison for values
 * @returns Change set.
 */
declare const compareArrays: <TValue>(a: TValue[], b: TValue[], eq?: IsEqual<TValue>) => CompareChangeSet<number>;
/**
 * Compares A to B. Assumes they are simple objects, essentially key-value pairs, where the
 * values are primitive values or other simple objects. It also works with arrays.
 *
 * Uses === equality semantics by default.
 * @param a
 * @param b
 */
declare const compareObjectData: <T>(a: object | null, b: object | null, assumeSameShape?: boolean, eq?: IsEqual<T>) => CompareChangeSet<string>;
//#endregion
//#region ../packages/core/src/records/keys-to-numbers.d.ts
/**
 * Returns a copy of `object` with integer numbers as keys instead of whatever it has.
 * ```js
 * keysToNumbers({ '1': true }); // Yields: { 1: true }
 * ```
 *
 * The `onInvalidKey` sets how to handle keys that cannot be converted to integers.
 * * 'throw' (default): throws an exception
 * * 'ignore': that key & value is ignored
 * * 'keep': uses the string key instead
 *
 *
 * ```js
 * keysToNumber({ hello: 'there' }, `ignore`); // Yields: {  }
 * keysToNumber({ hello: 'there' }, `throw`);  // Exception
 * keysToNumber({ hello: 'there' }, `keep`);   // Yields: { hello: 'there' }
 * ```
 *
 * Floating-point numbers will be converted to integer by rounding.
 * ```js
 * keysToNumbers({ '2.4': 'hello' }); // Yields: { 2: 'hello' }
 * ```
 * @param object
 * @param onInvalidKey
 * @returns
 */
declare const keysToNumbers: <T>(object: Record<string | number | symbol, T>, onInvalidKey?: `throw` | `ignore` | `keep`) => Record<number, T>;
//#endregion
//#region ../packages/core/src/records/map-object-keys.d.ts
/**
 * Maps the keys of an object, returning a transformed object.
 * ```js
 * const input = {
 *  hello: `there`,
 *  chap: `chappie`
 * }
 *
 * mapObjectKeys(input, key => key.toUppercase());
 *
 * // Yields: { HELLO: `there`, CHAP: `chappie` }
 * ```
 * @param object
 * @param mapFunction
 * @returns
 */
declare const mapObjectKeys: <TKeySource extends string | number | symbol, TKeyDestination extends string | number | symbol>(object: Record<TKeySource, unknown>, mapFunction: (key: TKeySource) => TKeyDestination) => Record<TKeyDestination, unknown>;
//#endregion
//#region ../packages/core/src/records/map-object.d.ts
/**
 * Maps the top-level properties of an object through a map function.
 * That is, run each of the values of an object through a function,
 * setting the result onto the same key structure as original.
 *
 * It is NOT recursive.
 *
 * The mapping function gets a single args object, consisting of `{ value, field, index }`,
 * where 'value' is the value of the field, 'field' the name, and 'index' a numeric count.
 * @example Double the value of all fields
 * ```js
 * const rect = { width: 100, height: 250 };
 * const doubled = mapObjectShallow(rect, args => {
 *  return args.value*2;
 * });
 * // Yields: { width: 200, height: 500 }
 * ```
 *
 * Since the map callback gets the name of the property, it can do context-dependent things.
 * ```js
 * const rect = { width: 100, height: 250, colour: 'red' }
 * const doubled = mapObjectShallow(rect, args => {
 *  if (args.field === 'width') return args.value*3;
 *  else if (typeof args.value === 'number') return args.value*2;
 *  return args.value;
 * });
 * // Yields: { width: 300, height: 500, colour: 'red' }
 * ```
 * In addition to bulk processing, it allows remapping of property types.
 *
 * In terms of type-safety, the mapped properties are assumed to have the
 * same type.
 *
 * ```js
 * const o = {
 *  x: 10,
 *  y: 20,
 *  width: 200,
 *  height: 200
 * }
 *
 * // Make each property use an averager instead
 * const oAvg = mapObjectShallow(o, args => {
 *  return movingAverage(10);
 * });
 *
 * // Instead of { x:number, y:number... }, we now have { x:movingAverage(), y:movingAverage()... }
 * // Add a value to the averager
 * oAvg.x.add(20);
 * ```
 */
declare const mapObjectShallow: <TSource extends Record<string, any>, TFieldValue>(object: TSource, mapFunction: (args: MapObjectArgs) => TFieldValue) => RemapObjectPropertyType<TSource, TFieldValue>;
type MapObjectArgs = {
  field: string;
  path: string;
  value: any;
  index: number;
};
/**
 * Maps the contents of `data` using `mapper` as a structured set of map functions.
 * ```js
 * const a = {
 *  person: {
 *    size: 20
 *  }
 *  hello: `there`
 * }
 * mapObjectByObject(a, {
 *  person: {
 *    size: (value, context) => {
 *      return value * 2
 *    }
 *  }
 * });
 * // Yields: { person: { size: 40 }, hello: `there` }
 * ```
 * @param data
 * @param mapper
 * @returns
 */
declare function mapObjectByObject(data: object, mapper: Record<string, (value: any, context: any) => any>): {
  [k: string]: any;
};
//#endregion
//#region ../packages/core/src/records/merge.d.ts
type OptionalPropertyNames<T> = { [K in keyof T]-?: ({} extends Record<K, T[K]> ? K : never) }[keyof T];
type SpreadProperties<L, R, K extends keyof L & keyof R> = { [P in K]: L[P] | Exclude<R[P], undefined> };
type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
type SpreadTwo<L, R> = Id<Pick<L, Exclude<keyof L, keyof R>> & Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>>;
type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R] ? SpreadTwo<L, Spread<R>> : unknown;
/**
 * Merges objects together, the rightmost objects overriding properties of earlier objects.
 *
 * The return type is the intersection of all properties
 * ```js
 * const a = { name: `jane`, age: 30 };
 * const b = { name: `fred`, age: 31, colour: `blue` };
 * const c = mergeObjects(a, b);
 * // Yields:
 * // { name: `fred`, age: 31, colour: `blue` }
 * ```
 *
 * Alternatively, use {@link mergeObjectsSameShape} if the return shape
 * should be based on the first object.
 * @param a
 * @returns Merged object
 */
declare function mergeObjects<A extends object[]>(...a: [...A]): Spread<A>;
/**
 * Merges objects together, conforming to the shape of the first object.
 * Properties contained on later objects are ignored if they aren't part of the first.
 *
 * If a single object is passed in, a copy is returned.
 *
 * Use {@link mergeObjects} for object shape to be a union
 * @param aa
 * @param bb
 * @returns
 */
declare function mergeObjectsSameShape<T extends object>(...a: [T, ...Partial<T>[]]): T;
//#endregion
//#region ../packages/core/src/records/prefix.d.ts
/**
 * Returns a new object based on `data` but with all
 * properties prefixed by `prefix`.
 *
 * ```js
 * prefixProperties({ name: `x`, size: 10 }, `test-`);
 *
 * // Yields:
 * // { test-name: `x`, test-size: 10 }
 * ```
 * @param data
 * @param prefix
 * @returns
 */
declare function prefixProperties(data: Record<string | number, any>[], prefix: string): Record<string, unknown>[];
//#endregion
//#region ../packages/core/src/records/traverse.d.ts
type RecordEntry = Readonly<{
  name: string;
  sourceValue: any;
  nodeValue: any;
}>;
type RecordEntryWithAncestors = Readonly<{
  name: string;
  sourceValue: any;
  nodeValue: any;
  ancestors: string[];
}>;
type RecordEntryStatic = Readonly<{
  name: string;
  value: any;
  ancestors: string[];
}>;
/**
 * Options for parsing a path
 */
type PathOpts = {
  /**
   * Separator for path, eg '.'
   */
  readonly separator?: string;
};
type RecordChildrenOptions = Readonly<{
  /**
   * If set, only uses leaves or branches. 'none' means there is no filter.
   */
  filter: `none` | `leaves` | `branches`;
  /**
   * Default name to use. This is necessary in some cases, eg a root object.
   */
  name: string;
}>;
/**
 * Helper function to get a 'friendly' string representation of an array of {@link RecordEntry}.
 * @param entries
 * @returns
 */
declare function prettyPrintEntries(entries: readonly RecordEntry[]): string;
/**
 * Returns a human-friendly debug string for a tree-like structure
 * ```js
 * console.log(Trees.prettyPrint(obj));
 * ```
 * @param indent
 * @param node
 * @param options
 * @returns
 */
declare const recordEntryPrettyPrint: (node: object, indent?: number, options?: Partial<RecordChildrenOptions>) => string;
/**
 * Returns the direct children of a tree-like object as a pairing
 * of node name and value. Supports basic objects, Maps and arrays.
 *
 * Sub-children are included as an object blob.
 *
 * @example Simple object
 * ```js
 * const o = {
 *  colour: {
 *    r: 0.5, g: 0.5, b: 0.5
 *  }
 * };
 *
 * const children = [ ...Trees.children(o) ];
 * // Children:
 * // [
 * //  { name: "colour", value: { b: 0.5, g: 0.5, r: 0.5 } }
 * // ]
 * const subChildren = [ ...Trees.children(o.colour) ];
 * // [ { name: "r", value: 0.5 }, { name: "g", value: 0.5 }, { name: "b", value: 0.5 } ]
 * ```
 *
 * Arrays are assigned a name based on index.
 * @example Arrays
 * ```js
 * const colours = [ { r: 1, g: 0, b: 0 }, { r: 0, g: 1, b: 0 }, { r: 0, g: 0, b: 1 } ];
 * // Children:
 * // [
 * //  { name: "array[0]", value: {r:1,g:0,b:0} },
 * //  { name: "array[1]", value: {r:0,g:1,b:0} },
 * //  { name: "array[2]", value: {r:0,g:0,b:1} },
 * // ]
 * ```
 *
 * Pass in `options.name` (eg 'colours') to have names generated as 'colours[0]', etc.
 * Options can also be used to filter children. By default all direct children are returned.
 * @param node
 * @param options
 */
declare function recordChildren<T extends object>(node: T, options?: Partial<RecordChildrenOptions>): IterableIterator<RecordEntry>;
declare function recordEntriesDepthFirst<T extends object>(node: T, options?: Partial<RecordChildrenOptions>, ancestors?: string[]): IterableIterator<RecordEntryWithAncestors>;
/**
 * Returns the closest matching entry, tracing `path` in an array, Map or simple object.
 * Returns an entry with _undefined_ value at the point where tracing stopped.
 * Use {@link traceRecordEntryByPath} to step through all the segments.
 *
 * ```js
  * const people = {
    *  jane: {
 *   address: {
 *    postcode: 1000,
    *    street: 'West St',
    *    city: 'Blahville'
 *   },
 * colour: 'red'
  *  }
 * }
 * Trees.getByPath('jane.address.postcode', people); // '.' default separator
 * // ['postcode', 1000]
 * Trees.getByPath('jane.address.country.state', people);
 * // ['country', undefined] - since full path could not be resolved.
 * ```
 * @param path Path, eg `jane.address.postcode`
 * @param node Node to look within
 * @param options Options for parsing path. By default '.' is used as a separator
 * @returns
 */
declare function getRecordEntryByPath<T extends object>(path: string, node: T, options?: PathOpts): RecordEntry;
/**
 * Enumerates over children of `node` towards the node named in `path`.
 * This is useful if you want to get the interim steps to the target node.
 *
 * Use {@link getRecordEntryByPath} if you don't care about interim steps.
 *
 * ```js
 * const people = {
 *  jane: {
 *   address: {
 *    postcode: 1000,
 *    street: 'West St',
 *    city: 'Blahville'
 *   },
 * colour: 'red'
 *  }
 * }
 * for (const p of Trees.traceByPath('jane.address.street', people)) {
 * // { name: "jane", value: { address: { postcode: 1000,street: 'West St', city: 'Blahville' }, colour: 'red'} },
 * // { name: "address", value: { postcode: 1000, street: 'West St', city: 'Blahville' } },
 * // { name: "street", value: "West St" } }
 * }
 * ```
 *
 * Results stop when the path can't be followed any further.
 * The last entry will have a name of the last sought path segment, and _undefined_ as its value.
 *
 * @param path Path to traverse
 * @param node Starting node
 * @param options Options for path traversal logic
 * @returns
 */
declare function traceRecordEntryByPath<T extends object>(path: string, node: T, options?: PathOpts): Iterable<RecordEntryWithAncestors>;
//#endregion
//#region ../packages/core/src/records/values.d.ts
/**
 * Yields numerical values based on the an input of objects and the property to use.
 *
 * ```js
 * const data = [
 *  { size: 10 },  { size: 20 }, { size: 0 }
 * ]
 * [...enumerateNumericalValues(data, `size`)]; // [ 10, 20, 0 ]
 * ```
 *
 * If any of objects has a non numerical value for `propertyName`, a TypeError is thrown.
 * @param records
 * @param propertyName
 * @returns
 */
declare function enumerateNumericalValues(records: Record<string, unknown>[], propertyName: string): Generator<number, void, unknown>;
//#endregion
//#region ../packages/core/src/records/zip.d.ts
/**
 * Merge corresponding objects from arrays. This is assuming objects at the same array indices are connected.
 *
 * Arrays must be the same length. When merging objects, the properties of later objects override those of earlier objects.
 *
 * ```js
 * const a = [ { name: `jane`, age: 30 }, { name: `bob`, age: 40 } ];
 * const b = [ { name: `fred`, colour: `red` }, { name: `johanne` } ];
 * const c = [...zipObjects(a, b)];
 * // Yields:
 * // [
 * //   { name: `fred`, age: 30, colour: `red` },
 * //   { name: `johanne`, age: 40 }
 * // ]
 * ```
 * @param toMerge Arrays to merge
 * @throws {TypeError} If either parameter is not an array
 * @throws {TypeError} If the arrays are not of the same length
 * @returns Generator of merged records
 */
declare function zipObjects<T extends object[]>(...toMerge: { [K in keyof T]: Array<T[K]> }): Generator<Spread<T>, void, unknown>;
declare namespace records_d_exports {
  export { ChangeKind, ChangeRecord, CompareChangeSet, MapObjectArgs, PathOpts, RecordChildrenOptions, RecordEntry, RecordEntryStatic, RecordEntryWithAncestors, Spread, changedObjectDataFields, cloneFromFields, compareArrays, compareObjectData, compareObjectKeys, enumerateNumericalValues, getRecordEntryByPath, keysToNumbers, mapObjectByObject, mapObjectKeys, mapObjectShallow, mergeObjects, mergeObjectsSameShape, prefixProperties, prettyPrintEntries, recordChildren, recordEntriesDepthFirst, recordEntryPrettyPrint, removeCircularReferences, traceRecordEntryByPath, zipObjects };
}
declare namespace pathed_d_exports {
  export { CompareDataOptions, PathData, PathDataChange, applyChanges, compareData, getField, getPaths, getPathsAndData, updateByPath };
}
/**
 * Data at a particular path
 */
type PathData<V> = {
  /**
   * Path
   */
  path: string;
  /**
   * Value
   */
  value: V;
};
/**
 * A change to a value
 */
type PathDataChange<V> = PathData<V> & {
  /**
   * Previous value, if any
   */
  previous?: V;
  /**
   * Nature of the change
   */
  state: `change` | `added` | `removed`;
};
/**
 * Compare data
 */
type CompareDataOptions<V> = {
  /**
   * If _true_, it treats the B value as a partial
   * version of B. Only the things present in B are compared.
   * Omissions from B are not treated as removed keys.
   */
  asPartial: boolean;
  /**
   * If _true_ (default), if a value is undefined,
   * it signals that the key itself is removed.
   */
  undefinedValueMeansRemoved: boolean;
  pathPrefix: string;
  /**
   * Comparison function for values. By default uses
   * JSON.stringify() to compare by value.
   */
  eq: IsEqualContext<V>;
  /**
   * If true, inherited fields are also compared.
   * This is necessary for events, for example.
   *
   * Only plain-object values are used, the other keys are ignored.
   */
  deepEntries: boolean;
  /**
   * If _true_, includes fields that are present in B, but missing in A.
   * _False_ by default.
   */
  includeMissingFromA: boolean;
  /**
   * If _true_, emits a change under the path of a parent if its child has changed.
   * If _false_ (default) only changed keys are emitted.
   *
   * Eg if data is:
   * `{ colour: { h:0.5, s: 0.3, l: 0.5 }}`
   * and we compare with:
   * `{ colour: { h:1, s: 0.3, l: 0.5 }}`
   *
   * By default only 'colour.h' is emitted. If _true_ is set, 'colour' and 'colour.h' is emitted.
   */
  includeParents: boolean;
  skipInstances: WeakSet<any>;
};
/**
 * Scans object, producing a list of changed fields where B's value (newer) differs from A (older).
 *
 * Options:
 * - `deepEntries` (_false_): If _false_ Object.entries are used to scan the object. However this won't work for some objects, eg event args, thus _true_ is needed.
 * - `eq` (JSON.stringify): By-value comparison function
 * - `includeMissingFromA` (_false): If _true_ includes fields present on B but missing on A.
 * - `asPartial` (_false): If _true_, treats B as a partial update to B. This means that things missing from B are not considered removals.
 * @param a 'Old' value
 * @param b 'New' value
 * @param options Options for comparison
 * @returns
 */
declare function compareData<V extends Record<string, any>>(a: V, b: Partial<V>, options?: Partial<CompareDataOptions<V>>): Generator<PathDataChange<any>>;
/**
 * Returns a copy of `source` with `changes` applied.
 * @param source
 * @param changes
 */
declare const applyChanges: <V extends Record<string, any>>(source: V, changes: PathDataChange<any>[]) => V;
/**
 * Returns a copy of `target` object with a specified path changed to `value`.
 *
 * ```js
 * const a = {
 *  message: `Hello`,
 *  position: { x: 10, y: 20 }
 * }
 *
 * const a1 = updateByPath(a, `message`, `new message`);
 * // a1 = { message: `new message`, position: { x: 10, y: 20 }}
 * const a2 = updateByPath(a, `position.x`, 20);
 * // a2 = { message: `hello`, position: { x: 20, y: 20 }}
 * ```
 *
 * Paths can also be array indexes:
 * ```js
 * updateByPath([`a`,`b`,`c`], 2, `d`);
 * // Yields: [ `a`, `b`, `d` ]
 * ```
 *
 * By default, only existing array indexes can be updated. Use the `allowShapeChange` parameter
 * to allow setting arbitrary indexes.
 * ```js
 * // Throws because array index 3 is undefined
 * updateByPath([ `a`, `b`, `c` ], `3`, `d`);
 *
 * // With allowShapeChange flag
 * updateByPath([ `a`, `b`, `c` ], `3`, `d`, true);
 * // Returns: [ `a`, `b`, `c`, `d` ]
 * ```
 *
 * Throws an error if:
 * * `path` cannot be resolved (eg. `position.z` in the above example)
 * * `value` applied to `target` results in the object having a different shape (eg missing a field, field
 * changing type, or array index out of bounds). Use `allowShapeChange` to suppress this error.
 * * Path is undefined or not a string
 * * Target is undefined/null
 * @param target Object to update
 * @param path Path to set value
 * @param value Value to set
 * @param allowShapeChange By default _false_, throwing an error if an update change the shape of the original object.
 * @returns
 */
declare const updateByPath: <V extends Record<string, any>>(target: V, path: string, value: any, allowShapeChange?: boolean) => V;
/**
 * Gets the data at `path` in `object`. Assumes '.' separates each segment of path.
 *
 * ```js
 * getField({ name: { first: `Thom`, last: `Yorke` }}, `name.first`); // { value: `Thom`  success: true }
 * getField({ colours: [`red`, `green`, `blue` ]}, `colours.1`);      // { value: `green` success: true }
 * ```
 *
 * Returns an error result with more details, eg `{ success: false, error: 'Path could not be found' }`
 *
 * Throws if:
 * * `path` is not a string or empty
 * * `object` is _undefined_ or null
 * @param object Object to query
 * @param path Path
 * @param separator Separator of chunks of path. Defaults to '.'
 * @returns
 */
declare const getField: <V>(object: Record<string, any>, path: string, separator?: string) => Result<V, any>;
/**
 * Iterates 'paths' for all the fields on `o`
 * ```
 * const d = {
 *  accel: { x: 1, y: 2, z: 3 },
 *  gyro: { x: 4, y: 5, z: 6 }
 * };
 * const paths = [...getFieldPaths(d)];
 * // Yields [ `accel`, `gyro`, `accel.x`, `accel.y`,`accel.z`,`gyro.x`,`gyro.y`,`gyro.z` ]
 * ```
 *
 * Use {@link getField} to fetch data based on a path
 *
 * If object is _null_ or _undefined_, no results are returned.
 *
 * If `onlyLeaves` is _true_ (default: _false_), only 'leaf' nodes are included.
 * Leaf nodes are those that contain a primitive value.
 * ```js
 * const paths = getFieldPaths(d, true);
 * // Yields [ `accel.x`, `accel.y`,`accel.z`,`gyro.x`,`gyro.y`,`gyro.z` ]
 * ```
 *
 * @param object Object to get paths for.
 * @param onlyLeaves If true, only paths with a primitive value are returned.
 * @returns
 */
declare function getPaths(object: object | null, onlyLeaves?: boolean): Generator<string>;
/**
 * Returns a representation of the object as a set of paths and data.
 * ```js
 * const o = { name: `hello`, size: 20, colour: { r:200, g:100, b:40 } }
 * const pd = [...getPathsAndData(o)];
 * // Yields:
 * // [
 * // { path: `name`, value: `hello` },
 * // { path: `size`, value: `20` },
 * // { path: `colour.r`, value: `200` },
 * // { path: `colour.g`, value: `100` },
 * // { path: `colour.b`, value: `40` }
 * //]
 * ```
 * @param o Object to get paths and data for
 * @param maxDepth Set maximum recursion depth. By default unlimited.
 * @param prefix Manually set a path prefix if it's necessary
 * @returns
 */
declare function getPathsAndData(o: object, onlyLeaves?: boolean, maxDepth?: number, prefix?: string): Generator<PathData<any>>;
//#endregion
export { ChangeRecord as a, ChangeKind as i, pathed_d_exports as n, CompareChangeSet as o, records_d_exports as r, PathDataChange as t };