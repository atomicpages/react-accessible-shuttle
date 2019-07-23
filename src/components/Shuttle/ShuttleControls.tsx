import * as React from 'react';
import { ShuttleContext } from './ShuttleContext';

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

type ShuttleControlsProps = XOR<
    { children?: React.ReactNode | ((setShuttleState: Function) => React.ReactNode) },
    { render?: (setShuttleState: Function) => React.ReactNode }
>;

export enum SHUTTLE_CONTROL_TYPES {
    MOVE_ALL_TO_TARGET,
    MOVE_SELECTED_TO_TARGET,
    MOVE_SELECTED_TO_SOURCE,
    MOVE_ALL_TO_SOURCE,
}

/**
 * ShuttleControls. Provide your own render function
 * to customize the buttons. The Shuttle `dispatch` method
 * is provided or you can use your own state reducer
 * as needed.
 *
 * Exposed reducers:
 * 1. `MOVE_ALL_TO_TARGET`
 * 2. `MOVE_SELECTED_TO_TARGET`
 * 3. `MOVE_SELECTED_TO_SOURCE`
 * 4. `MOVE_ALL_TO_SOURCE`
 *
 * @example
 * // Custom render controls
 * <Shuttle.Controls render={setShuttleState => (
 *      <CustomButton onClick={() => setShuttleState({ type: 'MOVE_ALL_TO_TARGET' })} />
 * )} />
 */
export function ShuttleControls({ children, render }: ShuttleControlsProps) {
    const { setShuttleState } = React.useContext(ShuttleContext);

    if (typeof children === 'function') {
        return children(setShuttleState);
    }

    if (typeof render === 'function') {
        return render(setShuttleState);
    }

    return (
        <div className="shuttle__controls">
            <button onClick={() => setShuttleState({ type: SHUTTLE_CONTROL_TYPES.MOVE_ALL_TO_TARGET })}>
                {'\u00BB'}
            </button>
            <button onClick={() => setShuttleState({ type: SHUTTLE_CONTROL_TYPES.MOVE_SELECTED_TO_TARGET })}>
                {'\u203A'}
            </button>
            <button onClick={() => setShuttleState({ type: SHUTTLE_CONTROL_TYPES.MOVE_SELECTED_TO_SOURCE })}>
                {'\u2039'}
            </button>
            <button onClick={() => setShuttleState({ type: SHUTTLE_CONTROL_TYPES.MOVE_ALL_TO_SOURCE })}>
                {'\u00AB'}
            </button>
        </div>
    );
}

ShuttleControls.displayName = 'Shuttle.Controls';
