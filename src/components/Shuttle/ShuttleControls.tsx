import * as React from 'react';
import { classNames } from '../../utils/utils';

import { ShuttleContext } from './ShuttleContext';
import { SHUTTLE_CONTROL_TYPES } from './reducers/index';

export type ShuttleControlsProps = {
    children?: (args: {
        setShuttleState: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
        getButtonProps: (button: CONTROL_BUTTONS, size?: number) => Record<string, string>;
        moveAllFromSource: () => void;
        moveAllFromTarget: () => void;
        moveSelectedFromSource: () => void;
        moveSelectedFromTarget: () => void;
    }) => React.ReactNode;
    className?: string;
};

export enum CONTROL_BUTTONS {
    MOVE_ALL_TARGET = 'MOVE_ALL_TARGET',
    MOVE_SELECTED_TARGET = 'MOVE_SELECTED_TARGET',
    MOVE_SELECTED_SOURCE = 'MOVE_SELECTED_SOURCE',
    MOVE_ALL_SOURCE = 'MOVE_ALL_SOURCE',
}

const getButtonProps = (button: CONTROL_BUTTONS, size?: number): Record<string, string> => {
    const props = {
        moveAllToTarget: {
            title: 'Move All Items to Target',
            'aria-label': `Move All Items to Target`,
        },
        moveSelectedToTarget: {
            title: 'Move Selected Items to Target',
            'aria-label': `Move Selected Items to Target (${size} items selected in source container)`,
        },
        moveSelectedToSource: {
            title: 'Move Selected Items to Source',
            'aria-label': `Move Selected Items to Source (${size} items selected in target container)`,
        },
        moveAllToSource: {
            title: 'Move All Items to Source',
            'aria-label': `Move All Items to Source`,
        },
    };

    switch (button) {
        case CONTROL_BUTTONS.MOVE_ALL_TARGET:
            return props.moveAllToTarget;
        case CONTROL_BUTTONS.MOVE_SELECTED_TARGET:
            return props.moveSelectedToTarget;
        case CONTROL_BUTTONS.MOVE_SELECTED_SOURCE:
            return props.moveSelectedToSource;
        case CONTROL_BUTTONS.MOVE_ALL_SOURCE:
            return props.moveAllToSource;
    }

    return {};
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
export const ShuttleControls: React.FC<ShuttleControlsProps> = React.memo(
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
                        getButtonProps,
                        moveAllFromSource,
                        moveSelectedFromSource,
                        moveSelectedFromTarget,
                        moveAllFromTarget,
                    })
                ) : (
                    <>
                        <button
                            {...getButtonProps(CONTROL_BUTTONS.MOVE_ALL_TARGET)}
                            onClick={moveAllFromSource}>
                            {'\u00BB'}
                        </button>
                        <button
                            {...getButtonProps(
                                CONTROL_BUTTONS.MOVE_SELECTED_TARGET,
                                shuttleState.selected.source.size
                            )}
                            onClick={moveSelectedFromSource}>
                            {'\u203A'}
                        </button>
                        <button
                            {...getButtonProps(
                                CONTROL_BUTTONS.MOVE_SELECTED_SOURCE,
                                shuttleState.selected.source.size
                            )}
                            onClick={moveSelectedFromTarget}>
                            {'\u2039'}
                        </button>
                        <button
                            {...getButtonProps(CONTROL_BUTTONS.MOVE_ALL_SOURCE)}
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
