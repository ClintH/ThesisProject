import { t as IsEqual } from "./is-equal--ZpQv_rE.js";
import { f as ToString, i as Interval, r as IWithEntries } from "./types-DhLXV-YQ.js";
import { A as transformMap, D as sortByValueProperty, E as sortByValue, O as toArray, S as mapToObjectTransform, T as some, _ as getOrGenerate, a as addValue$1, b as hasKeyValue, c as deleteByValueCompareMutate, d as findEntryByPredicate, f as findEntryByValue, g as getClosestIntegerKey, h as fromObject, i as addObjectEntriesMutate, j as zipKeyValue, k as toObject, l as filterValues, m as fromIterable, n as GetOrGenerateSync, o as addValueMutate, p as findValue, r as MergeReconcile, s as addValueMutator, t as GetOrGenerate, u as findBySomeKey, v as getOrGenerateSync, w as mergeByKey, x as mapToArray, y as hasAnyValue } from "./maps-HjV-V9da.js";
import { a as SimplifiedNode, c as TraverseObjectEntryStatic, d as TreeNode, f as WrappedNode, i as LabelledValues, l as TraverseObjectEntryWithAncestors, n as LabelledSingleValue, o as TraversableTree, r as LabelledValue, s as TraverseObjectEntry, t as LabelledNode, u as TraverseObjectPathOpts } from "./types-BJU7cQJI.js";
import { i as IStackImmutable, n as StackMutable, r as StackImmutable, t as index_d_exports$4 } from "./index-DPbxZRux.js";
import { t as SimpleEventEmitter } from "./simple-event-emitter-B_mKSo1Q.js";
import { n as ValueSetEventMap, t as ISetMutable } from "./ISetMutable-C1FvKxbn.js";
import { a as QueueOpts, i as QueueDiscardPolicy, n as QueueImmutable, r as QueueMutable, t as index_d_exports$2 } from "./index-pq0-DnTO.js";

//#region ../packages/collections/src/circular-array.d.ts
interface ICircularArray<V> extends Array<V> {
  /**
   * Returns true if the array has filled to capacity and is now
   * recycling array indexes.
   */
  get isFull(): boolean;
  /**
   * Returns a new Circular with item added
   *
   * Items are added at `pointer` position, which automatically cycles through available array indexes.
   *
   * @param value Thing to add
   * @returns Circular with item added
   */
  add(value: V): ICircularArray<V>;
  get length(): number;
  /**
   * Returns the current add position of array.
   */
  get pointer(): number;
}
/**
 * A circular array keeps a maximum number of values, overwriting older values as needed. Immutable.
 *
 * `CircularArray` extends the regular JS array. Only use `add` to change the array if you want
 * to keep the `CircularArray` behaviour.
 *
 * @example Basic functions
 * ```js
 * let a = new CircularArray(10);
 * a = a.add(`hello`);  // Because it's immutable, capture the return result of `add`
 * a.isFull;            // True if circular array is full
 * a.pointer;           // The current position in array it will write to
 * ```
 *
 * Since it extends the regular JS array, you can access items as usual:
 * @example Accessing
 * ```js
 * let a = new CircularArray(10);
 * ... add some stuff ..
 * a.forEach(item => // do something with item);
 * ```
 * @param capacity Maximum capacity before recycling array entries
 * @return Circular array
 */
declare class CircularArray<V> extends Array {
  #private;
  constructor(capacity?: number);
  /**
   * Add to array
   * @param value Thing to add
   * @returns
   */
  add(value: V): CircularArray<V>;
  get pointer(): number;
  get isFull(): boolean;
}
//#endregion
//#region ../packages/collections/src/tree/compare.d.ts
type DiffAnnotation<T> = {
  /**
   * In the case of changes, this is old value
   */
  a: TraversableTree<T>;
  /**
   * In the case of changes, this is the new value
   */
  b: TraversableTree<T>;
  /**
   * If true, this node's value has been modified
   */
  valueChanged: boolean;
  /**
   * If true, one of the child values has changed
   */
  childChanged: boolean;
  /**
   * List of new children
   */
  added: TraversableTree<T>[];
  /**
   * List of removed children
   */
  removed: TraversableTree<T>[];
};
type DiffNode<T> = TreeNode<DiffAnnotation<T>> & {
  toString: () => string;
};
declare const compare$1: <T>(a: TraversableTree<T>, b: TraversableTree<T>, eq?: IsEqual<T>, parent?: DiffNode<T>) => DiffNode<T>;
declare namespace tree_mutable_d_exports {
  export { add, addValue, asDynamicTraversable$1 as asDynamicTraversable, breadthFirst$1 as breadthFirst, children$1 as children, childrenLength$1 as childrenLength, childrenValues, compare, computeMaxDepth, createNode, depthFirst$2 as depthFirst, findAnyChildByValue$1 as findAnyChildByValue, findChildByValue$1 as findChildByValue, findParentsValue, followValue$1 as followValue, fromPlainObject, getRoot, hasAnyChild$1 as hasAnyChild, hasAnyParent$1 as hasAnyParent, hasChild$1 as hasChild, hasParent$1 as hasParent, nodeDepth, parents$1 as parents, parentsValues, queryByValue, queryParentsValue, remove, root, rootWrapped, setChildren, stripParentage, throwTreeTest, toStringDeep$2 as toStringDeep, treeTest, value, wrap };
}
/**
 * Compares two nodes.
 *
 * By default uses `isEqualValueIgnoreOrder` to compare nodes. This means
 * values of nodes will be compared, ignoring the order of fields.
 * @param a
 * @param b
 * @param eq Comparison function. Uses `isEqualValueIgnoreOrder` by default.
 * @returns Compare results
 */
declare const compare: <T>(a: TreeNode<T>, b: TreeNode<T>, eq?: IsEqual<T>) => DiffNode<T>;
/**
 * Converts `TreeNode` to `SimplifiedNode`, removing the 'parent' fields.
 * This can be useful because if you have the whole tree, the parent field
 * is redundant and because it makes circular references can make dumping to console etc more troublesome.
 *
 * Recursive: strips parentage of all children and so on too.
 * @param node
 * @returns
 */
declare const stripParentage: <T>(node: TreeNode<T>) => SimplifiedNode<T>;
/**
 * Wraps node `n` for a more object-oriented means of access.
 * It will wrap child nodes on demand. For this reason, WrappedNode object
 * identity is not stable
 * @param n Node to wrap
 * @returns
 */
declare const wrap: <T>(n: TreeNode<T>) => WrappedNode<T>;
/**
 * Removes `child` from the tree structure it is in.
 * It removes `child` from its parent. Any sub-children of `child` still remain connected.
 * @param child
 * @returns
 */
declare const remove: <T>(child: TreeNode<T>) => void;
/**
 * Depth-first iteration of the children of `node`
 * @param node
 * @returns
 */
declare function depthFirst$2<T>(node: TreeNode<T>): IterableIterator<TreeNode<T>>;
/**
 * Breadth-first iteration of the children of `node`
 * @param node
 * @returns
 */
declare function breadthFirst$1<T>(node: TreeNode<T>): IterableIterator<TreeNode<T>>;
/**
 * Validates the tree from `root` downwards.
 * @param root
 * @param seen
 * @returns
 */
declare function treeTest<T>(root: TreeNode<T>, seen?: TreeNode<T>[]): [ok: boolean, msg: string, node: TreeNode<T>];
/**
 * Throws an exception if `root` fails tree validation
 * @param root
 * @returns
 */
declare function throwTreeTest<T>(root: TreeNode<T>): void;
/**
 * Iterate over direct children of `root`, yielding {@link TreeNode} instances.
 * Use {@link childrenValues} to iterate over child values
 * @param root
 */
declare function children$1<T>(root: TreeNode<T>): IterableIterator<TreeNode<T>>;
/**
 * Iterate over the value ofdirect children of `root`.
 * Use {@link children} if you want to iterate over {@link TreeNode} instances instead.
 * @param root
 */
declare function childrenValues<T>(root: TreeNode<T>): IterableIterator<T>;
/**
 * Iterate over all parents of `root`. First result is the immediate parent.
 * @param root
 */
declare function parents$1<T>(root: TreeNode<T>): IterableIterator<TreeNode<T>>;
/**
 * Returns the depth of `node`. A root node (ie. with no parents) has a depth of 0.
 * @param node
 * @returns
 */
declare function nodeDepth(node: TreeNode<any>): number;
declare const hasChild$1: <T>(child: TreeNode<T>, parent: TreeNode<T>) => boolean;
/**
 * Returns the first immediate child of `parent` that matches `value`.
 *
 * Use {@link queryByValue} if you want all matching children.
 * @param value
 * @param parent
 * @param eq
 * @returns
 */
declare const findChildByValue$1: <T>(value: T, parent: TreeNode<T>, eq?: IsEqual<T>) => TreeNode<T> | undefined;
/**
 * Yield all immediate children of `parent` that match `value`.
 *
 * Use {@link findChildByValue} if you only want the first matching child.
 * @param value
 * @param parent
 * @param eq
 */
declare function queryByValue<T>(value: T, parent: TreeNode<T>, eq?: IsEqual<T>): IterableIterator<TreeNode<T>>;
/**
 * Returns _true_ if `prospectiveChild` is some child node of `parent`,
 * anywhere in the tree structure.
 *
 * Use {@link hasChild} to only check immediate children.
 * @param prospectiveChild
 * @param parent
 * @returns
 */
declare const hasAnyChild$1: <T>(prospectiveChild: TreeNode<T>, parent: TreeNode<T>) => boolean;
declare const findAnyChildByValue$1: <T>(value: T, parent: TreeNode<T>, eq?: IsEqual<T>) => TreeNode<T> | undefined;
declare const getRoot: <T>(node: TreeNode<T>) => TreeNode<T>;
/**
 * Returns _true_ if `prospectiveParent` is any ancestor
 * parent of `child`.
 *
 * Use {@link hasParent} to only check immediate parent.
 * @param child
 * @param prospectiveParent
 * @returns
 */
declare const hasAnyParent$1: <T>(child: TreeNode<T>, prospectiveParent: TreeNode<T>) => boolean;
/**
 * Yields the node value of each parent of `child`.
 * _undefined_ values are not returned.
 *
 * Use {@link queryParentsValue} to search for a particular value
 * @param child
 * @returns
 */
declare function parentsValues<T>(child: TreeNode<T>): Generator<T & ({} | null), boolean, unknown>;
/**
 * Yields all parents of `child` that have a given value.
 * Use {@link findParentsValue} to find the first match only.
 * @param child
 * @param value
 * @param eq
 * @returns
 */
declare function queryParentsValue<T>(child: TreeNode<T>, value: T, eq?: IsEqual<T>): Generator<TreeNode<T>, boolean, unknown>;
/**
 * Returns the first parent that has a given value.
 * @param child
 * @param value
 * @param eq
 * @returns
 */
declare function findParentsValue<T>(child: TreeNode<T>, value: T, eq?: IsEqual<T>): TreeNode<T> | undefined;
/**
 * Returns _true_ if `prospectiveParent` is the immediate
 * parent of `child`.
 *
 * Use {@link hasAnyParent} to check for any ancestor parent.
 * @param child
 * @param prospectiveParent
 * @returns
 */
declare const hasParent$1: <T>(child: TreeNode<T>, prospectiveParent: TreeNode<T>) => boolean;
/**
 * Computes the maximum depth of the tree.
 * That is, how many steps down from `node` it can go.
 * If a tree is: root -> childA -> subChildB
 * ```js
 * // Yields 2, since there are at max two steps down from root
 * computeMaxDepth(root);
 * ```
 * @param node
 * @returns
 */
declare const computeMaxDepth: <T>(node: TreeNode<T>) => number;
declare const add: <T>(child: TreeNode<T>, parent: TreeNode<T>) => void;
declare const addValue: <T>(value: T | undefined, parent: TreeNode<T>) => TreeNode<T>;
/**
 * Creates the root for a tree, with an optional `value`.
 * Use {@link rootWrapped} if you want a more object-oriented mode of access.
 * @param value
 * @returns
 */
declare const root: <T>(value?: T) => TreeNode<T>;
declare const fromPlainObject: (value: Record<string, any>, label?: string, parent?: TreeNode<any>, seen?: any[]) => TreeNode<LabelledSingleValue<any>>;
/**
 * Creates a tree, returning it as a {@link WrappedNode} for object-oriented access.
 * Use {@link Trees.Mutable.root} alternatively.
 * @param value
 * @returns
 */
declare const rootWrapped: <T>(value: T | undefined) => WrappedNode<T>;
/**
 * Creates a `TreeNode` instance with a given value and parent.
 * Parent node, if specified, has its `childrenStore` property changed to include new child.
 * @param value
 * @param parent
 * @returns
 */
declare const createNode: <T>(value: T | undefined, parent?: TreeNode<T>) => TreeNode<T>;
declare const childrenLength$1: <T>(node: TreeNode<T>) => number;
declare const value: <T>(node: TreeNode<T>) => T | undefined;
/**
 * Projects `node` as a dynamic traversable.
 * Dynamic in the sense that it creates the traversable project for nodes on demand.
 * A consequence is that node identities are not stable.
 * @param node
 * @returns
 */
declare const asDynamicTraversable$1: <T>(node: TreeNode<T>) => TraversableTree<T>;
declare const setChildren: <T>(parent: TreeNode<T>, children: TreeNode<T>[]) => void;
declare const toStringDeep$2: <T>(node: TreeNode<T>, indent?: number) => string;
declare function followValue$1<T>(root: TreeNode<T>, continuePredicate: (nodeValue: T, depth: number) => boolean, depth?: number): IterableIterator<T | undefined>;
declare namespace pathed_d_exports {
  export { PathOpts, addValueByPath, childrenLengthByPath, clearValuesByPath, create$2 as create, removeByPath, valueByPath, valuesByPath };
}
/**
 * Options for parsing a path
 */
type PathOpts = Readonly<{
  /**
   * Separator for path, eg '.'
   */
  separator: string;
  /**
   * If two values are stored at same path, what to do? Default: overwrite
   * * overwrite: last-write wins
   * * ignore: first-write wins
   * * allow: allow multiple values
   */
  duplicates: `overwrite` | `allow` | `ignore`;
}>;
/**
 * Creates a wrapper for working with 'pathed' trees.
 * An example is a filesystem.
 *
 * ```js
 * const t = create();
 * // Store a value. Path implies a structure of
 * //   c -> users -> admin
 * // ...which is autoatically created
 * t.add({x:10}, `c.users.admin`);
 *
 * t.add({x:20}, `c.users.guest`);
 * // Tree will now be:
 * // c-> users -> admin
 * //            -> guest
 *
 * t.getValue(`c.users.guest`); // { x:20 }
 * ```
 *
 * By default only a single value can be stored at a path.
 * Set options to allow this:
 * ```js
 * const t = create({ duplicates: `allow` });
 * t.add({x:10}, `c.users.admin`);
 * t.add({x:20}, `c.users.admin`);
 * t.getValue(`c.users.admin`);   // Throws an error because there are multiple values
 * t.getValues(`c.users.admin`);  // [ {x:10}, {x:20 } ]
 * ```
 * @param pathOpts
 * @returns
 */
declare const create$2: <T>(pathOpts?: Partial<PathOpts>) => {
  getRoot: () => TreeNode<LabelledValue<T>> | undefined;
  add: (value: T, path: string) => void;
  prettyPrint: () => string;
  remove: (path: string) => boolean;
  getValue: (path: string) => T | undefined;
  getValues: (path: string) => T[];
  hasPath: (path: string) => boolean;
  childrenLength: (path: string) => number;
  getNode: (path: string) => LabelledNode<T> | undefined;
  clearValues: (path: string) => boolean;
};
/**
 * Adds a value by a string path, with '.' as a the default delimiter
 * Automatically generates intermediate nodes.
 *
 * ```js
 * const root = addValueByPath({}, 'c');
 * addValueByPath({x:'blah'}, 'c.users.admin', root);
 * ```
 *
 * Creates the structure:
 * ```
 * c          value: { }            label: c
 * + users    value: undefined      label: users
 *  + admin   value: { x: 'blah' }  label: admin
 * ```
 *
 * By default, multiple values under same key are overwritten, with the most recent winning.
 * @param value
 * @param path
 * @param pathOpts
 */
declare const addValueByPath: <T>(value: T, path: string, node?: LabelledNode<T>, pathOpts?: Partial<PathOpts>) => LabelledNode<T>;
declare const removeByPath: <T>(path: string, root: LabelledNode<T>, pathOpts?: Partial<PathOpts>) => boolean;
declare const clearValuesByPath: <T>(path: string, root: LabelledNode<T>, pathOpts?: Partial<PathOpts>) => boolean;
declare const childrenLengthByPath: <T>(path: string, node: LabelledNode<T>, pathOpts?: Partial<PathOpts>) => number;
declare const valueByPath: <T>(path: string, node: LabelledNode<T>, pathOpts?: Partial<PathOpts>) => T | undefined;
declare const valuesByPath: <T>(path: string, node: LabelledNode<T>, pathOpts?: Partial<PathOpts>) => T[];
declare namespace traverse_object_d_exports {
  export { ChildrenOptions, CreateOptions, asDynamicTraversable, children, create$1 as create, createSimplified, createWrapped, depthFirst$1 as depthFirst, getByPath, prettyPrint, prettyPrintEntries, toStringDeep$1 as toStringDeep, traceByPath };
}
/**
 * Helper function to get a 'friendly' string representation of an array of {@link TraverseObjectEntry}.
 * @param entries
 * @returns
 */
declare function prettyPrintEntries(entries: readonly TraverseObjectEntry[]): string;
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
declare const prettyPrint: (node: object, indent?: number, options?: Partial<ChildrenOptions>) => string;
/**
 * Returns a debug string representation of the node (recursive)
 * @param node
 * @param indent
 * @returns
 */
declare const toStringDeep$1: (node: TreeNode<TraverseObjectEntry | TraverseObjectEntryStatic>, indent?: number) => string;
type ChildrenOptions = Readonly<{
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
 * Yields the direct (ie. non-recursive) children of a tree-like object as a pairing
 * of node name and value. Supports basic objects, Maps and arrays.
 *
 * To iterate recursively, consider {@link depthFirst}
 *
 * Each child is returned in an {@link TraverseObjectEntry} structure:
 * ```typescript
 * type Entry = Readonly<{
 *  // Property name
 *  name: string,
 *  // Value of property, as if you called `object[propertyName]`
 *  sourceValue: any,
 *  // Branch nodes will have _undefined_, leaf nodes will contain the value
 *  leafValue: any
 * }>;
 * ```
 *
 * For example, iterating over a flat object:
 * ```js
 * const verySimpleObject = { field: `hello`, flag: true }
 * const kids = [ ...children(verySimpleObject) ];
 * // Yields:
 * // [ { name: "field", sourceValue: `hello`, leafValue: `hello` },
 * //  { name: "flag", sourceValue: true, leafValue: true } ]
 * ```
 *
 * For objects containing objects:
 * ```js
 * const lessSimpleObject = { field: `hello`, flag: true, colour: { `red`, opacity: 0.5 } }
 * const kids = [ ...children(verySimpleObject) ];
 * // Yields as before, plus:
 * //  { name: "colour", sourceValue: { name: 'red', opacity: 0.5 }, leafValue: undefined }
 * ```
 *
 * Note that 'sourceValue' always contains the property value, as if you
 * access it via `object[propName]`. 'leafValue' only contains the value if it's a leaf
 * node.
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
declare function children(node: object, options?: Partial<ChildrenOptions>): IterableIterator<TraverseObjectEntry>;
declare function depthFirst$1(node: object, options?: Partial<ChildrenOptions>, ancestors?: string[]): IterableIterator<TraverseObjectEntryWithAncestors>;
/**
 * Returns the closest matching entry, tracing `path` in an array, Map or simple object.
 * Returns an entry with _undefined_ value at the point where tracing stopped.
 * Use {@link traceByPath} to step through all the segments.
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
declare function getByPath(path: string, node: object, options?: TraverseObjectPathOpts): TraverseObjectEntryWithAncestors;
/**
 * Enumerates over children of `node` towards the node named in `path`.
 * This is useful if you want to get the interim steps to the target node.
 *
 * Use {@link getByPath} if you don't care about interim steps.
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
declare function traceByPath(path: string, node: object, options?: TraverseObjectPathOpts): Iterable<TraverseObjectEntryWithAncestors>;
/**
 * Returns a projection of `node` as a dynamic traversable.
 * This means that the tree structure is dynamically created as last-minute as possible.
 *
 * The type when calling `getValue()` is {@link TraverseObjectEntryStatic}:
 * ```typescript
 * type EntryStatic = Readonly<{
 *  name: string,
 *  value: any
 *  ancestors: string[]
 * }>
 * ```
 *
 * Note that the object identity of TraversableTree return results is not stable.
 * This is because they are created on-the-fly by reading fields of `node`.
 *
 * ```js
 * const c1 = [ ...asDynamicTraversable(someObject).children() ];
 * const c2 = [ ...asDynamicTraversable(someObject).children() ];
 *
 * // Object identity is not the same
 * c1[ 0 ] === c1[ 0 ]; // false
 *
 * // ...even though its referring to the same value
 * c1[ 0 ].getValue() === c1[ 0 ].getValue(); // true
 * ```
 *
 * Instead .getIdentity() to get a stable identity:
 * ```js
 * c1[ 0 ].getIdentity() === c2[ 0 ].getIdentity(); // true
 * ```
 *
 * @example
 * ```js
 * import { Trees } from "https://unpkg.com/@ixfx/collections/bundle"
 * const myObj = { name: `Pedro`, size: 45, colour: `orange` };
 * const root = Trees.FromObject.asDynamicTraversable(myObj);
 * for (const v of Trees.Traverse.breadthFirst(root)) {
 * // v.getValue() yields:
 * // { name: 'name', sourceValue: 'Pedro' ...},
 * // { name: 'size', sourceValue: 45 ... }
 * // ...
 * }
 * ```
 * @param node Object to read
 * @param options Options when creating traversable
 * @param ancestors Do not use
 * @param parent Do not use
 * @returns
 */
declare const asDynamicTraversable: (node: object, options?: Partial<ChildrenOptions>, ancestors?: string[], parent?: TraversableTree<TraverseObjectEntryStatic>) => TraversableTree<TraverseObjectEntryStatic>;
/**
 * Reads all fields and sub-fields of `node`, returning as a 'wrapped' tree structure.
 * @param node
 * @param options
 * @returns
 */
declare const createWrapped: (node: object, options: Partial<CreateOptions>) => WrappedNode<any>;
type CreateOptions = {
  name: string;
  /**
   * If _true_, only leaf nodes have values. This avoids repetition (important
   * when comparing trees), with semantics being in the tree itself.
   *
   * When _false_ (default) values get decomposed down the tree. This
   * makes it easy to get all the data for a branch of the tree.
   *
   *
   * Eg if storing { person: { address { state: `qld` } } }
   * When _true_, the tree would be:
   * ```
   * person, value: undefined
   *  + address, value: undefined
   *    + state, value: 'qld'
   * ```
   * But when _false_, the tree would be:
   * ```
   * person, value: { address: { state: `qld } }
   *  + address, value: { state: `qld` }
   *    + state, value: `qld`
   * ```
   */
  valuesAtLeaves: boolean;
};
/**
 * Reads all fields and sub-fields of `node`, returning as a basic tree structure.
 * The structure is a snapshot of the object. If the object changes afterwards, the tree will
 * remain the same.
 *
 * Alternatively, consider {@link asDynamicTraversable} which reads the object dynamically.
 * @example
 * ```js
 * import { Trees } from "https://unpkg.com/@ixfx/collections/bundle"
 * const myObj = { name: `Pedro`, size: 45, colour: `orange` };
 * const root = Trees.FromObject.create(myObj);
 * for (const v of Trees.Traverse.breadthFirst(root)) {
 * // v.getValue() yields:
 * // { name: 'name', sourceValue: 'Pedro' ...},
 * // { name: 'size', sourceValue: 45 ... }
 * // ...
 * }
 * ```
 * @param node
 * @param options
 * @returns
 */
declare const create$1: (node: object, options?: Partial<CreateOptions>) => TreeNode<TraverseObjectEntryStatic>;
/**
 * Returns a copy of `node` with its (and all its children's) parent information removed.
 * @param node
 * @param options
 * @returns
 */
declare const createSimplified: (node: object, options?: Partial<CreateOptions>) => SimplifiedNode<TraverseObjectEntryStatic>;
declare namespace traversable_tree_d_exports {
  export { breadthFirst, childrenLength, couldAddChild, depthFirst, find, findAnyChildByValue, findAnyParentByValue, findByValue, findChildByValue, findParentByValue, followValue, hasAnyChild, hasAnyChildValue, hasAnyParent, hasAnyParentValue, hasChild, hasChildValue, hasParent, hasParentValue, parents, siblings, toString, toStringDeep };
}
declare const childrenLength: <T>(tree: TraversableTree<T>) => number;
/**
 * Returns _true_ if `child` is parented at any level (grand-parented etc) by `possibleParent`
 * @param child Child being sought
 * @param possibleParent Possible parent of child
 * @param eq Equality comparison function {@link isEqualDefault} used by default
 * @returns
 */
declare const hasAnyParent: <T extends TraversableTree<TV> | TreeNode<TV>, TV>(child: T, possibleParent: T, eq?: IsEqual<T>) => boolean;
declare const hasAnyParentValue: <T extends TraversableTree<TV> | TreeNode<TV>, TV>(child: T, possibleParentValue: TV, eq?: IsEqual<TV>) => boolean;
declare const findAnyParentByValue: <TValue>(child: TraversableTree<TValue>, possibleParentValue: TValue, eq?: IsEqual<TValue>) => TraversableTree<TValue> | undefined;
/**
 * Returns _true_ if `child` exists within `possibleParent`. By default it only looks at the immediate
 * parent (maxDepth: 0). Use Number.MAX_SAFE_INTEGER for searching recursively upwards (or {@link hasAnyParent})
 * @param child Child being sought
 * @param possibleParent Possible parent of child
 * @param maxDepth Max depth of traversal. Default of 0 only looks for immediate parent.
 * @param eq Equality comparison function. {@link isEqualDefault} used by default.
 * @returns
 */
declare const hasParent: <T extends TraversableTree<TV> | TreeNode<TV>, TV>(child: T, possibleParent: T, eq?: IsEqual<T>, maxDepth?: number) => boolean;
/**
 * Checks if a child node has a parent with a certain value
 * Note: by default only checks immediate parent. Set maxDepth to a large value to recurse
 *
 * Uses `getValue()` on the parent if that function exists.
 * @param child Node to start looking from
 * @param possibleParentValue Value to seek
 * @param eq Equality checker
 * @param maxDepth Defaults to 0, so it only checks immediate parent
 * @returns
 */
declare const hasParentValue: <T extends TraversableTree<TV> | TreeNode<TV>, TV>(child: T, possibleParentValue: TV, eq?: IsEqual<TV>, maxDepth?: number) => boolean;
declare const findParentByValue: <T extends TraversableTree<TV> | TreeNode<TV>, TV>(child: T, possibleParentValue: TV, eq?: IsEqual<TV>, maxDepth?: number) => T | undefined;
/**
 * Returns _true_ if `prospectiveChild` can be legally added to `parent`.
 * _False_ is returned if:
 *  * `parent` and `prospectiveChild` are equal
 *  * `parent` already contains `prospectiveChild`
 *  * `prospectiveChild` has `parent` as its own child
 *
 * Throws an error if `parent` or `prospectiveChild` is null/undefined.
 * @param parent Parent to add to
 * @param prospectiveChild Prospective child
 * @param eq Equality function
 */
declare const couldAddChild: <T>(parent: TraversableTree<T>, prospectiveChild: TraversableTree<T>, eq?: IsEqual<TraversableTree<T>>) => void;
/**
 * Returns _true_ if _possibleChild_ is contained within _parent_ tree.
 * That is, it is any sub-child.
 * @param parent Parent tree
 * @param possibleChild Sought child
 * @param eq Equality function, or {@link isEqualDefault} if undefined.
 * @returns
 */
declare const hasAnyChild: <T extends TraversableTree<TV> | TreeNode<TV>, TV>(parent: T, possibleChild: T, eq?: IsEqual<T>) => boolean;
declare const hasAnyChildValue: <T>(parent: TraversableTree<T>, possibleChildValue: T, eq?: IsEqual<T>) => boolean;
/**
 * Returns _true_ if _possibleChild_ is contained within _maxDepth_ children
 * of _parent_ node. By default only looks at immediate children (maxDepth = 0).
 *
 * ```js
 * // Just check parentNode for childNode
 * Trees.hasChild(parentNode, childNode);
 * // See if parentNode or parentNode's parents have childNode
 * Trees.hasChild(parentNode, childNode, 1);
 * // Use custom equality function, in this case comparing on name field
 * Trees.hasChild(parentNode, childNode, 0, (a, b) => a.name === b.name);
 * ```
 * @param parent Parent tree
 * @param possibleChild Sought child
 * @param maxDepth Maximum depth. 0 for immediate children, Number.MAX_SAFE_INTEGER for boundless
 * @param eq Equality function, or {@link isEqualDefault} if undefined.
 * @returns
 */
declare const hasChild: <T extends TraversableTree<TV> | TreeNode<TV>, TV>(parent: T, possibleChild: T, eq?: IsEqual<T>, maxDepth?: number) => boolean;
declare const hasChildValue: <T>(parent: TraversableTree<T>, possibleValue: T, eq?: IsEqual<T>, maxDepth?: number) => boolean;
/**
 * Iterates over siblings of `node`.
 *
 * Other iteration options:
 * * {@link breadthFirst}: Children, breadth-first
 * * {@link depthFirst}: Children, depth-first
 * * {@link parents}: Chain of parents, starting with immediate parent
 * * {@link siblings}: Nodes with same parent
 * @param node Node to begin from
 * @returns
 */
declare function siblings<T>(node: TraversableTree<T>): IterableIterator<TraversableTree<T>>;
/**
 * Iterates over parents of `node`, starting with immediate parent
 *
 * Other iteration options:
 * * {@link breadthFirst}: Children, breadth-first
 * * {@link depthFirst}: Children, depth-first
 * * {@link parents}: Chain of parents, starting with immediate parent
 * * {@link siblings}: Nodes with same parent
 * @param node Node to begin from
 * @returns
 */
declare function parents<T extends TraversableTree<TV> | TreeNode<TV>, TV>(node: T): IterableIterator<T>;
/**
 * Descends `parent`, breadth-first, looking for a particular value.
 * Returns _undefined_ if not found.
 * @param parent
 * @param possibleValue
 * @param eq
 * @returns
 */
declare function findAnyChildByValue<T extends TraversableTree<TV> | TreeNode<TV>, TV>(parent: T, possibleValue: TV, eq?: IsEqual<TV>): T | undefined;
/**
 * Searches breadth-first for `possibleValue` under and including `parent`.
 * `maxDepth` sets he maximum level to which the tree is searched.
 * @param parent
 * @param possibleValue
 * @param eq
 * @param maxDepth
 * @returns
 */
declare function findChildByValue<T extends TraversableTree<TV> | TreeNode<TV>, TV>(parent: T, possibleValue: TV, eq?: IsEqual<TV>, maxDepth?: number): T | undefined;
/**
 * Iterates over children of `root`, depth-first.
 *
 * Other iteration options:
 * * {@link breadthFirst}: Children, breadth-first
 * * {@link depthFirst}: Children, depth-first
 * * {@link parents}: Chain of parents, starting with immediate parent
 * * {@link siblings}: Nodes with same parent
 * @param root Root node
 * @returns
 */
declare function depthFirst<T extends TraversableTree<TV> | TreeNode<TV>, TV>(root: T): Generator<T>;
/**
 * Iterates over the children of `root`, breadth-first
 *
 * Other iteration options:
 * * {@link breadthFirst}: Children, breadth-first
 * * {@link depthFirst}: Children, depth-first
 * * {@link parents}: Chain of parents, starting with immediate parent
 * * {@link siblings}: Nodes with same parent
 *
 * @example Traversing over a simple object
 * ```js
 * import { Trees } from "https://unpkg.com/@ixfx/collections/bundle"
 * const myObj = { name: `Pedro`, size: 45, colour: `orange` };
 * const root = Trees.FromObject.asDynamicTraversable(myObj);
 * for (const v of Trees.Traverse.breadthFirst(root)) {
 * // v.getValue() yields:
 * // { name: 'name', sourceValue: 'Pedro' ...},
 * // { name: 'size', sourceValue: 45 ... }
 * // ...
 * }
 * ```
 * @param root Root node
 * @param depth How many levels to traverse
 * @returns
 */
declare function breadthFirst<T extends TraversableTree<TV> | TreeNode<TV>, TV>(root: T, depth?: number): IterableIterator<T>;
/**
 * Applies `predicate` to `root` and all its child nodes, returning the node where
 * `predicate` yields _true_.
 * Use {@link findByValue} to find a node by its value
 * @param root
 * @param predicate
 * @param order Iterate children by breadth or depth. Default 'breadth'
 * @returns
 */
declare function find<T>(root: TraversableTree<T>, predicate: (node: TraversableTree<T>) => boolean, order?: `breadth` | `depth`): TraversableTree<T> | undefined;
/**
 * Applies `predicate` to `root` and all its child nodes, returning the node value for
 * `predicate` yields _true_.
 * Use {@link find} to filter by nodes rather than values
 *
 * ```js
 * const n = findByValue(root, (v) => v.name === 'Bob');
 * ```
 * @param root
 * @param predicate
 * @param order Iterate children by breadth or depth. Default 'breadth'
 * @returns
 */
declare function findByValue<T>(root: TraversableTree<T>, predicate: (nodeValue: T) => boolean, order?: `breadth` | `depth`): TraversableTree<T> | undefined;
/**
 * Search through children in a path-like manner.
 *
 * It finds the first child of `root` that matches `continuePredicate`.
 * The function gets passed a depth of 1 to begin with. It recurses, looking for the next sub-child, etc.
 *
 * If it can't find a child, it stops.
 *
 * This is different to 'find' functions, which exhaustively search all possible child nodes, regardless of position in tree.
 *
 * ```js
 * const path = 'a.aa.aaa'.split('.');
 * const pred = (nodeValue, depth) => {
 *  if (nodeValue === path[0]) {
 *    path.shift(); // Remove first element
 *    return true;
 *  }
 *  return false;
 * }
 *
 * // Assuming we have a tree of string values:
 * // a
 * //   - aa
 * //       - aaa
 * //   - ab
 * // b
 * //   - ba
 * for (const c of follow(tree, pred)) {
 *  // Returns nodes: a, aa and then aaa
 * }
 * ```
 * @param root
 * @param continuePredicate
 * @param depth
 */
declare function followValue<T>(root: TraversableTree<T>, continuePredicate: (nodeValue: T, depth: number) => boolean, depth?: number): IterableIterator<T>;
declare function toStringDeep<T>(node: TraversableTree<T>, depth?: number): string;
declare function toString(...nodes: TraversableTree<any>[]): string;
declare namespace index_d_exports$5 {
  export { DiffAnnotation, DiffNode, traverse_object_d_exports as FromObject, LabelledNode, LabelledSingleValue, LabelledValue, LabelledValues, tree_mutable_d_exports as Mutable, pathed_d_exports as Pathed, SimplifiedNode, TraversableTree, traversable_tree_d_exports as Traverse, TraverseObjectEntry, TraverseObjectEntryStatic, TraverseObjectEntryWithAncestors, TraverseObjectPathOpts, TreeNode, WrappedNode, compare$1 as compare, isTraversable, isTreeNode, toTraversable };
}
/**
 * Makes a 'traversable' to move around a {@link TreeNode}, an existing {@link TraversableTree} or a plain object.
 *
 * @param node
 * @returns
 */
declare const toTraversable: <T>(node: TreeNode<T> | TraversableTree<T> | object) => TraversableTree<any>;
/**
 * Checks whether `node` is of type {@link TreeNode}.
 *
 * Checks for: parent, childrenStore and value defined on `node`.
 * @param node
 * @returns
 */
declare const isTreeNode: (node: any) => node is TreeNode<any>;
/**
 * Checks if `node` is of type {@link TraversableTree}.
 *
 * Checks by looking for: children, getParent, getValue and getIdentity defined on `node`.
 * @param node
 * @returns
 */
declare const isTraversable: (node: any) => node is TraversableTree<any>;
//#endregion
//#region ../packages/collections/src/types.d.ts
/**
 * Key-value pairs in an array
 * @see {@link ObjectKeys}
 */
type ArrayKeys<K, V> = readonly (readonly [key: K, value: V])[];
/**
 * Key-value pairs in object form
 * @see {@link ArrayKeys}
 */
type ObjectKeys<K, V> = readonly {
  readonly key: K;
  readonly value: V;
}[];
declare function isObjectKeys<K, V>(kvs: EitherKey<K, V>): kvs is ObjectKeys<K, V>;
/**
 * Type that represents key-values in object or array form
 */
type EitherKey<K, V> = ArrayKeys<K, V> | ObjectKeys<K, V>;
/**
 * A table value or _undefined_
 */
type TableValue<V> = V | undefined;
/**
 * A row of table values
 */
type TableRow<V> = TableValue<V>[];
//#endregion
//#region ../packages/collections/src/set/set-mutable.d.ts
/**
 * Creates a {@link ISetMutable}.
 * @param keyString Function that produces a key based on a value. If unspecified, uses `JSON.stringify`
 * @returns
 */
declare const mutable$1: <V>(keyString?: ToString<V>) => ISetMutable<V>;
/**
 * Mutable string set
 */
declare class SetStringMutable<V> extends SimpleEventEmitter<ValueSetEventMap<V>> implements ISetMutable<V> {
  store: Map<string, V>;
  keyString: ToString<V>;
  /**
   * Constructor
   * @param keyString Function which returns a string version of added items. If unspecified `JSON.stringify`
   */
  constructor(keyString: ToString<V> | undefined);
  /**
   * Number of items stored in set
   */
  get size(): number;
  /**
   * Adds one or more items to set. `add` event is fired for each item
   * @param values items to add
   */
  add(...values: V[]): boolean;
  /**
   * Returns values from set as an iterable
   * @returns
   */
  values(): MapIterator<V>;
  /**
   * Clear items from set
   */
  clear(): void;
  /**
   * Delete value from set.
   * @param v Value to delete
  * @returns _True_ if item was found and removed
   */
  delete(v: V): boolean;
  /**
   * Returns _true_ if item exists in set
   * @param v
   * @returns
   */
  has(v: V): boolean;
  /**
   * Returns array copy of set
   * @returns Array copy of set
   */
  toArray(): V[];
}
//#endregion
//#region ../packages/collections/src/set/ISet.d.ts
interface ISet<V> {
  has(v: V): boolean;
  get size(): number;
  values(): IterableIterator<V>;
  /**
   * Returns an array of values
   */
  toArray(): readonly V[];
}
//#endregion
//#region ../packages/collections/src/set/ISetImmutable.d.ts
/**
 * A Set which stores unique items determined by their value, rather
 * than object reference (unlike the default JS Set). Create with {@link Sets.mutable}. Immutable.
 *
 * By default the `JSON.stringify()` representation is considered the 'key' for an object.
 * Pass in a function to `setMutable` to define your own way of creating keys for values. The principle should
 * be that objects that you consider identical should have the same string key value.
 *
 * The {@link Sets.ISetMutable} alternative also has events for monitoring changes.
 *
 * @example Overview of functions
 * ```js
 * const s = Sets.mutable();
 * s.add(item);    // Add one or more items. Items with same key are overriden.
 * s.has(item);    // Returns true if item value is present
 * s.clear();      // Remove everything
 * s.delete(item); // Delete item by value
 * s.toArray();    // Returns values as an array
 * s.values();     // Returns an iterator over values
 * s.size;         // Returns number of items in set
 * ```
 *
 * @example Example usage
 * ```js
 * // Data to add
 * const people = [
 *  {name: `Barry`, city: `London`}
 *  {name: `Sally`, city: `Bristol`}
 * ];
 *
 * // Create a set, defining how keys will be generated
 * let s = Sets.mutable(person => {
 *    // Key person objects by name and city.
 *    // ie. Generated keys will be: `Barry-London`, `Sally-Bristol`
 *    return `${person.name}-${person.city}`
 * });
 *
 * // Add list - since it's immutable, a changed copy is returned
 * s = s.add(...people);
 *
 * // Accessing: has/get
 * s.has({name:`Barry`, city:`Manchester`})); // False, key is different (Barry-Manchester)
 * s.has({name:`Barry`, city:`London`}));     // True, we have Barry-London as a key
 * s.has(people[1]);   // True, key of object is found (Sally-Bristol)
 *
 * // Deleting (returns changed copy)
 * s = s.delete({name:`Barry`, city:`London`});
 * ```
 *
 * @typeParam V - Type of data stored
 */
interface ISetImmutable<V> extends ISet<V> {
  add(...values: readonly V[]): ISetImmutable<V>;
  delete(v: V): ISetImmutable<V>;
}
//#endregion
//#region ../packages/collections/src/set/SetImmutable.d.ts
declare class SetStringImmutable<V> implements ISetImmutable<V> {
  private store;
  private keyString;
  constructor(keyString?: ToString<V>, map?: Map<string, V>);
  get size(): number;
  add(...values: readonly V[]): ISetImmutable<V>;
  delete(v: V): ISetImmutable<V>;
  has(v: V): boolean;
  toArray(): V[];
  values(): Generator<V, void, unknown>;
}
/**
 * Immutable set that uses a `keyString` function to determine uniqueness
 *
 * @param keyString Function that produces a key based on a value. If unspecified, uses `JSON.stringify`.
 * @returns
 */
declare const immutable$1: <V>(keyString?: ToString<V>) => ISetImmutable<V>;
//#endregion
//#region ../packages/collections/src/set/massive-set.d.ts
/**
 * MassiveSet supports semantics similar to Set, but without the
 * limitation on how much data is stored.
 *
 * It only supports strings, and stores data in a hierarchy.
 *
 * ```js
 * const set = new MassiveSet(); // maxDepth=1 default
 * set.add(`test`);
 * set.add(`bloorp`);
 * ```
 *
 * In the above example, it will create a subtree for the first letter
 * of each key, putting the value underneath it. So we'd get a sub
 * MassiveSet for every key starting with 't' and every one starting with 'b'.
 *
 * If `maxDepth` was 2, we'd get the same two top-level nodes, but then
 * another sub-node based on the _second_ character of the value.
 *
 * It's not a very smart data-structure since it does no self-balancing
 * or tuning.
 */
declare class MassiveSet {
  #private;
  children: Map<string, MassiveSet>;
  values: Array<string>;
  constructor(maxDepth?: number, depth?: number);
  /**
   * Returns the number of values stored in just this level of the set
   * @returns
   */
  sizeLocal(): number;
  /**
   * Returns the number of branches at this node
   * Use {@link sizeChildrenDeep} to count all branches recursively
   * @returns
   */
  sizeChildren(): number;
  sizeChildrenDeep(): number;
  /**
   * Returns the total number of values stored in the set
   */
  size(): number;
  add(value: string): void;
  remove(value: string): boolean;
  debugDump(): void;
  /**
   * Returns _true_ if `value` stored on this node
   * @param value
   * @returns
   */
  hasLocal(value: string): boolean;
  has(value: string): boolean;
}
declare namespace index_d_exports$3 {
  export { ISetImmutable, ISetMutable, MassiveSet, SetStringImmutable, SetStringMutable, ValueSetEventMap, immutable$1 as immutable, mutable$1 as mutable };
}
//#endregion
//#region ../packages/collections/src/map/expiring-map.d.ts
/**
 * Expiring map options
 */
type Opts = {
  /**
   * Capacity limit
   */
  readonly capacity?: number;
  /**
   * Policy for evicting items if capacity is reached
   */
  readonly evictPolicy?: `none` | `oldestGet` | `oldestSet`;
  /**
   * Automatic deletion policy.
   * none: no automatic deletion (default)
   * get/set: interval based on last get/set
   * either: if either interval has elapsed
   */
  readonly autoDeletePolicy?: `none` | `get` | `set` | `either`;
  /**
   * Automatic deletion interval
   */
  readonly autoDeleteElapsedMs?: number;
};
/**
 * Event from the ExpiringMap
 */
type ExpiringMapEvent<K, V> = {
  readonly key: K;
  readonly value: V;
};
type ExpiringMapEvents<K, V> = {
  /**
   * Fires when an item is removed due to eviction
   * or automatic expiry
   */
  readonly expired: ExpiringMapEvent<K, V>;
  /**
   * Fires when a item with a new key is added
   */
  readonly newKey: ExpiringMapEvent<K, V>;
  /**
   * Fires when an item is manually removed,
   * removed due to eviction or automatic expiry
   */
  readonly removed: ExpiringMapEvent<K, V>;
};
/**
 * Create a ExpiringMap instance
 * @param options Options when creating map
 * @returns
 */
declare const create: <K, V>(options?: Opts) => ExpiringMap<K, V>;
/***
 * A map that can have a capacity limit. The elapsed time for each get/set
 * operation is maintained allowing for items to be automatically removed.
 * `has()` does not affect the last access time.
 *
 * By default, it uses the `none` eviction policy, meaning that when full
 * an error will be thrown if attempting to add new keys.
 *
 * Eviction policies:
 * `oldestGet` removes the item that hasn't been accessed the longest,
 * `oldestSet` removes the item that hasn't been updated the longest.
 *
 * ```js
 * const map = new ExpiringMap();
 * map.set(`fruit`, `apple`);
 *
 * // Remove all entries that were set more than 100ms ago
 * map.deleteWithElapsed(100, `set`);
 * // Remove all entries that were last accessed more than 100ms ago
 * map.deleteWithElapsed(100, `get`);
 * // Returns the elapsed time since `fruit` was last accessed
 * map.elapsedGet(`fruit`);
 * // Returns the elapsed time since `fruit` was last set
 * map.elapsedSet(`fruit`);
 * ```
 *
 * Last set/get time for a key can be manually reset using {@link touch}.
 *
 *
 * Events:
 * * 'expired': when an item is automatically removed.
 * * 'removed': when an item is manually or automatically removed due to expiry. Note: does not fire when .clear() is called
 * * 'newKey': when a new key is added
 *
 * ```js
 * map.addEventListener(`expired`, evt => {
 *  const { key, value } = evt;
 * });
 * ```
 * The map can automatically remove items based on elapsed intervals.
 *
 * @example
 * Automatically delete items that haven't been accessed for one second
 * ```js
 * const map = new ExpiringMap({
 *  autoDeleteElapsed: 1000,
 *  autoDeletePolicy: `get`
 * });
 * ```
 *
 * @example
 * Automatically delete the oldest item if we reach a capacity limit
 * ```js
 * const map = new ExpiringMap({
 *  capacity: 5,
 *  evictPolicy: `oldestSet`
 * });
 * ```
 * @typeParam K - Type of keys
 * @typeParam V - Type of values
 */
declare class ExpiringMap<K, V> extends SimpleEventEmitter<ExpiringMapEvents<K, V>> {
  #private;
  private capacity;
  private store;
  private evictPolicy;
  private autoDeleteElapsedMs;
  private autoDeletePolicy;
  private autoDeleteTimer;
  private disposed;
  constructor(opts?: Opts);
  dispose(): void;
  /**
   * Returns the number of keys being stored.
   */
  get keyLength(): number;
  entries(): IterableIterator<[k: K, v: V]>;
  values(): IterableIterator<V>;
  keys(): IterableIterator<K>;
  /**
   * Returns the elapsed time since `key`
   * was set. Returns _undefined_ if `key`
   * does not exist
   */
  elapsedSet(key: K): number | undefined;
  /**
   * Returns the elapsed time since `key`
   * was accessed. Returns _undefined_ if `key`
   * does not exist
   */
  elapsedGet(key: K): number | undefined;
  /**
   * Returns true if `key` is stored.
   * Does not affect the key's last access time.
   * @param key
   * @returns
   */
  has(key: K): boolean;
  /**
   * Gets an item from the map by key, returning
   * undefined if not present
   * @param key Key
   * @returns Value, or undefined
   */
  get(key: K): V | undefined;
  /**
   * Deletes the value under `key`, if present.
   *
   * Returns _true_ if something was removed.
   * @param key
   * @returns
   */
  delete(key: K): boolean;
  /**
   * Clears the contents of the map.
   * Note: does not fire `removed` event
   */
  clear(): void;
  /**
   * Updates the lastSet/lastGet time for a value
   * under `key`. If key was not found, nothing happens.
   *
   * Returns _false_ if key was not found
   * @param key
   * @returns
   */
  touch(key: K): boolean;
  private findEvicteeKey;
  /**
   * Deletes all values where elapsed time has past
   * for get/set or either.
   * ```js
   * // Delete all keys (and associated values) not accessed for a minute
   * em.deleteWithElapsed({mins:1}, `get`);
   * // Delete things that were set 1s ago
   * em.deleteWithElapsed(1000, `set`);
   * ```
   *
   * @param interval Interval
   * @param property Basis for deletion 'get','set' or 'either'
   * @returns Items removed
   */
  deleteWithElapsed(interval: Interval, property: `get` | `set` | `either`): [k: K, v: V][];
  /**
   * Sets the `key` to be `value`.
   *
   * If the key already exists, it is updated.
   *
   * If the map is full, according to its capacity,
   * another value is selected for removal.
   * @param key
   * @param value
   * @returns
   */
  set(key: K, value: V): void;
}
//#endregion
//#region ../packages/collections/src/map/imap-of.d.ts
interface IMapOf<V> {
  /**
   * Iterates over all keys
   */
  keys(): IterableIterator<string>;
  /**
   * Iterates over all values stored under `key`
   * @param key
   */
  valuesFor(key: string): IterableIterator<V>;
  /**
   * Returns a copy of all values under key as an arry
   * @param key
   */
  /**
   * Iterates over all values, regardless of key.
   * Same value may re-appear if it's stored under different keys.
   */
  valuesFlat(): IterableIterator<V>;
  /**
   * Iterates over key-value pairs.
   * Unlike a normal map, the same key may appear several times.
   */
  entriesFlat(): IterableIterator<readonly [key: string, value: V]>;
  entries(): IterableIterator<[key: string, value: V[]]>;
  /**
   * Iteates over all keys and the count of values therein
   */
  keysAndCounts(): IterableIterator<readonly [string, number]>;
  /**
   * Returns _true_ if `value` is stored under `key`.
   *
   * @param key Key
   * @param value Value
   */
  hasKeyValue(key: string, value: V, eq?: IsEqual<V>): boolean;
  /**
   * Returns _true_ if `key` has any values
   * @param key
   */
  has(key: string): boolean;
  /**
   * Returns _true_ if the map is empty
   */
  get isEmpty(): boolean;
  /**
   * Returns the number of values stored under `key`, or _0_ if `key` is not present.
   * @param key Key
   */
  count(key: string): number;
  /**
   * Finds the first key where value is stored.
   * Note: value could be stored in multiple keys
   * @param value Value to seek
   * @returns Key, or undefined if value not found
   */
  firstKeyByValue(value: V, eq?: IsEqual<V>): string | undefined;
}
//#endregion
//#region ../packages/collections/src/map/imap-of-mutable.d.ts
interface IMapOfMutable<V> extends IMapOf<V> {
  /**
   * Adds several `values` under the same `key`. Duplicate values are permitted, depending on implementation.
   * ```js
   * addKeyedValues('colours', 'red', 'green', 'blue')
   * ```
   * @param key
   * @param values
   */
  addKeyedValues(key: string, ...values: readonly V[]): void;
  /**
   * Adds a value, automatically extracting a key via the
   * `groupBy` function assigned in the constructor options.
   * @param values Adds several values
   */
  addValue(...values: readonly V[]): void;
  /**
   * Clears the map
   */
  clear(): void;
  /**
   * Returns the number of keys
   */
  get lengthKeys(): number;
  /**
   * Deletes all values under `key` that match `value`.
   * @param key Key
   * @param value Value
   */
  deleteKeyValue(key: string, value: V): boolean;
  /**
   * Delete all occurrences of `value`, regardless of
   * key it is stored under.
   * Returns _true_ if something was deleted.
   * @param value
   */
  deleteByValue(value: V): boolean;
  /**
   * Deletes all values stored under `key`. Returns _true_ if key was found
   * @param key
   */
  delete(key: string): boolean;
}
//#endregion
//#region ../packages/collections/src/map/map-of-simple-base.d.ts
declare class MapOfSimpleBase<V> {
  protected map: Map<string, readonly V[]>;
  protected readonly groupBy: (value: V) => string;
  protected valueEq: IsEqual<V>;
  /**
   * Constructor
   * @param groupBy Creates keys for values when using `addValue`. By default uses JSON.stringify
   * @param valueEq Compare values. By default uses JS logic for equality
   */
  constructor(groupBy?: (value: V) => string, valueEq?: IsEqual<V>, initial?: Map<string, readonly V[]> | [string, readonly V[]][]);
  /**
   * Returns the underlying map storage. Do not manipulate.
   */
  get getRawMapUnsafe(): Map<string, readonly V[]>;
  /**
   * Returns _true_ if `key` exists
   * @param key
   * @returns
   */
  has(key: string): boolean;
  /**
   * Returns _true_ if `value` exists under `key`.
   * @param key Key
   * @param value Value to seek under `key`
   * @returns _True_ if `value` exists under `key`.
   */
  hasKeyValue(key: string, value: V): boolean;
  /**
   * Debug dump of contents
   * @returns
   */
  debugString(): string;
  /**
   * Return number of values stored under `key`.
   * Returns 0 if `key` is not found.
   * @param key
   * @returns
   */
  count(key: string): number;
  /**
  * Returns first key that contains `value`
  * @param value
  * @param eq
  * @returns
  */
  firstKeyByValue(value: V, eq?: IsEqual<V>): string | undefined;
  /**
   * Iterate over all entries
   */
  entriesFlat(): IterableIterator<[key: string, value: V]>;
  /**
   * Iterate over keys and array of values for that key
   */
  entries(): IterableIterator<[key: string, value: V[]]>;
  /**
   * Get all values under `key`
   * @param key
   * @returns
   */
  valuesFor(key: string): IterableIterator<V>;
  /**
   * Iterate over all keys
   */
  keys(): IterableIterator<string>;
  /**
   * Iterate over all values (regardless of key).
   * Use {@link values} to iterate over a set of values per key
   */
  valuesFlat(): IterableIterator<V>;
  /**
   * Returns all values under 'key', or
   * an empty array if key is not found.
   *
   * Array is a copy of stored array.
   * @param key
   * @returns
   */
  /**
   * Returns the underlying array that stores values for `key`.
   *
   * Returns _undefined_ if key does not exist.
   *
   * Be careful about modifying array.
   * @param key
   * @returns
   */
  getRawArray(key: string): readonly V[] | undefined;
  /**
   * Yields the values for each key in sequence, returning an array.
   * Use {@link valuesFlat} to iterate over all keys regardless of key.
   */
  values(): IterableIterator<readonly V[]>;
  /**
   * Iterate over keys and length of values stored under keys
   */
  keysAndCounts(): IterableIterator<[string, number]>;
  /**
   * Returns the count of keys.
   */
  get lengthKeys(): number;
  /**
  * _True_ if empty
  */
  get isEmpty(): boolean;
}
//#endregion
//#region ../packages/collections/src/map/map-of-simple-mutable.d.ts
/**
 * A simple mutable map of arrays, without events. It can store multiple values
 * under the same key.
 *
 * For a fancier approaches, consider ofArrayMutable, ofCircularMutable or ofSetMutable.
 *
 * @example
 * ```js
 * const m = mapOfSimpleMutable();
 * m.add(`hello`, 1, 2, 3); // Adds numbers under key `hello`
 * m.delete(`hello`);       // Deletes everything under `hello`
 *
 * const hellos = m.get(`hello`); // Get list of items under `hello`
 * ```
 *
 * Constructor takes a `groupBy` parameter, which yields a string key for a value. This is the
 * basis by which values are keyed when using `addValues`.
 *
 * Constructor takes a `valueEq` parameter, which compares values. This is used when checking
 * if a value exists under a key, for example.
 * @typeParam V - Type of items
 */
declare class MapOfSimpleMutable<V> extends MapOfSimpleBase<V> implements IMapOfMutable<V> {
  addKeyedValues(key: string, ...values: readonly V[]): void;
  /**
   * Set `values` to `key`.
   * Previous data stored under `key` is thrown away.
   * @param key
   * @param values
   */
  setValues(key: string, values: readonly V[]): void;
  /**
   * Adds a value, automatically extracting a key via the
   * `groupBy` function assigned in the constructor options.
   * @param values Adds several values
   */
  addValue(...values: readonly V[]): void;
  /**
   * Delete `value` under a particular `key`
   * @param key
   * @param value
   * @returns _True_ if `value` was found under `key`
   */
  deleteKeyValue(key: string, value: V): boolean;
  /**
   * Deletes `value` regardless of key.
   *
   * Uses the constructor-defined equality function.
   * @param value Value to delete
   * @returns
   */
  deleteByValue(value: V): boolean;
  /**
   * Deletes all values under `key`,
   * @param key
   * @returns _True_ if `key` was found and values stored
   */
  delete(key: string): boolean;
  /**
   * Clear contents
   */
  clear(): void;
}
/**
 * A simple mutable map of arrays, without events. It can store multiple values
 * under the same key.
 *
 * For a fancier approaches, consider {@link ofArrayMutable}, {@link ofCircularMutable} or {@link ofSetMutable}.
 *
 * @example
 * ```js
 * const m = mapOfSimpleMutable();
 * m.add(`hello`, 1, 2, 3); // Adds numbers under key `hello`
 * m.delete(`hello`);       // Deletes everything under `hello`
 *
 * const hellos = m.get(`hello`); // Get list of items under `hello`
 * ```
 *
 * @typeParam V - Type of items
 * @returns New instance
 */
declare const ofSimpleMutable: <V>(groupBy?: (value: V) => string, valueEq?: IsEqual<V>) => IMapOfMutable<V>;
//#endregion
//#region ../packages/collections/src/map/imap-base.d.ts
interface IMapBase<K, V> {
  /**
   * Gets an item by key
   * @example
   * ```js
   * const item = map.get(`hello`);
   * ```
   * @param key
   */
  get(key: K): V | undefined;
  /**
  * Returns _true_ if map contains key
  * @example
  * ```js
  * if (map.has(`hello`)) ...
  * ```
  * @param key
  */
  has(key: K): boolean;
  /**
  * Returns _true_ if map is empty
  */
  isEmpty(): boolean;
  /**
   * Iterates over entries (consisting of [key,value])
   * @example
   * ```js
   * for (const [key, value] of map.entries()) {
   *  // Use key, value...
   * }
   * ```
   */
  entries(): IterableIterator<readonly [K, V]>;
  values(): IterableIterator<V>;
}
//#endregion
//#region ../packages/collections/src/map/map.d.ts
/**
 * An immutable map. Rather than changing the map, functions like `add` and `delete`
 * return a new map reference which must be captured.
 *
 * Immutable data is useful because as it gets passed around your code, it never
 * changes from underneath you. You have what you have.
 *
 * @example
 * ```js
 * let m = map(); // Create
 * let m2 = m.set(`hello`, `samantha`);
 * // m is still empty, only m2 contains a value.
 * ```
 *
 * @typeParam K - Type of map keys. Typically `string`
 * @typeParam V - Type of stored values
 */
interface IMapImmutable<K, V> extends IMapBase<K, V> {
  /**
   * Adds one or more items, returning the changed map.
   *
   * Can add items in the form of `[key,value]` or `{key, value}`.
   * @example These all produce the same result
   * ```js
   * map.set(`hello`, `samantha`);
   * map.add([`hello`, `samantha`]);
   * map.add({key: `hello`, value: `samantha`})
   * ```
   * @param itemsToAdd
   */
  add(...itemsToAdd: EitherKey<K, V>): IMapImmutable<K, V>;
  /**
   * Deletes an item by key, returning the changed map
   * @param key
   */
  delete(key: K): IMapImmutable<K, V>;
  /**
   * Returns an empty map
   */
  clear(): IMapImmutable<K, V>;
  /**
   * Sets `key` to be `value`, overwriting anything existing.
   * Returns a new map with added key.
   * @param key
   * @param value
   */
  set(key: K, value: V): IMapImmutable<K, V>;
}
/**
 * Returns an {@link IMapImmutable}.
 * Use {@link Maps.mutable} as a mutable alternatve.
 *
 * @example Basic usage
 * ```js
 * // Creating
 * let m = map();
 * // Add
 * m = m.set("name", "sally");
 * // Recall
 * m.get("name");
 * ```
 *
 * @example Enumerating
 * ```js
 * for (const [key, value] of map.entries()) {
 *  console.log(`${key} = ${value}`);
 * }
 * ```
 *
 * @example Overview
 * ```js
 * // Create
 * let m = map();
 * // Add as array or key & value pair
 * m = m.add(["name" , "sally"]);
 * m = m.add({ key: "name", value: "sally" });
 * // Add using the more typical set
 * m = m.set("name", "sally");
 * m.get("name");   // "sally";
 * m.has("age");    // false
 * m.has("name");   // true
 * m.isEmpty;       // false
 * m = m.delete("name");
 * m.entries();     // Iterator of key value pairs
 * ```
 *
 * Since it is immutable, `add()`, `delete()` and `clear()` return a new version with change.
 *
 * @param dataOrMap Optional initial data in the form of an array of `{ key: value }` or `[ key, value ]`
 */
declare const immutable: <K, V>(dataOrMap?: ReadonlyMap<K, V> | EitherKey<K, V>) => IMapImmutable<K, V>;
//#endregion
//#region ../packages/collections/src/map/map-mutable.d.ts
/**
 * A mutable map.
 *
 * It is a wrapper around the in-built Map type, but adds roughly the same API as {@link IMapImmutable}.
 *
 * @typeParam K - Type of map keys. Typically `string`
 * @typeParam V - Type of stored values
 */
interface IMapMutable<K, V> extends IMapBase<K, V> {
  /**
   * Adds one or more items to map
   *
   * Can add items in the form of [key,value] or `{key, value}`.
   * @example These all produce the same result
   * ```js
   * map.set(`hello`, `samantha`);
   * map.add([`hello`, `samantha`]);
   * map.add({key: `hello`, value: `samantha`})
   * ```
   * @param itemsToAdd
   * @param itemsToAdd
   */
  add(...itemsToAdd: EitherKey<K, V>): void;
  /**
   * Sets a value to a specified key
   * @param key
   * @param value
   */
  set(key: K, value: V): void;
  /**
   * Deletes an item by key
   * @param key
   */
  delete(key: K): void;
  /**
   * Clears map
   */
  clear(): void;
}
/**
 * Returns a {@link IMapMutable} (which just wraps the in-built Map)
 * Use {@link Maps.immutable} for the immutable alternative.
 *
 * @example Basic usage
 * ```js
 * const m = mapMutable();
 * // Add one or more entries
 * m.add(["name", "sally"]);
 * // Alternatively:
 * m.set("name", "sally");
 * // Recall
 * m.get("name");           // "sally"
 * m.delete("name");
 * m.isEmpty; // True
 * m.clear();
 * ```
 * @param data Optional initial data in the form of an array of `{ key: value }` or `[ key, value ]`
 */
declare const mutable: <K, V>(...data: EitherKey<K, V>) => IMapMutable<K, V>;
//#endregion
//#region ../packages/collections/src/map/imap-of-mutable-extended.d.ts
/**
 * Events from mapArray
 */
type MapArrayEvents<V> = {
  readonly addedValues: {
    readonly values: readonly V[];
  };
  readonly addedKey: {
    readonly key: string;
  };
  readonly clear: boolean;
  readonly deleteKey: {
    readonly key: string;
  };
};
/**
 * Like a `Map` but multiple values can be stored for each key.
 * Duplicate values can be added to the same or even a several keys.
 *
 * Three pre-defined MapOf's are available:
 * * {@link ofArrayMutable} - Map of arrays
 * * {@link ofSetMutable} - Map of unique items
 * * {@link ofCircularMutable} - Hold a limited set of values per key
 *
 * Adding
 * ```js
 * // Add one or more values using the predefined key function to generate a key
 * map.addValue(value1, value2, ...);
 * // Add one or more values under a specified key
 * map.addKeyedValues(key, value1, value2, ...);
 * ```
 *
 * Finding/accessing
 * ```js
 * // Returns all values stored under key
 * map.get(key);
 * // Returns the first key where value is found, or _undefined_ if not found
 * map.findKeyForValue(value);
 * // Returns _true_  if value is stored under key
 * map.hasKeyValue(key, value);
 * // Returns _true_ if map contains key
 * map.has(key);
 * ```
 *
 * Removing
 * ```js
 * // Removes everything
 * map.clear();
 * // Delete values under key. Returns _true_ if key was found.
 * map.delete(key);
 * // Deletes specified value under key. Returns _true_ if found.
 * map.deleteKeyValue(key, value);
 * ```
 *
 * Metadata about the map:
 * ```js
 * map.isEmpty;         // True/false
 * map.lengthMax;       // Largest count of items under any key
 * map.count(key);      // Count of items stored under key, or 0 if key is not present.
 * map.keys();          // Returns a string array of keys
 * map.keysAndCounts(); // Returns an array of [string,number] for all keys and number of values for each key
 * map.debugString();   // Returns a human-readable string dump of the contents
 * ```
 *
 * Events can be listened to via `addEventListener`
 * * `addedKey`, `addedValue` - when a new key is added, or when a new value is added
 * * `clear` - when contents are cleared
 * * `deleteKey` - when a key is deleted
 *
 * @example Event example
 * ```js
 * map.addEventLister(`addedKey`, ev => {
 *  // New key evt.key seen.
 * });
 * ```
 *
 * @typeParam V - Values stored under keys
 * @typeParam M - Type of data structure managing values
 */
interface IMapOfMutableExtended<V, M> extends SimpleEventEmitter<MapArrayEvents<V>>, IMapOfMutable<V> {
  /**
   * Returns the object managing values under the specified `key`
   * @private
   * @param key
   */
  getSource(key: string): M | undefined;
  /**
   * Returns the type name. For in-built implementations, it will be one of: array, set or circular
   */
  get typeName(): string;
  /**
   * Returns a human-readable rendering of contents
   */
  debugString(): string;
}
//#endregion
//#region ../packages/collections/src/map/map-of-array-mutable.d.ts
/**
 * Map of array options
 */
type MapArrayOpts<V> = MapMultiOpts<V> & {
  /**
   * Comparer to use
   */
  readonly comparer?: IsEqual<V>;
  /**
   * Key function
   */
  readonly convertToString?: ToString<V>;
};
/**
 * Returns a {@link IMapOfMutableExtended} to allow storing multiple values under a key, unlike a regular Map.
 * @example
 * ```js
 * const map = ofArrayMutable();
 * map.addKeyedValues(`hello`, [1,2,3,4]); // Adds series of numbers under key `hello`
 *
 * const hello = map.get(`hello`); // Get back values
 * ```
 *
 * Takes options:
 * * `comparer`: {@link IsEqual}
 * * `toString`: Util.ToString
 *
 * A custom Util.ToString function can be provided as the `convertToString` opion. This is then used when checking value equality (`has`, `without`)
 * ```js
 * const map = ofArrayMutable({ convertToString:(v) => v.name}); // Compare values based on their `name` field;
 * ```
 *
 * Alternatively, a {@link IsEqual} function can be used:
 * ```js
 * const map = ofArrayMutable({comparer: (a, b) => a.name === b.name });
 * ```
 * @param options Optiosn for mutable array
 * @typeParam V - Data type of items
 * @returns {@link IMapOfMutableExtended}
 */
declare const ofArrayMutable: <V>(options?: MapArrayOpts<V>) => IMapOfMutableExtended<V, readonly V[]>;
//#endregion
//#region ../packages/collections/src/map/imap-of-immutable.d.ts
/**
 * Like a `Map` but multiple values can be stored for each key. Immutable.
 * Duplicate values can be added to the same or even a several keys.
 *
 * Adding
 * ```js
 * // Add one or more values using the predefined key function to generate a key
 * map = map.addValue(value1, value2, ...);
 * // Add one or more values under a specified key
 * map = map.addKeyedValues(key, value1, value2, ...);
 * ```
 *
 * Finding/accessing
 * ```js
 * // Returns all values stored under key
 * map.get(key);
 * // Returns the first key where value is found, or _undefined_ if not found
 * map.findKeyForValue(value);
 * // Returns _true_  if value is stored under key
 * map.hasKeyValue(key, value);
 * // Returns _true_ if map contains key
 * map.has(key);
 * ```
 *
 * Removing
 * ```js
 * // Removes everything
 * map = map.clear();
 * // Delete values under key. Returns _true_ if key was found.
 * map = map.delete(key);
 * // Deletes specified value under key. Returns _true_ if found.
 * map = map.deleteKeyValue(key, value);
 * ```
 *
 * Metadata about the map:
 * ```js
 * map.isEmpty;         // True/false
 * map.lengthMax;       // Largest count of items under any key
 * map.count(key);      // Count of items stored under key, or 0 if key is not present.
 * map.keys();          // Returns a string array of keys
 * map.keysAndCounts(); // Returns an array of [string,number] for all keys and number of values for each key
 * map.debugString();   // Returns a human-readable string dump of the contents
 * ```
 *
 * @typeParam V - Values stored under keys
 * @typeParam M - Type of data structure managing values
 */
interface IMapOfImmutable<V> extends IMapOf<V> {
  /**
   * Adds several `values` under the same `key`. Duplicate values are permitted, depending on implementation.
   * @param key
   * @param values
   */
  addKeyedValues(key: string, ...values: ReadonlyArray<V>): IMapOfImmutable<V>;
  /**
   * Adds a value, automatically extracting a key via the
   * `groupBy` function assigned in the constructor options.
   * @param values Adds several values
   */
  addValue(...values: ReadonlyArray<V>): IMapOfImmutable<V>;
  /**
   * Clears the map
   */
  clear(): IMapOfImmutable<V>;
  /**
   * Deletes all values under `key` that match `value`.
   * @param key Key
   * @param value Value
   */
  deleteKeyValue(key: string, value: V): IMapOfImmutable<V>;
  /**
   * Delete all occurrences of `value`, regardless of
   * key it is stored under.
   * @param value
   */
  deleteByValue(value: V): IMapOfImmutable<V>;
  /**
   * Deletes all values stored under `key`.
   * @param key
   */
  delete(key: string): IMapOfImmutable<V>;
}
//#endregion
//#region ../packages/collections/src/map/map-of-simple.d.ts
/**
 * Simple immutable MapOf
 */
declare class MapOfSimple<V> extends MapOfSimpleBase<V> implements IMapOf<V>, IMapOfImmutable<V> {
  addKeyedValues(key: string, ...values: V[]): MapOfSimple<V>;
  addValue(...values: readonly V[]): MapOfSimple<V>;
  addBatch(batch: [key: string, value: V[]][]): MapOfSimple<V>;
  clear(): MapOfSimple<V>;
  deleteKeyValue(_key: string, _value: V, eq?: IsEqual<V>): MapOfSimple<V>;
  deleteByValue(value: V, eq?: IsEqual<V>): MapOfSimple<V>;
  delete(key: string): MapOfSimple<V>;
}
/**
 * A simple immutable map of arrays, without events. It can store multiple values
 * under the same key.
 *
 * For a fancier approaches, consider {@link ofArrayMutable}, {@link ofCircularMutable} or {@link ofSetMutable}.
 *
 * @example
 * ```js
 * let m = mapSimple();
 * m = m.add(`hello`, 1, 2, 3); // Adds numbers under key `hello`
 * m = m.delete(`hello`);       // Deletes everything under `hello`
 *
 * const hellos = m.get(`hello`); // Get list of items under `hello`
 * ```
 *
 * @typeParam V - Type of items
 * @returns New instance
 */
declare const ofSimple: <V>(groupBy?: ToString<V>, valueEq?: IsEqual<V>) => IMapOfImmutable<V>;
//#endregion
//#region ../packages/collections/src/map/map-of-multi-impl.d.ts
/**
 * @internal
 */
declare class MapOfMutableImpl<V, M> extends SimpleEventEmitter<MapArrayEvents<V>> implements IMapOfMutableExtended<V, M> {
  #private;
  readonly groupBy: ToString<V>;
  readonly type: MultiValue<V, M>;
  constructor(type: MultiValue<V, M>, opts?: MapMultiOpts<V>);
  /**
   * Returns the type name. For in-built implementations, it will be one of: array, set or circular
   */
  get typeName(): string;
  /**
   * Returns the number of keys
   */
  get lengthKeys(): number;
  /**
   * Returns the length of the longest child list
   */
  get lengthMax(): number;
  debugString(): string;
  get isEmpty(): boolean;
  clear(): void;
  addKeyedValues(key: string, ...values: V[]): void;
  set(key: string, values: V[]): this;
  addValue(...values: readonly V[]): void;
  hasKeyValue(key: string, value: V, eq: IsEqual<V>): boolean;
  has(key: string): boolean;
  deleteKeyValue(key: string, value: V): boolean;
  private deleteKeyValueFromMap;
  deleteByValue(value: V): boolean;
  delete(key: string): boolean;
  firstKeyByValue(value: V, eq?: IsEqual<V>): string | undefined;
  count(key: string): number;
  /**
   * Iterates over values stored under `key`
   * If `key` is not found, no error is thrown - the iterator returns no values
   *
   * Alternatively use {@link valuesFor}
   */
  /**
   * Iterate over the values stored under `key`.
   * If key does not exist, iteration is essentially a no-op.
   *
   * Alternatively, use {@link valuesForAsArray} to get values as an array.
   * @param key
   * @returns
   */
  valuesFor(key: string): Generator<V, void>;
  getSource(key: string): M | undefined;
  keys(): IterableIterator<string>;
  entriesFlat(): IterableIterator<[key: string, value: V]>;
  valuesFlat(): IterableIterator<V>;
  entries(): IterableIterator<[key: string, value: V[]]>;
  keysAndCounts(): IterableIterator<[string, number]>;
  merge(other: IMapOf<V>): void;
  get size(): number;
  get [Symbol.toStringTag](): string;
}
//#endregion
//#region ../packages/collections/src/map/map-multi-fns.d.ts
/**
 * Finds first entry by iterable value. Expects a map with an iterable as values.
 *
 * ```js
 * const map = new Map();
 * map.set('hello', ['a', 'b', 'c']);
 * map.set('there', ['d', 'e', 'f']);
 *
 * const entry = firstEntry(map, (value, key) => {
 *  return (value === 'e');
 * });
 * // Entry is: ['there', ['d', 'e', 'f']]
 * ```
 *
 * An alternative is {@link firstEntryByValue} to search by value.
 * @param map Map to search
 * @param predicate Filter function returns true when there is a match of value
 * @returns Entry, or _undefined_ if `filter` function never returns _true_
 */
declare const firstEntry: <K, V>(map: IWithEntries<K, Iterable<V>>, predicate: (value: V, key: K) => boolean) => readonly [key: K, value: Iterable<V>] | undefined;
/**
 * Returns the entry with the largest count of elements,
 * or _undefined_ if `map` is empty.
 */
declare const longestEntry: <K, V extends {
  length: number;
}>(map: IWithEntries<K, V>) => readonly [K, V] | undefined;
/**
 * Finds first entry by iterable value. Expects a map with an iterable as values.
 *
 * ```js
 * const map = new Map();
 * map.set('hello', ['a', 'b', 'c']);
 * map.set('there', ['d', 'e', 'f']);
 *
 * const entry = firstEntryByValue(map, 'e');
 * // Entry is: ['there', ['d', 'e', 'f']]
 * ```
 *
 * An alternative is {@link firstEntry} to search by predicate function.
 * @param map Map to search
 * @param soughtValue Value to seek
 * @param isEqual Filter function which checks equality. Uses JS comparer by default.
 * @returns Entry, or _undefined_ if `value` not found.
 * @throws If 'map' doesn't seem like a map
 */
declare const firstEntryByValue: <K, V>(map: IWithEntries<K, Iterable<V>>, soughtValue: V, isEqual?: IsEqual<V>) => readonly [key: K, value: Iterable<V>] | undefined;
/**
 * Returns a copy of `map`, with the internal arrays being a different object.
 * Values contained inside are not copied.
 * @param map
 * @returns
 */
declare const cloneShallow: <K, V>(map: IWithEntries<K, Iterable<V>>) => Map<K, V[]>;
/**
 * Returns true if both sets of data have the same keys, and iterables at each key contain the same values, regardless of order.
 * By default uses === comparison semantics.
 * @param a
 * @param b
 * @param comparerOrKey
 * @returns
 */
declare const equals: <K, V>(a: IWithEntries<K, Iterable<V>>, b: IWithEntries<K, Iterable<V>>, comparerOrKey?: IsEqual<V> | ((v: V) => string)) => boolean;
//#endregion
//#region ../packages/collections/src/map/map-multi.d.ts
/**
 * @private
 */
type MultiValue<V, M> = {
  get name(): string;
  has(source: M, value: V, eq: IsEqual<V>): boolean;
  addKeyedValues(destination: M | undefined, values: Iterable<V>): M;
  toArrayCopy(source: M): V[];
  iterable(source: M): IterableIterator<V>;
  find(source: M, predicate: (v: V) => boolean): V | undefined;
  filter(source: M, predicate: (v: V) => boolean): Iterable<V>;
  without(source: M, value: V): readonly V[];
  count(source: M): number;
};
type MapMultiOpts<V> = {
  /**
   * Returns a group for values added via `addValue`. Eg. maybe you want to
   * group values in the shape `{name: 'Samantha' city: 'Copenhagen'}` by city:
   *
   * ```
   * const opts = {
   *  groupBy: (v) => v.city
   * }
   * ```
   *
   * @type {(ToString<V>|undefined)}
   */
  readonly groupBy?: ((value: V) => string) | undefined;
};
type MapSetOpts<V> = MapMultiOpts<V> & {
  readonly hash: (value: V) => string;
};
//#endregion
//#region ../packages/collections/src/map/map-of-set-mutable.d.ts
/**
 * Returns a {@link IMapOfMutableExtended} that uses a set to hold values.
 * This means that only unique values are stored under each key. By default it
 * uses the JSON representation to compare items.
 *
 * Options: `{ hash: toStringFn } }`
 *
 * `hash` is Util.ToString function: `(object) => string`. By default it uses
 * `JSON.stringify`.
 *
 * @example Only storing the newest three items per key
 * ```js
 * const map = ofSetMutable();
 * map.addKeyedValues(`hello`, [1, 2, 3, 1, 2, 3]);
 * const hello = map.get(`hello`); // [1, 2, 3]
 * ```
 *
 * @example
 * ```js
 * const hash = (v) => v.name; // Use name as the key
 * const map = ofSetMutable({hash});
 * map.addValue({age:40, name: `Mary`});
 * map.addValue({age:29, name: `Mary`}); // Value ignored as same name exists
 * ```
 * @param options
 * @returns
 */
declare const ofSetMutable: <V>(options?: MapSetOpts<V>) => IMapOfMutableExtended<V, ReadonlyMap<string, V>>;
//#endregion
//#region ../packages/collections/src/map/map-of-circular-mutable.d.ts
type MapCircularOpts<V> = MapMultiOpts<V> & {
  readonly capacity: number;
};
/**
 * Returns a {@link IMapOfMutableExtended} that uses a {@link ICircularArray} to hold values. Mutable.
 * This means that the number of values stored under each key will be limited to the defined
 * capacity.
 *
 * Required option:
 * * `capacity`: how many items to hold
 *
 * @example Only store the most recent three items per key
 * ```js
 * const map = ofCircularMutable({capacity: 3});
 * map.add(`hello`, 1, 2, 3, 4, 5);
 * const hello = [...map.get(`hello`)]; // [3, 4, 5]
 * ```
 * @param options
 * @returns
 */
declare const ofCircularMutable: <V>(options: MapCircularOpts<V>) => IMapOfMutableExtended<V, ICircularArray<V>>;
//#endregion
//#region ../packages/collections/src/map/number-map.d.ts
/**
 * Simple map for numbers.
 *
 * Keys not present in map return the `defaultValue` given in the constructor
 * ```js
 * // All keys default to zero.
 * const map = new Maps.NumberMap();
 * map.get(`hello`); // 0
 * ```
 *
 * To check if a key is present, use `has`:
 * ```js
 * map.has(`hello`); // false
 * ```
 *
 * Math:
 * ```js
 * // Adds 1 by default to value of `hello`
 * map.add(`hello`);         // 1
 * map.multiply(`hello`, 2); // 2
 *
 * // Reset key to default value
 * map.reset(`hello`); // 0
 * ```
 *
 * Different default value:
 * ```js
 * const map = new Maps.NumberMap(10);
 * map.get(`hello`); // 10
 * ```
 *
 * Regular `set` works, overriding the value to whatever is given:
 * ```js
 * map.set(`hello`, 5);
 * map.add(`hello`, 2); // 7
 * ```
 */
declare class NumberMap<K> extends Map<K, number> {
  readonly defaultValue: number;
  /**
   * Creates a NumberMap with default value of 0
   */
  constructor(defaultValue?: number);
  /**
   * Gets the value at a key. If not found, returns the default value
   * @param key
   * @returns
   */
  get(key: K): number;
  /**
   * Resets the key's value to the default value
   * @param key
   * @returns
   */
  reset(key: K): number;
  /**
   * Multiplies the value of `key` by `amount`. If key is not found, it is treated as the default value.
   * The new value is set and returned.
   * @param key
   * @param amount
   * @returns
   */
  multiply(key: K, amount: number): number;
  /**
  * Divides the value of `key` by `amount`. If key is not found, it is treated as the default value.
  * The new value is set and returned.
  * @param key
  * @param amount
  * @returns
  */
  divide(key: K, amount: number): number;
  /**
   * Applies a function to all values
   * ```js
   * // Round all the values
   * map.mapValue((value,key)=> Math.round(value));
   * ```
   */
  mapValue(fn: (value: number, key?: K) => number): void;
  /**
   * Returns the largest value in the map. If the map is empty, returns `NaN`.
  * ```js
   * // Eg find all the keys corresponding to the maximum value
   * const largestKeys = [...map.keysByValue(map.findValueMax())];
   * ```
   * @returns
   */
  findValueMax(): number;
  /**
   * Returns the smallest value in the map. If the map is empty, returns `NaN`.
   *
   * ```js
   * // Eg find all the keys corresponding to the minimum value
   * const smallestKeys = [...map.keysByValue(map.findValueMin())];
   * ```
   * @returns
   */
  findValueMin(): number;
  /**
   * Iterates over all keys that have a corresponding value
   * @param v
   */
  keysByValue(v: number): Generator<K, void, unknown>;
  /**
   * Iterates over entries, sorted by value. By default ascending order.
   */
  entriesSorted(sorter?: (a: [K, number], b: [K, number]) => number): Generator<[key: K, value: number]>;
  /**
   * Iterates over all keys that have a value matching `fn`.
   * ```js
   * // Iterate over all keys that store a value greater than 1
   * const greaterThanOne = (v) => v > 1;
   * for (const key of map.filterKeysByValue(greaterThanOne)) {
   * }
   * ```
   * @param v
   */
  filterKeysByValue(fn: (value: number) => boolean): Generator<K, void, unknown>;
  /**
   * Deletes a set of keys
   */
  deleteKeys(keys: Iterable<K>): number;
  /**
   * Adds an amount to `key`'s value. If `key` is not found, it is treated as the default value. The new value is set and returned.
   * @param key
   * @param amount
   * @returns
   */
  add(key: K, amount?: number): number;
  /**
   * Subtracts an amount from `key`'s value. If `key` is not found, it is treated as the default value. The new value is set and returned.
   * @param key
   * @param amount
   * @returns
   */
  subtract(key: K, amount?: number): number;
}
//#endregion
//#region ../packages/collections/src/map/map-mutable-events.d.ts
type MapWithEventsEvents<TKey, TValue> = {
  'removed': {
    key: TKey;
    value: TValue;
  };
  'added': {
    key: TKey;
    value: TValue;
  };
  'key-added': {
    key: TKey;
    value: TValue;
  };
  'key-updated': {
    key: TKey;
    value: TValue;
  };
  'cleared': undefined;
};
/**
 * A wrapper around a regular Map, but one that fires events when data changes.
 *
 * Events:
 * * removed: Key/value removed
 * * added: Key/value added/updated
 * * key-added: Key/value pair added that resulted in a new key
 * * key-updated: Value updated for an existing key
 * * cleared: Map has been cleared
 */
declare class MapWithEvents<TKey, TValue> extends SimpleEventEmitter<MapWithEventsEvents<TKey, TValue>> implements IMapMutable<TKey, TValue> {
  #private;
  add(...itemsToAdd: EitherKey<TKey, TValue>): void;
  set(key: TKey, value: TValue): void;
  delete(key: TKey): void;
  clear(): void;
  get(key: TKey): TValue | undefined;
  has(key: TKey): boolean;
  isEmpty(): boolean;
  entries(): IterableIterator<readonly [TKey, TValue]>;
  values(): IterableIterator<TValue>;
}
declare namespace index_d_exports$1 {
  export { ExpiringMap, ExpiringMapEvent, ExpiringMapEvents, Opts as ExpiringMapOpts, GetOrGenerate, GetOrGenerateSync, IMapImmutable, IMapMutable, IMapOf, IMapOfImmutable, IMapOfMutable, IMapOfMutableExtended, MapArrayEvents, MapArrayOpts, MapCircularOpts, MapMultiOpts, MapOfMutableImpl, MapOfSimple, MapOfSimpleMutable, MapSetOpts, MapWithEvents, MapWithEventsEvents, MergeReconcile, MultiValue, NumberMap, addObjectEntriesMutate, addValue$1 as addValue, addValueMutate, addValueMutator, cloneShallow, deleteByValueCompareMutate, equals, create as expiringMap, filterValues, findBySomeKey, findEntryByPredicate, findEntryByValue, findValue, firstEntry, firstEntryByValue, fromIterable, fromObject, getClosestIntegerKey, getOrGenerate, getOrGenerateSync, hasAnyValue, hasKeyValue, immutable, longestEntry, ofSimpleMutable as mapOfSimpleMutable, mapToArray, mapToObjectTransform, mergeByKey, mutable, ofArrayMutable, ofCircularMutable, ofSetMutable, ofSimple, ofSimpleMutable, some, sortByValue, sortByValueProperty, toArray, toObject, transformMap, zipKeyValue };
}
//#endregion
//#region ../packages/collections/src/table.d.ts
/**
 * Stores values in a table of rows (vertical) and columns (horizontal)
 */
declare class Table<V> {
  #private;
  rows: TableRow<V>[];
  rowLabels: string[];
  colLabels: string[];
  /**
   * Keep track of widest row
   */
  columnMaxLength: number;
  /**
   * Gets the label for a given column index,
   * returning _undefined_ if not found.
   *
   * Case-sensitive
   * @param label Label to seek
   * @returns Index of column, or _undefined_ if not found
   */
  getColumnLabelIndex(label: string): number | undefined;
  /**
   * Gets the label for a given row index,
   * returning _undefined_ if not found.
   *
   * Case-sensitive
   * @param label Label to seek
   * @returns Index of row, or _undefined_ if not found
   */
  getRowLabelIndex(label: string): number | undefined;
  /**
   * Dumps the values of the table to the console
   */
  print(): void;
  /**
   * Return a copy of table as nested array
   *
   * ```js
   * const t = new Table();
   * // add stuff
   * // ...
   * const m = t.asArray();
   * for (const row of m) {
   *  for (const colValue of row) {
   *    // iterate over all column values for this row
   *  }
   * }
   * ```
   *
   * Alternative: get value at row Y and column X
   * ```js
   * const value = m[y][x];
   * ```
   * @returns
   */
  asArray(): (V | undefined)[][];
  /**
   * Return the number of rows
   */
  get rowCount(): number;
  /**
   * Return the maximum number of columns in any row
   */
  get columnCount(): number;
  /**
   * Iterates over the table row-wise, in object format.
   * @see {@link rowsWithLabelsArray} to get rows in array format
   */
  rowsWithLabelsObject(): Generator<object | undefined, void, unknown>;
  /**
   * Iterates over each row, including the labels if available
   * @see {@link rowsWithLabelsObject} to get rows in object format
   */
  rowsWithLabelsArray(): Generator<[label: string | undefined, value: V | undefined][] | undefined, void, unknown>;
  /**
   * Assign labels to columns
   * @param labels
   */
  labelColumns(...labels: string[]): void;
  /**
   * Assign label to a specific column
   * First column has an index of 0
   * @param columnIndex
   * @param label
   */
  labelColumn(columnIndex: number, label: string): void;
  /**
   * Label rows
   * @param labels Labels
   */
  labelRows(...labels: string[]): void;
  /**
   * Assign label to a specific row
   * First row has an index of 0
   * @param rowIndex
   * @param label
   */
  labelRow(rowIndex: number, label: string): void;
  /**
   * Adds a new row
   * @param data Columns
   */
  appendRow(...data: TableValue<V>[]): TableRow<V>;
  /**
   * Gets a row along with labels, as an array
   * @param rowIndex
   * @returns
   */
  getRowWithLabelsArray(rowIndex: number): [label: string | undefined, value: V | undefined][] | undefined;
  /**
   * Return a row of objects. Keys use the column labels.
   *
   * ```js
   * const row = table.getRowWithLabelsObject(10);
   * // eg:
   * // [{ colour: red, size: 10}, { colour: blue, size: 20 }]
   * ```
   * @param rowIndex
   * @returns
   */
  getRowWithLabelsObject(rowIndex: number): object | undefined;
  /**
   * Gets a copy of values at given row, specified by index or label
   * @param row
   * @returns Returns row or throws an error if label or index not found
   */
  row(row: number | string): readonly (V | undefined)[] | undefined;
  /**
   * Set the value of row,columm.
   * Row is created if it doesn't exist, with the other column values being _undefined_
   * @param row Index or label
   * @param column Column
   * @param value Value to set at row,column
   */
  set(row: number | string, column: number | string, value: V | undefined): void;
  /**
   * Gets the value at a specified row and column.
   * Throws an error if coordinates are out of range or missing.
   * @param row Row index or label
   * @param column Column index or label
   * @returns
   */
  get(row: number | string, column: number | string): TableValue<V>;
  /**
   * Set all the columns of a row to a specified value.
   *
   * By default, sets the number of columns corresponding to
   * the table's maximum column length. To set an arbitrary
   * length of the row, use `length`
   * @param row Index or label of row
   * @param length How wide the row is. If unset, uses the current maximum width of rows.
   * @param value Value to set
   */
  setRow(row: number | string, value: V | undefined, length?: number): TableRow<V>;
}
declare namespace directed_graph_d_exports {
  export { ConnectOptions$1 as ConnectOptions, DirectedGraph, DistanceCompute, Edge$1 as Edge, Vertex$1 as Vertex, adjacentVertices$1 as adjacentVertices, areAdjacent, bfs, clone, connect$1 as connect, connectTo$1 as connectTo, connectWithEdges$1 as connectWithEdges, createVertex$1 as createVertex, dfs, disconnect, distance, distanceDefault, dumpGraph$1 as dumpGraph, edges, get, getCycles, getOrCreate$1 as getOrCreate, getOrFail, graph$1 as graph, graphFromVertices, hasKey, hasNoOuts, hasOnlyOuts, hasOut, isAcyclic, pathDijkstra, toAdjacencyMatrix$1 as toAdjacencyMatrix, topologicalSort, transitiveReduction, updateGraphVertex$1 as updateGraphVertex, vertexHasOut, vertices };
}
type DistanceCompute = (graph: DirectedGraph, edge: Edge$1) => number;
/**
 * Vertex. These are the _nodes_ of the graph. Immutable.
 *
 * They keep track of all of their outgoing edges, and
 * a unique id.
 *
 * Ids are used for accessing/updating vertices as well as in the
 * {@link Edge} type. They must be unique.
 */
type Vertex$1 = Readonly<{
  out: readonly Edge$1[];
  id: string;
}>;
/**
 * Edge. Immutable.
 *
 * Only encodes the destination vertex. The from
 * is known since edges are stored on the from vertex.
 */
type Edge$1 = Readonly<{
  /**
   * Vertex id edge connects to (ie. destination)
   */
  id: string;
  /**
   * Optional weight of edge
   */
  weight?: number;
}>;
/**
 * Create a vertex with given id
 * @param id
 * @returns
 */
declare const createVertex$1: (id: string) => Vertex$1;
/**
 * Options for connecting vertices
 */
type ConnectOptions$1 = Readonly<{
  /**
   * From, or source of connection
   */
  from: string;
  /**
   * To, or destination of connection. Can be multiple vertices for quick use
   */
  to: string | string[];
  /**
   * If true, edges in opposite direction are made as well
   */
  bidi?: boolean;
  /**
   * Weight for this connection (optional)
   */
  weight?: number;
}>;
/**
 * Directed graph. Immutable.
 *
 * Consists of {@link Vertex|vertices}, which all have zero or more outgoing {@link Edge|Edges}.
 */
type DirectedGraph = Readonly<{
  vertices: IMapImmutable<string, Vertex$1>;
}>;
/**
 * Returns _true_ if graph contains `key`.
 *
 * ```js
 * // Same as
 * g.vertices.has(key)
 * ```
 * @param graph
 * @param key
 * @returns
 */
declare function hasKey(graph: DirectedGraph, key: string): boolean;
/**
 * Returns {@link Vertex} under `key`, or _undefined_
 * if not found.
 *
 * ```js
 * // Same as
 * g.vertices.get(key)
 * ```
 * @param graph
 * @param key
 * @returns
 */
declare function get(graph: DirectedGraph, key: string): Vertex$1 | undefined;
/**
 * Returns the graph connections as an adjacency matrix
 * @param graph
 * @returns
 */
declare function toAdjacencyMatrix$1(graph: DirectedGraph): Table<boolean>;
/**
 * Return a string representation of the graph for debug inspection
 * @param graph
 * @returns
 */
declare const dumpGraph$1: (graph: DirectedGraph | Iterable<Vertex$1>) => string;
/**
 * Returns the weight of an edge, or 1 if undefined.
 * @param graph
 * @param edge
 * @returns
 */
declare const distance: (graph: DirectedGraph, edge: Edge$1) => number;
/**
 * Iterate over all the edges in the graph
 * @param graph
 */
declare function edges(graph: DirectedGraph): Generator<Readonly<{
  /**
   * Vertex id edge connects to (ie. destination)
   */
  id: string;
  /**
   * Optional weight of edge
   */
  weight?: number;
}>, void, unknown>;
/**
 * Iterate over all the vertices of the graph
 * @param graph
 */
declare function vertices(graph: DirectedGraph): Generator<Readonly<{
  out: readonly Edge$1[];
  id: string;
}>, void, unknown>;
/**
 * Iterate over all the vertices connected to `context` vertex
 * @param graph Graph
 * @param context id or Vertex.
 * @returns
 */
declare function adjacentVertices$1(graph: DirectedGraph, context: Vertex$1 | string | undefined): Generator<Readonly<{
  out: readonly Edge$1[];
  id: string;
}>, void, unknown>;
/**
 * Returns _true_ if `vertex` has an outgoing connection to
 * the supplied id or vertex.
 *
 * If `vertex` is undefined, _false_ is returned.
 * @param vertex From vertex
 * @param outIdOrVertex To vertex
 * @returns
 */
declare const vertexHasOut: (vertex: Vertex$1, outIdOrVertex: string | Vertex$1) => boolean;
/**
 * Returns _true_ if `vertex` has no outgoing connections
 * @param graph
 * @param vertex
 * @returns
 */
declare const hasNoOuts: (graph: DirectedGraph, vertex: string | Vertex$1) => boolean;
/**
 * Returns _true_ if `vertex` only has the given list of vertices.
 * Returns _false_ early if the length of the list does not match up with `vertex.out`
 * @param graph
 * @param vertex
 * @param outIdOrVertex
 * @returns
 */
declare const hasOnlyOuts: (graph: DirectedGraph, vertex: string | Vertex$1, ...outIdOrVertex: (string | Vertex$1)[]) => boolean;
/**
 * Returns _true_ if `vertex` has an outgoing connection to the given vertex.
 * @param graph
 * @param vertex
 * @param outIdOrVertex
 * @returns
 */
declare const hasOut: (graph: DirectedGraph, vertex: string | Vertex$1, outIdOrVertex: string | Vertex$1) => boolean;
/**
 * Gets a vertex by id, creating it if it does not exist.
 * @param graph
 * @param id
 * @returns
 */
declare const getOrCreate$1: (graph: DirectedGraph, id: string) => Readonly<{
  graph: DirectedGraph;
  vertex: Vertex$1;
}>;
/**
 * Gets a vertex by id, throwing an error if it does not exist
 * @param graph
 * @param id
 * @returns
 */
declare const getOrFail: (graph: DirectedGraph, id: string) => Vertex$1;
/**
 * Updates a vertex by returning a mutated graph
 * @param graph Graph
 * @param vertex Newly changed vertex
 * @returns
 */
declare const updateGraphVertex$1: (graph: DirectedGraph, vertex: Vertex$1) => DirectedGraph;
/**
 * Default distance computer. Uses `weight` property of edge, or `1` if not found.
 * @param graph
 * @param edge
 * @returns
 */
declare const distanceDefault: (graph: DirectedGraph, edge: Edge$1) => number;
/**
 * Returns a mutation of `graph`, with a given edge removed.
 *
 * If edge was not there, original graph is returned.
 * @param graph
 * @param from
 * @param to
 * @returns
 */
declare function disconnect(graph: DirectedGraph, from: string | Vertex$1, to: string | Vertex$1): DirectedGraph;
/**
 * Make a connection between two vertices with a given weight.
 * It returns the new graph as wll as the created edge.
 * @param graph
 * @param from
 * @param to
 * @param weight
 * @returns
 */
declare function connectTo$1(graph: DirectedGraph, from: string, to: string, weight?: number): {
  graph: DirectedGraph;
  edge: Edge$1;
};
/**
 * Connect from -> to. Same as {@link connectWithEdges}, but this version just returns the graph.
 *
 * By default unidirectional, meaning a connection is made only from->to. Use `bidi` option to set a bidirection connection, adding also to->from.
 *
 * Returns a result of `{ graph, edges }`, where `graph` is the new {@link DirectedGraph} and `edges`
 * is an array of {@link Edge Edges}. One for unidirectional, or two for bidirectional.
 * @param graph
 * @param options
 * @returns
 */
declare function connect$1(graph: DirectedGraph, options: ConnectOptions$1): DirectedGraph;
/**
 * Connect from -> to. Same as {@link connect} except you get back the edges as well.
 *
 * By default unidirectional, meaning a connection is made only from->to. Use `bidi` option to set a bidirection connection, adding also to->from.
 *
 * Returns a result of `{ graph, edges }`, where `graph` is the new {@link DirectedGraph} and `edges`
 * is an array of {@link Edge Edges}. One for unidirectional, or two for bidirectional.
 * @param graph
 * @param options
 * @returns
 */
declare function connectWithEdges$1(graph: DirectedGraph, options: ConnectOptions$1): {
  graph: DirectedGraph;
  edges: Edge$1[];
};
/**
 * Returns _true_ if a->b or b->a
 * @param graph
 * @param a
 * @param b
 * @returns
 */
declare function areAdjacent(graph: DirectedGraph, a: Vertex$1, b: Vertex$1): true | undefined;
/**
 * Iterates over vertices from a starting vertex in an bread-first-search
 * @param graph
 * @param startIdOrVertex
 * @param targetIdOrVertex
 * @returns
 */
declare function bfs(graph: DirectedGraph, startIdOrVertex: string | Vertex$1, targetIdOrVertex?: string | Vertex$1): Generator<Readonly<{
  out: readonly Edge$1[];
  id: string;
}>, void, unknown>;
/**
 * Iterates over vertices from a starting vertex in an depth-first-search
 * @param graph
 * @param startIdOrVertex
 */
declare function dfs(graph: DirectedGraph, startIdOrVertex: string | Vertex$1): Generator<Readonly<{
  out: readonly Edge$1[];
  id: string;
}>, void, unknown>;
/**
 * Compute shortest distance from the source vertex to the rest of the graph.
 * @param graph
 * @param sourceOrId
 * @returns
 */
declare const pathDijkstra: (graph: DirectedGraph, sourceOrId: Vertex$1 | string) => {
  distances: Map<string, number>;
  previous: Map<string, Readonly<{
    out: readonly Edge$1[];
    id: string;
  }> | null>;
  pathTo: (id: string) => Edge$1[];
};
/**
 * Clones the graph. Uses shallow clone, because it's all immutable
 * @param graph
 * @returns
 */
declare const clone: (graph: DirectedGraph) => DirectedGraph;
/**
 * Create a graph
 * ```js
 * let g = graph();
 * ```
 *
 * Can optionally provide initial connections:
 * ```js
 * let g = graph(
 *  { from: `a`, to: `b` },
 *  { from: `b`, to: `c` }
 * )
 * ```
 * @param initialConnections
 * @returns
 */
declare const graph$1: (...initialConnections: ConnectOptions$1[]) => DirectedGraph;
/**
 * Returns _true_ if the graph contains is acyclic - that is, it has no loops
 * @param graph
 */
declare function isAcyclic(graph: DirectedGraph): boolean;
/**
 * Topological sort using Kahn's algorithm.
 * Returns a new graph that is sorted
 * @param graph
 */
declare function topologicalSort(graph: DirectedGraph): DirectedGraph;
/**
 * Create a graph from an iterable of vertices
 * @param vertices
 * @returns
 */
declare function graphFromVertices(vertices: Iterable<Vertex$1>): DirectedGraph;
/**
 * Get all the cycles ('strongly-connected-components') within the graph
 * [Read more](https://en.wikipedia.org/wiki/Strongly_connected_component)
 * @param graph
 * @returns
 */
declare function getCycles(graph: DirectedGraph): Vertex$1[][];
/**
 * Returns a new graph which is transitively reduced.
 * That is, redundant edges are removed
 * @param graph
 * @returns
 */
declare function transitiveReduction(graph: DirectedGraph): Readonly<{
  vertices: IMapImmutable<string, Vertex$1>;
}>;
declare namespace undirected_graph_d_exports {
  export { ConnectOptions, Edge, Graph, Vertex, adjacentVertices, connect, connectTo, connectWithEdges, createVertex, dumpGraph, edgesForVertex, getConnection, getOrCreate, graph, hasConnection, toAdjacencyMatrix, updateGraphVertex };
}
type Vertex = Readonly<{
  id: string;
}>;
type Edge = Readonly<{
  a: string;
  b: string;
  weight?: number;
}>;
type Graph = Readonly<{
  edges: readonly Edge[];
  vertices: IMapImmutable<string, Vertex>;
}>;
type ConnectOptions = Readonly<{
  a: string;
  b: string | string[];
  weight?: number;
}>;
declare const createVertex: (id: string) => Vertex;
declare const updateGraphVertex: (graph: Graph, vertex: Vertex) => Graph;
declare const getOrCreate: (graph: Graph, id: string) => Readonly<{
  graph: Graph;
  vertex: Vertex;
}>;
/**
 * Returns _true/false_ if there is a connection between `a` and `b` in `graph`.
 * Use {@link getConnection} if you want to the edge.
 * @param graph Graph to search
 * @param a
 * @param b
 * @returns _true_ if edge exists
 */
declare const hasConnection: (graph: Graph, a: string | Vertex, b: string | Vertex) => boolean;
/**
 * Gets the connection, if it exists between `a` and `b` in `graph`.
 * If it doesn't exist, _undefined_ is returned.
 * Use {@link hasConnection} for a simple true/false if edge exists.
 * @param graph Graph
 * @param a
 * @param b
 * @returns
 */
declare const getConnection: (graph: Graph, a: string | Vertex, b: string | Vertex) => Edge | undefined;
/**
 * Connects A with B, returning the changed graph and created edge.
 * If the connection already exists, the original graph & edge is returned.
 * @param graph
 * @param a
 * @param b
 * @param weight
 * @returns
 */
declare function connectTo(graph: Graph, a: string, b: string, weight?: number): {
  graph: Graph;
  edge: Edge;
};
/**
 * Makes a connection between `options.a` and one or more nodes in `options.b`.
 * Same as {@link connectWithEdges} but only the {@link Graph} is returned.
 *
 * ```js
 * let g = graph(); // Create an empty graph
 * // Make a connection between `red` and `orange`
 * g = connect(g, { a: `red`, b: `orange` });
 *
 * // Make a connection between `red` and `orange as well as `red` and `yellow`.
 * g = connect(g, { a: `red`, b: [`orange`, `yellow`] })
 * ```
 * @param graph Initial graph
 * @param options Options
 */
declare function connect(graph: Graph, options: ConnectOptions): Graph;
/**
 * Makes a connection between `options.a` and one or more nodes in `options.b`.
 * Same as {@link connect} but graph and edges are returned.
 *
 * ```js
 * let g = graph(); // Create an empty graph
 *
 * // Make a connection between `red` and `orange`
 * result = connectWithEdges(g, { a: `red`, b: `orange` });
 *
 * // Make a connection between `red` and `orange as well as `red` and `yellow`.
 * result = connectWithEdges(g, { a: `red`, b: [`orange`, `yellow`] })
 * ```
 * @param graph Initial graph
 * @param options Options
 */
declare function connectWithEdges(graph: Graph, options: ConnectOptions): {
  graph: Graph;
  edges: Edge[];
};
declare const graph: (...initialConnections: ConnectOptions[]) => Graph;
declare function toAdjacencyMatrix(graph: Graph): Table<boolean>;
/**
 * Return a string representation of the graph for debug inspection
 * @param graph
 * @returns
 */
declare const dumpGraph: (graph: Graph) => string;
/**
 * Iterate over all the vertices connectd to `context` vertex
 *
 * If `context` is _undefined_, returns nothing
 * @param graph Graph
 * @param context id or Vertex
 * @returns
 */
declare function adjacentVertices(graph: Graph, context: Vertex | string | undefined): Generator<Readonly<{
  id: string;
}>, void, unknown>;
/**
 * Get all the edges for a vertex.
 *
 * ```js
 * // Iterate all edges for vertex with id '0'
 * for (const edge of edgesForVertex(graph, '0')) {
 * }
 * ```
 *
 * If the vertex has no edges, no values are returned. If the vertex was not found in the graph, an error is thrown.
 * @throws Throws an error if `context` was not found, if it's _undefined_ or `graph` is invalid.
 * @param graph
 * @param context
 * @returns
 */
declare function edgesForVertex(graph: Graph, context: Vertex | string | undefined): Generator<Readonly<{
  a: string;
  b: string;
  weight?: number;
}>, void, unknown>;
declare namespace index_d_exports {
  export { directed_graph_d_exports as Directed, undirected_graph_d_exports as Undirected };
}
//#endregion
export { ArrayKeys, CircularArray, EitherKey, ExpiringMap, index_d_exports as Graphs, ICircularArray, type ISetImmutable, type ISetMutable, IStackImmutable, LabelledNode, LabelledSingleValue, LabelledValue, LabelledValues, MapOfSimpleMutable, index_d_exports$1 as Maps, ObjectKeys, QueueDiscardPolicy, QueueImmutable, QueueMutable, QueueOpts, index_d_exports$2 as Queues, SetStringImmutable, SetStringMutable, index_d_exports$3 as Sets, SimplifiedNode, StackImmutable, StackMutable, index_d_exports$4 as Stacks, Table, TableRow, TableValue, TraversableTree, TraverseObjectEntry, TraverseObjectEntryStatic, TraverseObjectEntryWithAncestors, TraverseObjectPathOpts, TreeNode, index_d_exports$5 as Trees, ValueSetEventMap, WrappedNode, isObjectKeys };