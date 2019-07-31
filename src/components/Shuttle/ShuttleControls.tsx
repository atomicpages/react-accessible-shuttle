import * as React from 'react';
import { ShuttleContext } from './ShuttleContext';
import { SHUTTLE_CONTROL_TYPES } from './reducers/index';
import { XOR } from '../../utils/macros';

type ShuttleControlsProps = XOR<
    { children?: React.ReactNode | ((setShuttleState: Function) => React.ReactNode) },
    { render?: (setShuttleState: Function) => React.ReactNode }
>;

/**
 * ShuttleControls. Provide your own render function
 * to customize the buttons. The Shuttle `dispatch` method
 * is provided or you can use your own state reducer
 * as needed.
 *
 * @example
 * // Custom render controls
 * <Shuttle.Controls render={setShuttleState => (
 *      <CustomButton onClick={() => setShuttleState({ type: 'MOVE_ALL' })} />
 * )} />
 */
export const ShuttleControls = React.memo(({ children, render, ...rest }: ShuttleControlsProps) => {
    const { setShuttleState } = React.useContext(ShuttleContext);

    if (typeof children === 'function') {
        return children(setShuttleState);
    }

    if (typeof render === 'function') {
        return render(setShuttleState);
    }

    const moveAllFromSource = React.useCallback(() => {
        setShuttleState({
            type: SHUTTLE_CONTROL_TYPES.MOVE_ALL,
            from: 'source',
            to: 'target',
        });
    }, []);

    const moveAllFromTarget = React.useCallback(() => {
        setShuttleState({
            type: SHUTTLE_CONTROL_TYPES.MOVE_ALL,
            from: 'target',
            to: 'source',
        });
    }, []);

    const moveSelectedFromSource = React.useCallback(() => {
        setShuttleState({
            type: SHUTTLE_CONTROL_TYPES.MOVE_SELECTIONS,
            from: 'source',
            to: 'target',
        });
    }, []);

    const moveSelectedFromTarget = React.useCallback(() => {
        setShuttleState({
            type: SHUTTLE_CONTROL_TYPES.MOVE_SELECTIONS,
            from: 'target',
            to: 'source',
        });
    }, []);

    return (
        <div className="shuttle__controls" {...rest}>
            <button onClick={moveAllFromSource}>{'\u00BB'}</button>
            <button onClick={moveSelectedFromSource}>{'\u203A'}</button>
            <button onClick={moveSelectedFromTarget}>{'\u2039'}</button>
            <button onClick={moveAllFromTarget}>{'\u00AB'}</button>
        </div>
    );
});

ShuttleControls.displayName = 'Shuttle.Controls';
