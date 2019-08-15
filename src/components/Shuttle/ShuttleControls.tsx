import * as React from 'react';
import classNames from 'classnames';

import { ShuttleContext } from './ShuttleContext';
import { SHUTTLE_CONTROL_TYPES } from './reducers/index';

export interface ShuttleControlsProps {
    children?: (args: {
        setShuttleState: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
        moveAllFromSource: () => void;
        moveAllFromTarget: () => void;
        moveSelectedFromSource: () => void;
        moveSelectedFromTarget: () => void;
    }) => React.ReactNode;
    className?: string;
}

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
export const ShuttleControls: React.FunctionComponent<ShuttleControlsProps> = React.memo(
    ({ children, className, ...rest }: ShuttleControlsProps) => {
        const { setShuttleState, shuttleState } = React.useContext(ShuttleContext);

        const moveAllFromSource = React.useCallback(() => {
            setShuttleState({
                type: SHUTTLE_CONTROL_TYPES.MOVE_ALL,
                from: 'source',
                to: 'target',
            });
        }, [setShuttleState]);

        const moveAllFromTarget = React.useCallback(() => {
            setShuttleState({
                type: SHUTTLE_CONTROL_TYPES.MOVE_ALL,
                from: 'target',
                to: 'source',
            });
        }, [setShuttleState]);

        const moveSelectedFromSource = React.useCallback(() => {
            setShuttleState({
                type: SHUTTLE_CONTROL_TYPES.MOVE_SELECTIONS,
                from: 'source',
                to: 'target',
            });
        }, [setShuttleState]);

        const moveSelectedFromTarget = React.useCallback(() => {
            setShuttleState({
                type: SHUTTLE_CONTROL_TYPES.MOVE_SELECTIONS,
                from: 'target',
                to: 'source',
            });
        }, [setShuttleState]);

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
                        <button
                            title="Move All Items to Target"
                            aria-label="Move All Items to Target"
                            onClick={moveAllFromSource}>
                            {'\u00BB'}
                        </button>
                        <button
                            title="Move Selected Items to Target"
                            aria-label={`Move Selected Items to Target (${shuttleState.selected.source.size} items selected in source container)`}
                            onClick={moveSelectedFromSource}>
                            {'\u203A'}
                        </button>
                        <button
                            title="Move Selected Items to Source"
                            aria-label={`Move Selected Items to Target (${shuttleState.selected.target.size} items selected in target container)`}
                            onClick={moveSelectedFromTarget}>
                            {'\u2039'}
                        </button>
                        <button
                            title="Move All Items to Source"
                            aria-label="Move All Items to Source"
                            onClick={moveAllFromTarget}>
                            {'\u00AB'}
                        </button>
                    </>
                )}
            </div>
        );
    }
);

ShuttleControls.displayName = 'Shuttle.Controls';
