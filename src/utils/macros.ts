/**
 * A macro to exclude an object from having a property. This gets us close to parity
 * with flow and strict object types.
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * Mutual exclusion of _complex_ types like flow supports
 *
 * @example
 * // we might see this in flow
 * type Foo = {| a: number |} | {| a: boolean, b: number |};
 *
 * @see ShuttleControls for usage
 */
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
