import { t as IsEqual } from "./is-equal--ZpQv_rE.js";
import { f as ToString, n as IDictionary, r as IWithEntries } from "./types-DhLXV-YQ.js";

//#region ../packages/core/src/maps.d.ts
declare namespace maps_d_exports {
  export { GetOrGenerate, GetOrGenerateSync, MergeReconcile, addObjectEntriesMutate, addValue, addValueMutate, addValueMutator, deleteByValueCompareMutate, filterValues, findBySomeKey, findEntryByPredicate, findEntryByValue, findValue, fromIterable, fromObject, getClosestIntegerKey, getOrGenerate, getOrGenerateSync, hasAnyValue, hasKeyValue, mapToArray, mapToObjectTransform, mergeByKey, some, sortByValue, sortByValueProperty, toArray, toObject, transformMap, zipKeyValue };
}
/**
 * Gets the closest integer key to `target` in `data`.
 * * Requires map to have numbers as keys, not strings
 * * Math.round is used for rounding `target`.
 *
 * Examples:
 * ```js
 * // Assuming numeric keys 1, 2, 3, 4 exist:
 * getClosestIntegerKey(map, 3);    // 3
 * getClosestIntegerKey(map, 3.1);  // 3
 * getClosestIntegerKey(map, 3.5);  // 4
 * getClosestIntegerKey(map, 3.6);  // 4
 * getClosestIntegerKey(map, 100);  // 4
 * getClosestIntegerKey(map, -100); // 1
 * ```
 * @param data Map
 * @param target Target value
 * @returns
 */
declare const getClosestIntegerKey: (data: ReadonlyMap<number, unknown>, target: number) => number;
/**
 * Returns the first value in `data` that matches a key from `keys`.
 * ```js
 * // Iterate, yielding: `a.b.c.d`, `b.c.d`, `c.d`, `d`
 * const keys = Text.segmentsFromEnd(`a.b.c.d`);
 * // Gets first value that matches a key (starting from most precise)
 * const value = findBySomeKey(data, keys);
 * ```
 * @param data
 * @param keys
 * @returns
 */
declare const findBySomeKey: <T>(data: ReadonlyMap<string, T>, keys: Iterable<string>) => T | undefined;
/**
 * Returns true if map contains `value` under `key`, using `comparer` function. Use {@link hasAnyValue} if you don't care
 * what key value might be under.
 *
 * Having a comparer function is useful to check by value rather than object reference.
 *
 * @example Find key value based on string equality
 * ```js
 * hasKeyValue(map,`hello`, `samantha`, (a, b) => a === b);
 * ```
 * @param map Map to search
 * @param key Key to search
 * @param value Value to search
 * @param comparer Function to determine match. By default uses === comparison.
 * @returns True if key is found
 */
declare const hasKeyValue: <K, V>(map: ReadonlyMap<K, V>, key: K, value: V, comparer?: IsEqual<V>) => boolean;
/**
 * Deletes all key/values from map where value matches `value`,
 * with optional comparer. Mutates map.
 *
 * ```js
 * // Compare fruits based on their colour property
 * const colourComparer = (a, b) => a.colour === b.colour;
 *
 * // Deletes all values where .colour = `red`
 * deleteByValueCompareMutate(map, { colour: `red` }, colourComparer);
 * ```
 * @param map
 * @param value
 * @param comparer Uses === equality by default. Use isEqualValueDefault to compare by value
 */
declare const deleteByValueCompareMutate: <K, V>(map: Map<K, V>, value: V, comparer?: IsEqual<V>) => void;
/**
 * Finds first entry by iterable value. Expects a map with an iterable as values.
 *
 * ```js
 * const map = new Map();
 * map.set('hello', 'a');
 * map.set('there', 'b');
 *
 * const entry = findEntryByPredicate(map, (value, key) => {
 *  return (value === 'b');
 * });
 * // Entry is: ['there', 'b']
 * ```
 *
 * An alternative is {@link findEntryByValue} to search by value.
 * @param map Map to search
 * @param predicate Filter function returns true when there is a match of value
 * @returns Entry, or _undefined_ if `filter` function never returns _true_
 */
declare const findEntryByPredicate: <K, V>(map: IWithEntries<K, V>, predicate: (value: V, key: K) => boolean) => readonly [key: K, value: V] | undefined;
/**
 * Finds first entry by value.
 *
 * ```js
 * const map = new Map();
 * map.set('hello', 'a');
 * map.set('there', 'b');
 *
 * const entry = findEntryByValue(map, 'b');
 * // Entry is: ['there', 'b']
 * ```
 *
 * Uses JS's === comparison by default. Consider using `isEqualValueDefault` to match by value.
 * An alternative is {@link findEntryByValue} to search by predicate function.
 * @param map Map to search
 * @param value Value to seek
 * @param isEqual Filter function which checks equality. Uses JS comparer by default.
 * @returns Entry, or _undefined_ if `value` not found.
 */
declare const findEntryByValue: <K, V>(map: IWithEntries<K, V>, value: V, isEqual?: IsEqual<V>) => readonly [key: K, value: V] | undefined;
/**
 * Adds items to a map only if their key doesn't already exist
 *
 * Uses provided {@link ToString} function to create keys for items. Item is only added if it doesn't already exist.
 * Thus the older item wins out, versus normal `Map.set` where the newest wins.
 *
 * Returns a copy of the input map.
 * @example
 * ```js
 * const map = new Map();
 * const peopleArray = [ _some people objects..._];
 * addKeepingExisting(map, p => p.name, ...peopleArray);
 * ```
 * @param set
 * @param hasher
 * @param values
 * @returns
 */
/**
 * Mutates `map`, adding each value to it using a
 * function to produce a key. Use {@link addValue} for an immutable version.
 * ```
 * const map = new Map();
 * addValueMutate(map, v=>v.name, { name:`Jane`, size:10 }, { name:`Bob`, size: 9 });
 * // Map consists of entries:
 * // [ `Jane`, { name:`Jane`, size:10 } ],
 * // [ `Bob` { name:`Bob`, size: 9 } ]
 * ```
 *
 * Uses {@link addValueMutator} under the hood.
 * @param map Map to modify. If _undefined_, a new map is created
 * @param hasher Function to generate a string key for a given object value
 * @param values Values to add
 * @param collisionPolicy What to do if the key already exists
 * @returns Map instance
 */
declare const addValueMutate: <V>(map: Map<string, V> | undefined, hasher: ToString<V>, collisionPolicy: `overwrite` | `skip` | `throw`, ...values: readonly V[]) => Map<string, V>;
/**
 * Adds values to a map, returning a new, modified copy and leaving the original
 * intact.
 *
 * Use {@link addValueMutate} for a mutable
 * @param map Map to start with, or _undefined_ to automatically create a map
 * @param hasher Function to create keys for values
 * @param collisionPolicy What to do if a key already exists
 * @param values Values to add
 * @returns A new map containing values
 */
declare const addValue: <V>(map: Map<string, V> | ReadonlyMap<string, V> | undefined, hasher: ToString<V>, collisionPolicy: `overwrite` | `skip` | `throw`, ...values: readonly V[]) => Map<string, V>;
/**
 * Returns a function that adds values to a map, using a hashing function to produce a key.
 * Use {@link addValueMutate} if you don't need a reusable function.
 *
 * ```js
 * const map = new Map(); // Create map
 * const mutate = addValueMutator(map, v=>v.name); // Create a mutator using default 'overwrite' policy
 * mutate( { name:`Bob`, size:10 }, { name: `Alice`, size: 2 }); // Add values to map
 * mutate( {name: `Bob`, size: 11 }); // Change the value stored under key `Bob`.
 * map.get(`Bob`); // { name: `Bob`, size: 11 }
 * ```
 *
 * The 'collision policy' determines what to do if the key already exists. The default behaviour
 * is to overwrite the key, just as Map.set would.
 * ```js
 * const map = new Map();
 * const mutate = addValueMutator(map, v=>v.name, `skip`);
 * mutate( { name:`Bob`,size:10 }, { name: `Alice`, size: 2 }); // Add values to map
 * mutate( { name:`Bob`, size: 20 }); // This value would be skipped because map already contains 'Bob'
 * map.get(`Bob`); // { name: `Bob`, size: 10 }
 * ```
 *
 * @param map Map to modify
 * @param hasher Hashing function to make a key for a value
 * @param collisionPolicy What to do if a value is already stored under a key
 * @returns Function
 */
declare const addValueMutator: <V>(map: Map<string, V>, hasher: ToString<V>, collisionPolicy?: `overwrite` | `skip` | `throw`) => (...values: readonly V[]) => Map<string, V>;
/**
 * Returns a array of entries from a map, sorted by value.
 *
 * ```js
 * const m = new Map();
 * m.set(`4491`, { name: `Bob` });
 * m.set(`2319`, { name: `Alice` });
 *
 * // Compare by name
 * const comparer = (a, b) => defaultComparer(a.name, b.name);
 *
 * // Get sorted values
 * const sorted = Maps.sortByValue(m, comparer);
 * ```
 *
 * `sortByValue` takes a comparison function that should return -1, 0 or 1 to indicate order of `a` to `b`.
 * @param map
 * @param comparer
 * @returns
 */
declare const sortByValue: <K, V>(map: ReadonlyMap<K, V>, comparer?: (a: V, b: V) => number) => [K, V][];
/**
 * Returns an array of entries from a map, sorted by a property of the value
 *
 * ```js
 * const m = new Map();
 * m.set(`4491`, { name: `Bob` });
 * m.set(`2319`, { name: `Alice` });
 * const sorted = sortByValueProperty(m, `name`);
 * ```
 * @param map Map to sort
 * @param property Property of value
 * @param compareFunction Comparer. If unspecified, uses a default.
 */
declare const sortByValueProperty: <K, V, Z>(map: ReadonlyMap<K, V>, property: string, compareFunction?: (a: Z, b: Z) => number) => [K, V][];
/**
 * Returns _true_ if any key contains `value`, based on the provided `comparer` function. Use {@link hasKeyValue}
 * if you only want to find a value under a certain key.
 *
 * Having a comparer function is useful to check by value rather than object reference.
 * @example Finds value where name is 'samantha', regardless of other properties
 * ```js
 * hasAnyValue(map, {name:`samantha`}, (a, b) => a.name === b.name);
 * ```
 *
 * Works by comparing `value` against all values contained in `map` for equality using the provided `comparer`.
 *
 * @param map Map to search
 * @param value Value to find
 * @param comparer Function that determines matching. Should return true if `a` and `b` are considered equal.
 * @returns True if value is found
 */
declare const hasAnyValue: <K, V>(map: ReadonlyMap<K, V>, value: V, comparer: IsEqual<V>) => boolean;
/**
 * Returns values where `predicate` returns true.
 *
 * If you just want the first match, use `find`
 *
 * @example All people over thirty
 * ```js
 * // for-of loop
 * for (const v of filterValues(people, person => person.age > 30)) {
 *
 * }
 * // If you want an array
 * const overThirty = Array.from(filterValues(people, person => person.age > 30));
 * ```
 * @param map Map
 * @param predicate Filtering predicate
 * @returns Values that match predicate
 */
declare function filterValues<V>(map: ReadonlyMap<string, V>, predicate: (v: V) => boolean): Generator<V, void, unknown>;
/**
 * Copies data to an array
 * @param map
 * @returns
 */
declare const toArray: <V>(map: ReadonlyMap<string, V>) => V[];
/**
 * Returns a Map from an iterable. By default throws an exception
 * if iterable contains duplicate values.
 *
 * ```js
 * const data = [
 *  { fruit: `granny-smith`, family: `apple`, colour: `green` },
 *  { fruit: `mango`, family: `stone-fruit`, colour: `orange` }
 * ];
 * const map = fromIterable(data, v => v.fruit);
 * map.get(`granny-smith`); // { fruit: `granny-smith`, family: `apple`, colour: `green` }
 * ```
 * @param data Input data
 * @param keyFunction Function which returns a string id. By default uses the JSON value of the object.
 * @param collisionPolicy By default, values with same key overwrite previous (`overwrite`)
 * @returns
 */
declare const fromIterable: <V>(data: Iterable<V>, keyFunction?: (itemToMakeStringFor: V) => string, collisionPolicy?: `overwrite` | `skip` | `throw`) => ReadonlyMap<string, V>;
/**
 * Returns a Map from an object, or array of objects.
 * Assumes the top-level properties of the object is the key.
 *
 * ```js
 * const data = {
 *  Sally: { name: `Sally`, colour: `red` },
 *  Bob: { name: `Bob`, colour: `pink` }
 * };
 * const map = fromObject(data);
 * map.get(`Sally`); // { name: `Sally`, colour: `red` }
 * ```
 *
 * To add an object to an existing map, use {@link addObjectEntriesMutate}.
 * @param data
 * @returns
 */
declare const fromObject: <V>(data: object | object[]) => ReadonlyMap<string, V>;
/**
 * Adds an object to an existing map, mutating it.
 * It assumes a structure where each top-level property is a key:
 *
 * ```js
 * const data = {
 *  Sally: { colour: `red` },
 *  Bob:   { colour: `pink` }
 * };
 * const map = new Map();
 * addObjectEntriesMutate(map, data);
 *
 * map.get(`Sally`); // { name: `Sally`, colour: `red` }
 * ```
 *
 * To create a new map from an object, use {@link fromObject} instead.
 * @param map
 * @param data
 */
declare const addObjectEntriesMutate: <V>(map: Map<string, V>, data: object) => void;
/**
 * Returns the first found value that matches `predicate` or _undefined_.
 * To get an entry see {@link findEntryByPredicate}
 *
 * Use {@link some} if you don't care about the value, just whether it appears.
 * Use {@link filterValues} to get all value(s) that match `predicate`.
 *
 * @example First person over thirty
 * ```js
 * const overThirty = findValue(people, person => person.age > 30);
 * ```
 * @param map Map to search
 * @param predicate Function that returns true for a matching value
 * @returns Found value or _undefined_
 */
declare const findValue: <K, V>(map: ReadonlyMap<K, V>, predicate: (v: V) => boolean) => V | undefined;
/**
 * Returns _true_ if `predicate` yields _true_ for any value in `map`.
 * Use {@link findValue} if you want the matched value.
 * ```js
 * const map = new Map();
 * map.set(`fruit`, `apple`);
 * map.set(`colour`, `red`);
 * Maps.some(map, v => v === `red`);    // true
 * Maps.some(map, v => v === `orange`); // false
 * ```
 * @param map
 * @param predicate
 * @returns
 */
declare const some: <V>(map: ReadonlyMap<string, V>, predicate: (v: V) => boolean) => boolean;
/**
 * Converts a map to a simple object, transforming from type `T` to `K` as it does so. If no transforms are needed, use {@link toObject}.
 *
 * ```js
 * const map = new Map();
 * map.set(`name`, `Alice`);
 * map.set(`pet`, `dog`);
 *
 * const o = mapToObjectTransform(map, v => {
 *  ...v,
 *  registered: true
 * });
 *
 * // Yields: { name: `Alice`, pet: `dog`, registered: true }
 * ```
 *
 * If the goal is to create a new map with transformed values, use {@link transformMap}.
 * @param m
 * @param valueTransform
 * @typeParam T Value type of input map
 * @typeParam K Value type of destination map
 * @returns
 */
declare const mapToObjectTransform: <T, K>(m: ReadonlyMap<string, T>, valueTransform: (value: T) => K) => Readonly<Record<string, K>>;
/**
 * Zips together an array of keys and values into an object. Requires that
 * `keys` and `values` are the same length.
 *
 * @example
 * ```js
 * const o = zipKeyValue([`a`, `b`, `c`], [0, 1, 2])
 * Yields: { a: 0, b: 1, c: 2}
 *```
 * @param keys String keys
 * @param values Values
 * @typeParam V Type of values
 * @return Object with keys and values
 */
declare const zipKeyValue: <V>(keys: readonly string[], values: ArrayLike<V | undefined>) => {
  [k: string]: V | undefined;
};
/**
 * Like `Array.map`, but for a Map. Transforms from Map<K,V> to Map<K,R>, returning as a new Map.
 *
 * @example
 * ```js
 * const mapOfStrings = new Map();
 * mapOfStrings.set(`a`, `10`);
 * mapOfStrings.get(`a`); // Yields `10` (a string)
 *
 * // Convert a map of string->string to string->number
 * const mapOfInts = transformMap(mapOfStrings, (value, key) => parseInt(value));
 *
 * mapOfInts.get(`a`); // Yields 10 (a proper number)
 * ```
 *
 * If you want to combine values into a single object, consider instead  {@link mapToObjectTransform}.
 * @param source
 * @param transformer
 * @typeParam K Type of keys (generally a string)
 * @typeParam V Type of input map values
 * @typeParam R Type of output map values
 * @returns
 */
declare const transformMap: <K, V, R>(source: ReadonlyMap<K, V>, transformer: (value: V, key: K) => R) => Map<K, R>;
/**
 * Converts a `Map` to a plain object, useful for serializing to JSON.
 * To convert back to a map use {@link fromObject}.
 *
 * @example
 * ```js
 * const map = new Map();
 * map.set(`Sally`, { name: `Sally`, colour: `red` });
 * map.set(`Bob`, { name: `Bob`, colour: `pink });
 *
 * const objects = Maps.toObject(map);
 * // Yields: {
 * //  Sally: { name: `Sally`, colour: `red` },
 * //  Bob: { name: `Bob`, colour: `pink` }
 * // }
 * ```
 * @param m
 * @returns
 */
declare const toObject: <T>(m: ReadonlyMap<string, T>) => Readonly<Record<string, T>>;
/**
 * Converts Map to Array with a provided `transformer` function. Useful for plucking out certain properties
 * from contained values and for creating a new map based on transformed values from an input map.
 *
 * @example Get an array of ages from a map of Person objects
 * ```js
 * const person = { age: 29, name: `John`};
 * map.set(person.name, person);
 *
 * const ages = mapToArray(map, (key, person) => person.age);
 * // [29, ...]
 * ```
 *
 * In the above example, the `transformer` function returns a number, but it could
 * just as well return a transformed version of the input:
 *
 * ```js
 * // Return with random heights and uppercased name
 * mapToArray(map, (key, person) => ({
 *  ...person,
 *  height: Math.random(),
 *  name: person.name.toUpperCase();
 * }))
 * // Yields:
 * // [{height: 0.12, age: 29, name: "JOHN"}, ...]
 * ```
 * @param m
 * @param transformer A function that takes a key and item, returning a new item.
 * @returns
 */
declare const mapToArray: <K, V, R>(m: ReadonlyMap<K, V>, transformer: (key: K, item: V) => R) => readonly R[];
/**
 * Returns a result of `a` merged into `b`.
 * `b` is always the 'newer' data that takes
 * precedence.
 */
type MergeReconcile<V> = (a: V, b: V) => V;
/**
 * Merges maps left to right, using the provided
 * `reconcile` function to choose a winner when keys overlap.
 *
 * There's also @ixfx/arrays/mergeByKey if you don't already have a map.
 *
 * For example, if we have the map A:
 * 1 => `A-1`, 2 => `A-2`, 3 => `A-3`
 *
 * And map B:
 * 1 => `B-1`, 2 => `B-2`, 4 => `B-4`
 *
 * If they are merged with the reconile function:
 * ```js
 * const reconcile = (a, b) => b.replace(`-`, `!`);
 * const output = mergeByKey(reconcile, mapA, mapB);
 * ```
 *
 * The final result will be:
 *
 * 1 => `B!1`, 2 => `B!2`, 3 => `A-3`, 4 => `B-4`
 *
 * In this toy example, it's obvious how the reconciler transforms
 * data where the keys overlap. For the keys that do not overlap -
 * 3 and 4 in this example - they are copied unaltered.
 *
 * A practical use for `mergeByKey` has been in smoothing keypoints
 * from a TensorFlow pose. In this case, we want to smooth new keypoints
 * with older keypoints. But if a keypoint is not present, for it to be
 * passed through.
 *
 * @param reconcile
 * @param maps
 */
declare const mergeByKey: <K, V>(reconcile: MergeReconcile<V>, ...maps: readonly ReadonlyMap<K, V>[]) => ReadonlyMap<K, V>;
type GetOrGenerate<K, V, Z> = (key: K, args?: Z) => Promise<V>;
type GetOrGenerateSync<K, V, Z> = (key: K, args?: Z) => V;
/**
 * @inheritDoc getOrGenerate
 * @param map
 * @param fn
 * @returns
 */
declare const getOrGenerateSync: <K, V, Z>(map: IDictionary<K, V>, fn: (key: K, args?: Z) => V) => (key: K, args?: Z) => V;
/**
 * Returns a function that fetches a value from a map, or generates and sets it if not present.
 * Undefined is never returned, because if `fn` yields that, an error is thrown.
 *
 * See {@link getOrGenerateSync} for a synchronous version.
 *
 * ```
 * const m = getOrGenerate(new Map(), (key) => {
 *  return key.toUppercase();
 * });
 *
 * // Not contained in map, so it will run the uppercase function,
 * // setting the value to the key 'hello'.
 * const v = await m(`hello`);  // Yields 'HELLO'
 * const v1 = await m(`hello`); // Value exists, so it is returned ('HELLO')
 * ```
 *
 */
declare const getOrGenerate: <K, V, Z>(map: IDictionary<K, V>, fn: (key: K, args?: Z) => Promise<V> | V) => GetOrGenerate<K, V, Z>;
//#endregion
export { transformMap as A, maps_d_exports as C, sortByValueProperty as D, sortByValue as E, toArray as O, mapToObjectTransform as S, some as T, getOrGenerate as _, addValue as a, hasKeyValue as b, deleteByValueCompareMutate as c, findEntryByPredicate as d, findEntryByValue as f, getClosestIntegerKey as g, fromObject as h, addObjectEntriesMutate as i, zipKeyValue as j, toObject as k, filterValues as l, fromIterable as m, GetOrGenerateSync as n, addValueMutate as o, findValue as p, MergeReconcile as r, addValueMutator as s, GetOrGenerate as t, findBySomeKey as u, getOrGenerateSync as v, mergeByKey as w, mapToArray as x, hasAnyValue as y };