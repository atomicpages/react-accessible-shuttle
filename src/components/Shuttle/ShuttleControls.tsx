import * as React from 'react';
import classNames from 'classnames';

import { ShuttleContext } from './ShuttleContext';
import { SHUTTLE_CONTROL_TYPES } from './reducers/index';

type ShuttleControlsProps = {
    children?: (args: {
        setShuttleState: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
        moveAllFromSource: () => void;
        moveAllFromTarget: () => void;
        moveSelectedFromSource: () => void;
        moveSelectedFromTarget: () => void;
    }) => React.ReactNode;
    className?: string;
};

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
export const ShuttleControls = React.memo(
    ({ children, className, ...rest }: ShuttleControlsProps) => {
        const { setShuttleState } = React.useContext(ShuttleContext);

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
            <div className={classNames('shuttle__controls', className)} {...rest}>
                {typeof children === 'function' ? (
                    children({
                        setShuttleState,
                        moveAllFromSource,
                        moveSelectedFromSource,
                        moveSelectedFromTarget,
                        moveAllFromTarget,
                    })
                ) : (
                    <>
                        <button onClick={moveAllFromSource}>{'\u00BB'}</button>
                        <button onClick={moveSelectedFromSource}>{'\u203A'}</button>
                        <button onClick={moveSelectedFromTarget}>{'\u2039'}</button>
                        <button onClick={moveAllFromTarget}>{'\u00AB'}</button>
                    </>
                )}
            </div>
        );
    }
);

ShuttleControls.displayName = 'Shuttle.Controls';
