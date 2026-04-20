import { t as IsEqual } from "./is-equal--ZpQv_rE.js";
import { t as SimpleEventEmitter } from "./simple-event-emitter-B_mKSo1Q.js";

//#region ../packages/collections/src/queue/iqueue-mutable.d.ts
type QueueMutableEvents<V> = {
  /**
   * Data has been added
   * * added: data attempted to be added. Note: not all of it may have been accepted into queue
   * * finalData: actual state of queue
   */
  enqueue: {
    added: readonly V[];
    finalData: readonly V[];
  };
  /**
   * Single item dequeued.
   * When dequeing the 'removed' event also fires
   */
  dequeue: {
    removed: V;
    finalData: readonly V[];
  };
  /**
   * One or more items removed due to dequeuing, clearing or removeWhere called
   */
  removed: {
    removed: readonly V[];
    finalData: readonly V[];
  };
};
interface IQueueMutableWithEvents<V> extends IQueueMutable<V>, SimpleEventEmitter<QueueMutableEvents<V>> {}
/**
 * Queue (mutable). See also {@link IQueueImmutable} for the immutable version.
 *
 * Queues are useful if you want to treat 'older' or 'newer'
 * items differently. _Enqueing_ adds items at the back of the queue, while
 * _dequeing_ removes items from the front (ie. the oldest).
 *
 * ```js
 * const q = queue();       // Create
 * q.enqueue(`a`, `b`);     // Add two strings
 * const front = q.dequeue();  // `a` is at the front of queue (oldest)
 * ```
 *
 * @example Cap size to 5 items, throwing away newest items already in queue.
 * ```js
 * const q = queue({capacity: 5, discardPolicy: `newer`});
 * ```
 *
 */
interface IQueueMutable<V> {
  /**
   * Dequeues (removes oldest item / item at front of queue)
   *
   * Use {@link peek} to look at the item at front of queue without removing it.
   * @returns Item, or undefined if queue is empty
   */
  readonly dequeue: () => V | undefined;
  /**
   * Enqueues (adds items to back of queue).
   * If a capacity is set, not all items might be added.
   * @returns How many items were added
   */
  readonly enqueue: (...toAdd: readonly V[]) => number;
  /**
  * Returns a copy of data in queue as an array
  */
  toArray(): readonly V[];
  /**
   * Returns front of queue (oldest item), or _undefined_ if queue is empty
   */
  get peek(): V | undefined;
  /**
   * Number of items in queue
   */
  get length(): number;
  /**
   * Is queue full? Returns _false_ if no capacity has been set
   */
  get isFull(): boolean;
  /**
  * Returns true if queue is empty
  */
  get isEmpty(): boolean;
  /**
   * Removes values that match `predicate`.
   *
   * ```js
   * // Eg queue of strings, compare by value
   * queue.removeWhere(v => v === `someValue`);
   *
   * // Eg queue of objects, compare by reference
   * queue.removeWhere(v => v === someTarget);
   *
   * // Eg use ixfx function to compare value of objects, regardless of key ordering
   * queue.removeWhere(v => isEqualValueIgnoreOrder(v, someTarget));
   * ```
   * @param predicate
   * @returns Returns number of items removed.
   */
  removeWhere(predicate: (item: V) => boolean): number;
  /**
   * Returns the item at given rank (0 being front of queue)
   * @param index
   */
  at(index: number): V;
  /**
   * Clears the queue
   */
  clear(): void;
}
//#endregion
//#region ../packages/collections/src/queue/ipriority-queue-mutable.d.ts
/**
 * A prioritised item in queue
 */
type PriorityItem<V> = Readonly<{
  /**
   * Item
   */
  item: V;
  /**
   * Priority
   */
  priority: number;
}>;
interface IPriorityQueueMutable<V> extends IQueueMutable<PriorityItem<V>> {
  /**
   * Dequeues the item with highest priority.
   */
  dequeueMax(): V | undefined;
  /**
   * Dequeues the item with the lowest priority.
   */
  dequeueMin(): V | undefined;
  /**
   * Peeks at the item with highest priority without removing it.
   * _undefined_ if queue is empty.
   */
  peekMax(): V | undefined;
  /**
   * Peeks at the item with the lowest priority without removing it.
   * _undefined_ if queue is empty.
   */
  peekMin(): V | undefined;
}
//#endregion
//#region ../packages/collections/src/queue/iqueue-immutable.d.ts
/**
 * Queue (immutable). See also {@link QueueMutable}.
 *
 * Queues are useful if you want to treat 'older' or 'newer'
 * items differently. _Enqueing_ adds items at the back of the queue, while
 * _dequeing_ removes items from the front (ie. the oldest).
 *
 * ```js
 * let q = queue();           // Create
 * q = q.enqueue(`a`, `b`);   // Add two strings
 * const front = q.peek;      // `a` is at the front of queue (oldest)
 * q = q.dequeue();           // q now just consists of `b`
 * ```
 * @example Cap size to 5 items, throwing away newest items already in queue.
 * ```js
 * const q = queue({capacity: 5, discardPolicy: `newer`});
 * ```
 *
 */
interface IQueueImmutable<V> {
  /**
   * Enumerates queue from back-to-front
   *
   */
  forEach(fn: (v: V) => void): void;
  /**
   * Enumerates queue from front-to-back
   * @param fn
   */
  forEachFromFront(fn: (v: V) => void): void;
  /**
   * Returns a new queue with item(s) added
   * @param toAdd Items to add
   */
  enqueue(...toAdd: ReadonlyArray<V>): IQueueImmutable<V>;
  /**
   * Dequeues (removes oldest item / item at front of queue).
   * Use {@link peek} to get item that will be removed.
   *
   * @returns Queue with item removed
   */
  dequeue(): IQueueImmutable<V>;
  /**
   * Returns true if queue is empty
   */
  get isEmpty(): boolean;
  /**
   * Is queue full? Returns _false_ if no capacity has been set
   */
  get isFull(): boolean;
  /**
   * Number of items in queue
   */
  get length(): number;
  /**
   * Returns front of queue (oldest item), or _undefined_ if queue is empty
   */
  get peek(): V | undefined;
  /**
   * Returns a copy of data in queue as an array
   */
  toArray(): Array<V>;
}
//#endregion
//#region ../packages/collections/src/queue/queue-types.d.ts
type QueueDiscardPolicy = `older` | `newer` | `additions`;
/**
 * Queue options.
 *
 * @example Cap size to 5 items, throwing away newest items already in queue.
 * ```js
 * const q = Queues.mutable({capacity: 5, discardPolicy: `newer`});
 * ```
 */
type QueueOpts<V> = {
  readonly eq?: IsEqual<V>;
  /**
   * @private
   */
  readonly debug?: boolean;
  /**
   * Capcity limit
   */
  readonly capacity?: number;
  /**
   * Default is `additions`, meaning new items are discarded.
   *
   * `older`: Removes items front of the queue (ie older items are discarded)
   *
   * `newer`: Remove from rear of queue to make space for new items (ie newer items are discarded)
   *
   * `additions`: Only adds new items that there are room for (ie. brand new items are discarded)
   *
   */
  readonly discardPolicy?: QueueDiscardPolicy;
};
//#endregion
//#region ../packages/collections/src/queue/queue-mutable.d.ts
/**
 * Mutable queue that fires events when manipulated.
 *
 * Queues are useful if you want to treat 'older' or 'newer'
 * items differently. _Enqueing_ adds items at the back of the queue, while
 * _dequeing_ removes items from the front (ie. the oldest).
 *
 * ```js
 * const q = Queues.mutable();       // Create
 * q.enqueue(`a`, `b`);     // Add two strings
 * const front = q.dequeue();  // `a` is at the front of queue (oldest)
 * ```
 *
 * @example Cap size to 5 items, throwing away newest items already in queue.
 * ```js
 * const q = Queues.mutable({capacity: 5, discardPolicy: `newer`});
 * ```
 *
 * Events can be used to monitor data flows.
 * * 'enqueue': fires when item(s) are added
 * * 'dequeue': fires when an item is dequeued from front
 * * 'removed': fires when an item is dequeued, queue is cleared or .removeWhere is used to trim queue
 *
 * Each of the event handlers return the state of the queue as the 'finalData'
 * field.
 *
 * ```js
 * q.addEventListener(`enqueue`, e => {
 *  // e.added, e.finalData
 * });
 * q.addEventListener(`removed`, e => {
 *  // e.removed, e.finalData
 * });
 * q.addEventListener(`dequeue`, e=> {
 *  // e.removed, e.finalData
 * })
 * ```
 * @typeParam V - Data type of items
 */
declare class QueueMutable<V> extends SimpleEventEmitter<QueueMutableEvents<V>> implements IQueueMutable<V> {
  readonly options: QueueOpts<V>;
  data: readonly V[];
  eq: IsEqual<V>;
  constructor(opts?: QueueOpts<V>, data?: readonly V[]);
  clear(): void;
  /**
   * Called when all data is cleared
   */
  protected onClear(): void;
  at(index: number): V;
  enqueue(...toAdd: readonly V[]): number;
  protected onEnqueue(result: readonly V[], attemptedToAdd: readonly V[]): void;
  dequeue(): V | undefined;
  protected onRemoved(removed: readonly V[], finalData: readonly V[]): void;
  /**
   * Removes values that match `predicate`.
   * @param predicate
   * @returns Returns number of items removed.
   */
  removeWhere(predicate: (item: V) => boolean): number;
  /**
  * Return a copy of the array
  * @returns
  */
  toArray(): V[];
  get isEmpty(): boolean;
  get isFull(): boolean;
  get length(): number;
  get peek(): V | undefined;
}
/**
 * Creates a new QueueMutable
 * @param options
 * @param startingItems
 * @returns
 */
declare function mutable<V>(options?: QueueOpts<V>, ...startingItems: readonly V[]): IQueueMutableWithEvents<V>;
//#endregion
//#region ../packages/collections/src/queue/priority-mutable.d.ts
/**
 * Simple priority queue implementation.
 * Higher numbers mean higher priority.
 *
 * ```js
 * const pm = new PriorityMutable();
 *
 * // Add items with a priority (higher numeric value = higher value)
 * pm.enqueueWithPriority(`hello`, 4);
 * pm.enqueueWithPriotity(`there`, 1);
 *
 * ```
 */
declare class PriorityMutable<V> extends QueueMutable<PriorityItem<V>> implements IPriorityQueueMutable<V> {
  constructor(opts?: QueueOpts<PriorityItem<V>>);
  /**
   * Adds an item with a given priority
   * @param item Item
   * @param priority Priority (higher numeric value means higher priority)
   */
  enqueueWithPriority(item: V, priority: number): void;
  changePriority(item: V, priority: number, addIfMissing?: boolean, eq?: IsEqual<V>): void;
  dequeueMax(): V | undefined;
  dequeueMin(): V | undefined;
  peekMax(): V | undefined;
  peekMin(): V | undefined;
}
/**
 * Creates a {@link PriorityMutable} queue.
 *
 * Options:
 * * eq: Equality function
 * * capacity: limit on number of items
 * * discardPolicy: what to do if capacity is reached
 * @param opts
 * @returns
 */
declare function priority<V>(opts?: QueueOpts<PriorityItem<V>>): IPriorityQueueMutable<V>;
//#endregion
//#region ../packages/collections/src/queue/queue-immutable.d.ts
declare class QueueImmutable<V> implements IQueueImmutable<V> {
  #private;
  readonly opts: QueueOpts<V>;
  /**
   * Creates an instance of Queue.
   * @param {QueueOpts} opts Options foor queue
   * @param {V[]} data Initial data. Index 0 is front of queue
   */
  constructor(opts?: QueueOpts<V>, data?: readonly V[]);
  forEach(fn: (v: V) => void): void;
  forEachFromFront(fn: (v: V) => void): void;
  enqueue(...toAdd: readonly V[] | V[]): QueueImmutable<V>;
  dequeue(): QueueImmutable<V>;
  get isEmpty(): boolean;
  get isFull(): boolean;
  get length(): number;
  get peek(): V | undefined;
  toArray(): V[];
}
/**
 * Returns an immutable queue. Queues are useful if you want to treat 'older' or 'newer'
 * items differently. _Enqueing_ adds items at the back of the queue, while
 * _dequeing_ removes items from the front (ie. the oldest).
 *
 * ```js
 * let q = Queues.immutable();           // Create
 * q = q.enqueue(`a`, `b`);   // Add two strings
 * const front = q.peek();    // `a` is at the front of queue (oldest)
 * q = q.dequeue();           // q now just consists of `b`
 * ```
 * @example Cap size to 5 items, throwing away newest items already in queue.
 * ```js
 * const q = Queues.immutable({capacity: 5, discardPolicy: `newer`});
 * ```
 *
 * @typeParam V - Type of values stored
 * @param options
 * @param startingItems Index 0 is the front of the queue
 * @returns A new queue
 */
declare const immutable: <V>(options?: QueueOpts<V>, ...startingItems: readonly V[]) => IQueueImmutable<V>;
//#endregion
//#region ../packages/collections/src/queue/queue-fns.d.ts
declare const debug: (opts: QueueOpts<any>, message: string) => void;
declare const trimQueue: <V>(opts: QueueOpts<V>, queue: ReadonlyArray<V>, toAdd: ReadonlyArray<V>) => ReadonlyArray<V>;
/**
 * Adds to the back of the queue (last array index)
 * Last item of `toAdd` will potentially be the new end of the queue (depending on capacity limit and overflow policy)
 * @typeParam V - Type of values
 * @param {QueueOpts} opts
 * @param {V[]} queue
 * @param {...V[]} toAdd
 * @returns {V[]}
 */
declare const enqueue: <V>(opts: QueueOpts<V>, queue: ReadonlyArray<V>, ...toAdd: ReadonlyArray<V>) => ReadonlyArray<V>;
declare const dequeue: <V>(opts: QueueOpts<V>, queue: ReadonlyArray<V>) => ReadonlyArray<V>;
/**
 * Returns front of queue (oldest item), or undefined if queue is empty
 *
 * @typeParam V - Type of values stored
 * @param {QueueOpts} opts
 * @param {V[]} queue
 * @returns {(V | undefined)}
 */
declare const peek: <V>(opts: QueueOpts<V>, queue: ReadonlyArray<V>) => V | undefined;
declare const isEmpty: <V>(opts: QueueOpts<V>, queue: ReadonlyArray<V>) => boolean;
declare const isFull: <V>(opts: QueueOpts<V>, queue: ReadonlyArray<V>) => boolean;
declare namespace index_d_exports {
  export { IPriorityQueueMutable, IQueueImmutable, IQueueMutable, IQueueMutableWithEvents, PriorityItem, PriorityMutable, QueueDiscardPolicy, QueueImmutable, QueueMutable, QueueMutableEvents, QueueOpts, debug, dequeue, enqueue, immutable, isEmpty, isFull, mutable, peek, priority, trimQueue };
}
//#endregion
export { QueueOpts as a, QueueDiscardPolicy as i, QueueImmutable as n, IQueueMutableWithEvents as o, QueueMutable as r, index_d_exports as t };