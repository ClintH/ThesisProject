import { t as SimpleEventEmitter } from "./simple-event-emitter-B_mKSo1Q.js";
import { t as LogOption } from "./logger-C2iNOtSg.js";

//#region ../packages/flow/src/state-machine/types.d.ts
type DriverOptions<V extends Transitions> = {
  readonly handlers: readonly DriverStatesHandler<V>[];
  readonly debug?: LogOption;
  /**
   * If _true_ execution of handlers is shuffled each time
   */
  readonly shuffleHandlers?: boolean;
};
type DriverExpressionOrResult<T extends Transitions> = DriverResult<T> | ((machine?: MachineState<T>) => DriverResult<T> | undefined | void);
type DriverStatesHandler<V extends Transitions> = {
  readonly if: readonly StateNames<V>[] | StateNames<V>[] | StateNames<V>;
  readonly then: readonly DriverExpressionOrResult<V>[] | DriverExpressionOrResult<V>;
  /**
   * Logic for choosing which result, if there are multiple expressions.
   * By default 'highest' (for highest ranked result)
   */
  readonly resultChoice?: `first` | `highest` | `lowest` | `random`;
};
type DriverRunner<V extends Transitions> = {
  readonly run: () => Promise<MachineState<V> | undefined>;
  readonly getValue: () => StateNames<V>;
  readonly reset: () => void;
  readonly to: (state: StateNames<V>) => MachineState<V>;
};
type DriverResult<V extends Transitions> = {
  /**
   * Score of this result. This is used when a state
   * has multiple handlers returning results separately.
   * If not defined, 0 is used.
   */
  readonly score?: number;
  /**
   * If specified,the state to transition to. Use
   * _true_ to attempt to automatically advance machine.
   * This field is 2nd priority.
   */
  readonly next?: StateNames<V> | boolean;
  /**
   * If true, resets the machine.
   * This flag is 1st priority, taking precedence over the `next` field.
   */
  readonly reset?: boolean;
};
/**
 * Transition result
 * * 'Ok': transition valid
 * * 'FromNotFound': the from state is missing from machine definition
 * * 'ToNotFound': the 'to' state is missing from machine definition
 * * 'Invalid': not allowed to transition to target state from the current state
 * * 'Terminal':  not allowed to transition because from state is the final state
 */
type TransitionResult = `Ok` | `FromNotFound` | `ToNotFound` | `Invalid` | `Terminal`;
type TransitionCondition<V extends Transitions> = {
  readonly hasPriorState: readonly StateNames<V>[];
  readonly isInState: StateNames<V>;
};
type StateTargetStrict<V extends Transitions> = {
  readonly state: StateNames<V> | null;
  readonly preconditions?: readonly TransitionCondition<V>[];
};
/**
 * Possible state transitions, or _null_ if final state.
 */
type StateTarget<V extends Transitions> = string | string[] | readonly string[] | null | StateTargetStrict<V>;
/**
 * Maps state to allowable next states
 */
type Transitions = {
  readonly [key: string]: StateTarget<Transitions>;
};
type TransitionsStrict = Readonly<Record<string, readonly StateTargetStrict<Transitions>[]>>;
/**
 * List of possible states
 */
type StateNames<V extends Transitions> = keyof V & string;
type Machine<V extends Transitions> = {
  /**
   * Allowable state transitions
   */
  readonly states: V;
};
/**
 * Encapsulation of a 'running' machine description and state.
 *
 * See:
 * - {@link cloneState}
 */
type MachineState<V extends Transitions> = {
  /**
   * Current state
   */
  readonly value: StateNames<V>;
  /**
   * List of unique states visited. Won't contain the current
   * state unless it has already been visited.
   */
  readonly visited: readonly StateNames<V>[];
  /**
   * Definition of state machine
   */
  readonly machine: Readonly<Record<StateNames<V>, readonly StateTargetStrict<V>[]>>;
};
type StateEvent = (args: unknown, sender: any) => void;
type StateHandler = string | StateEvent | null;
type State = Readonly<Record<string, StateHandler>>;
//#endregion
//#region ../packages/flow/src/state-machine/driver.d.ts
/**
 * Drives a state machine.
 *
 * [Read more on the ixfx Guide](https://ixfx.fun/flow/state-machine/driver/)
 *
 * Uses a 'handlers' structure to determine when to change
 * state and actions to take.
 *
 * The structure is a set of logical conditions: if we're in
 * this state, then move to this other state etc.
 *
 * ```js
 * const handlers = [
 *  {
 *    // If we're in the 'sleeping' state, move to next state
 *    if: 'sleeping',
 *    then: { next: true }
 *  },
 *  {
 *    // If we're in the 'waking' state, randomly either go to 'resting' or 'sleeping' state
 *    if: 'waking',
 *    then: [
 *      () => {
 *        if (Math.random() > 0.5) {
 *          return { next: 'resting' }
 *        } else {
 *          return { next: 'sleeping' }
 *        }
 *      }
 *    ]
 *   }
 * ];
 * ```
 *
 * Set up the driver, and call `run()` when you want to get
 * the machine to change state or take action:
 *
 * ```js
 * const driver = await StateMachine.driver(states, handlers);
 * setInterval(async () => {
 *  await driver.run(); // Note use of 'await' again
 * }, 1000);
 * ```
 *
 * Essentially, the 'handlers' structure gets run through each time `run()`
 * is called.
 *
 * Defaults to selecting the highest-ranked result to determine
 * what to do next.
 * @param machine
 * @param handlersOrOpts
 * @returns
 */
declare function driver<V extends Transitions>(machine: Machine<V> | Transitions, handlersOrOpts: readonly DriverStatesHandler<V>[] | DriverOptions<V>): Promise<DriverRunner<V>>;
//#endregion
//#region ../packages/flow/src/state-machine/state-machine-fns.d.ts
/**
 * Clones machine state
 * @param toClone
 * @returns Cloned of `toClone`
 */
declare const cloneState: <V extends Transitions>(toClone: MachineState<V>) => MachineState<V>;
/**
 * Initialises a state machine. [Read more in the ixfx Guide](https://ixfx.fun/flow/state-machine/overview/)
 *
 * ```js
 * const desc = {
 *  pants: ['shoes','socks'],
 *  socks: ['shoes', 'pants'],
 *  shoes: 'shirt',
 *  shirt: null
 * }
 *
 * // Defaults to first key, 'pants'
 * let sm = StateMachine.init(descr);
 *
 * // Move to 'shoes' state
 * sm = StateMachine.to(sm, 'shoes');
 * sm.state; // 'shoes'
 * sm.visited; // [ 'pants' ]
 *
 * StateMachine.isDone(sm); // false
 * StateMachine.possible(sm); // [ 'shirt' ]
 * ```
 * @param stateMachine Settings for state machine
 * @param initialState Initial state name
 * @returns
 */
declare const init: <V extends Transitions>(stateMachine: Machine<V> | Transitions | TransitionsStrict, initialState?: StateNames<V>) => MachineState<V>;
declare const reset: <V extends Transitions>(sm: MachineState<V>) => MachineState<V>;
declare const validateMachine: <V extends Transitions>(smOrTransitions: Machine<V> | Transitions | TransitionsStrict) => [machine: Machine<V> | undefined, msg: string];
/**
 * Returns _true_ if MachineState `sm` is in its final state.
 * @param sm
 * @returns
 */
declare const isDone: <V extends Transitions>(sm: MachineState<V>) => boolean;
/**
 * Returns a list of possible state targets for `sm`, or
 * an empty list if no transitions are possible.
 * @param sm
 * @returns
 */
declare const possibleTargets: <V extends Transitions>(sm: MachineState<V>) => readonly StateTargetStrict<V>[];
/**
 * Returns a list of possible state names for `sm`, or
 * an empty list if no transitions are possible.
 *
 * @param sm
 * @returns
 */
declare const possible: <V extends Transitions>(sm: MachineState<V>) => (StateNames<V> | null)[];
declare const normaliseTargets: <V extends Transitions>(targets: StateTarget<V> | readonly StateTargetStrict<V>[] | StateTargetStrict<V>) => StateTargetStrict<V>[] | null | undefined;
/**
 * Attempts to transition to a new state. Either a new
 * `MachineState` is returned reflecting the change, or
 * an exception is thrown.
 *
 * @example Attempts to transition to 'name-of-state'
 * ```js
 * const newState = StateMachine.to(currentState, `name-of-state`);
 * ```
 *
 * Note that 'currentState' is not changed.
 * @param sm
 * @param toState
 * @returns
 */
declare const to: <V extends Transitions>(sm: MachineState<V>, toState: StateNames<V>) => MachineState<V>;
declare const next: <V extends Transitions>(sm: MachineState<V>) => MachineState<V>;
/**
 * Returns _true_ if `toState` is a valid transition from current state of `sm`
 * @param sm
 * @param toState
 * @returns
 */
declare const isValidTransition: <V extends Transitions>(sm: MachineState<V>, toState: StateNames<V>) => boolean;
declare const validateTransition: <V extends Transitions>(sm: MachineState<V>, toState: StateNames<V>) => void;
/**
 * Returns state transitions based on a list of strings.
 * The last string is the terminal state.
 *  A -> B -> C -> D
 *
 * See also: {@link fromListBidirectional}
 *
 * ```js
 * const transitions = fromList([`a`, `b`, `c`, `d`]);
 * // Object state machine with events
 * const sm = new StateMachine.WithEvents(transitions);
 * // OR, immutable state machine
 * const sm = StateMachine.init(transitions);
 * ```
 * @param states List of states
 * @return MachineDescription
 */
declare const fromList: (...states: readonly string[]) => Transitions;
/**
 * Returns a machine description based on a list of strings. Machine
 * can go back and forth between states:
 *  A <-> B <-> C <-> D
 *
 * See also {@link fromList}.
 *
 * ```js
 * const transitions = fromListBidirectional([`a`, `b`, `c`, `d`]);
 * // Object state machine with events
 * const sm = new StateMachine.WithEvents(transitions);
 * // OR, immutable state machine
 * const sm = StateMachine.init(transitions);
 * ```
 * @param states
 * @returns
 */
declare const fromListBidirectional: (...states: readonly string[]) => Transitions;
//#endregion
//#region ../packages/flow/src/state-machine/with-events.d.ts
type StateChangeEvent<V extends Transitions> = {
  readonly newState: StateNames<V>;
  readonly priorState: StateNames<V>;
};
type StopEvent<V extends Transitions> = {
  readonly state: StateNames<V>;
};
type StateMachineEventMap<V extends Transitions> = {
  readonly change: StateChangeEvent<V>;
  readonly stop: StopEvent<V>;
};
type StateMachineWithEventsOptions<V extends Transitions> = {
  readonly debug?: boolean;
  readonly initial?: StateNames<V>;
};
/**
 * A state machine that fires events when state changes.
 *
 * ```js
 * const transitions = StateMachine.fromList(`a`, `b`, `c`);
 * const m = new StateMachineWithEvents(transitions);
 * m.addEventListener(`change`, event => {
 *  console.log(`${event.priorState} -> ${event.newState}`);
 * });
 * m.addEventListener(`stop`, event => {
 *  console.log(`State machine has reached final state`);
 * });
 * ```
 */
declare class StateMachineWithEvents<V extends Transitions> extends SimpleEventEmitter<StateMachineEventMap<V>> {
  #private;
  /**
   * Create a state machine with initial state, description and options
   * @param m Machine description
   * @param opts Options for machine (defaults to `{debug:false}`)
   */
  constructor(m: V, opts?: StateMachineWithEventsOptions<V>);
  /**
   * Return a list of possible states from current state.
   *
   * If list is empty, no states are possible. Otherwise lists
   * possible states, including 'null' for terminal
   */
  get statesPossible(): readonly (StateNames<V> | null)[];
  /**
   * Return a list of all defined states
   */
  get statesDefined(): readonly StateNames<V>[];
  /**
   * Moves to the next state if possible. If multiple states are possible, it will use the first.
   * If machine is finalised, no error is thrown and null is returned.
   *
   * @returns {(string|null)} Returns new state, or null if machine is finalised
   */
  next(): string | null;
  /**
   * Returns _true_ if state machine is in its final state
   *
   * @returns
   */
  get isDone(): boolean;
  /**
   * Resets machine to initial state
   */
  reset(): void;
  /**
   * Throws if it's not valid to transition to `newState`
   * @param newState
   * @returns
   */
  validateTransition(newState: StateNames<V>): void;
  /**
   * Returns _true_ if `newState` is valid transition from current state.
   * Use {@link validateTransition} if you want an explanation for the _false_ results.
   * @param newState
   * @returns
   */
  isValid(newState: StateNames<V>): boolean;
  /**
   * Gets or sets state. Throws an error if an invalid transition is attempted.
   * Use `isValid()` to check validity without changing.
   *
   * If `newState` is the same as current state, the request is ignored silently.
   */
  set state(newState: StateNames<V>);
  get state(): string;
  /**
   * Returns timestamp when state was last changed.
   * See also `elapsed`
   */
  get changedAt(): number;
  /**
   * Returns milliseconds elapsed since last state change.
   * See also `changedAt`
   */
  get elapsed(): number;
}
declare namespace state_machine_d_exports {
  export { DriverExpressionOrResult, DriverOptions, DriverResult, DriverRunner, DriverStatesHandler, Machine, MachineState, State, StateChangeEvent, StateEvent, StateHandler, StateMachineEventMap, StateMachineWithEvents, StateMachineWithEventsOptions, StateNames, StateTarget, StateTargetStrict, StopEvent, TransitionCondition, TransitionResult, Transitions, TransitionsStrict, cloneState, driver, fromList, fromListBidirectional, init, isDone, isValidTransition, next, normaliseTargets, possible, possibleTargets, reset, to, validateMachine, validateTransition };
}
//#endregion
export { Transitions as i, StateChangeEvent as n, StateMachineWithEvents as r, state_machine_d_exports as t };