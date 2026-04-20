import { a as resolveLogOption, c as LogSet, i as logger, l as MessageLogger, n as logColours, o as LogKind, r as logSet, s as LogMessage, t as LogOption } from "./logger-C2iNOtSg.js";

//#region ../packages/debug/src/fps-counter.d.ts
/**
 * Calculates frames per second.
 *
 * Returns a function which needs to be called at the end of each frame.
 *
 * ```js
 * const fps = fpsCounter();
 *
 * function loop() {
 *  fps(); // Calculate fps
 *  window.requestAnimationFrame(loop);
 * }
 *
 * loop();
 * ```
 * @param autoDisplay If true (default), prints out the FPS to the console
 * @param computeAfterFrames Calculates after this many frames. Higher numbers smoothes the value somewhat
 * @returns
 */
declare const fpsCounter: (autoDisplay?: boolean, computeAfterFrames?: number) => () => number;
//#endregion
//#region ../packages/debug/src/error-message.d.ts
/**
 * Returns a string representation of an error
 * @param ex
 * @returns
 */
declare const getErrorMessage: (ex: unknown) => string;
//#endregion
export { LogKind, LogMessage, LogOption, LogSet, MessageLogger, fpsCounter, getErrorMessage, logColours, logSet, logger, resolveLogOption };