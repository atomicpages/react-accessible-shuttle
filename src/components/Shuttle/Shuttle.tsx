import * as React from 'react';
import classNames from 'classnames';

import { ShuttleItem } from './ShuttleItem';
import { ShuttleContainer } from './ShuttleContainer';
import { ShuttleControls } from './ShuttleControls';
import { ShuttleContext } from './ShuttleContext';
import { useShuttleItemClick } from './hooks/useShuttleItemClick';

export type ShuttleState = {
    /**
     * The source container data as an array.
     */
    source: any[];

    /**
     * The target container data as an array.
     */
    target: any[];

    /**
     * The selection indexes used for quickly applying classNames.
     */
    selected: {
        /**
         * The source containers selections.
         */
        source: Set<number>;

        /**
         * The target container selections.
         */
        target: Set<number>;
    };
};

export type ShuttleReducer = { [key: string]: any };

type ShuttleProps = {
    /**
     * The state to pass to the Shuttle.
     */
    shuttleState: ShuttleState;

    /**
     * The set state function passed to the shuttle.
     * Internally this function is a `dispatch` from
     * `React.useReducer`. If you're not using the
     * `useShuttleState` hook you **must** provide
     * a dispatch-compatible function yourself.
     */
    setShuttleState: (state: ShuttleReducer) => void;

    /**
     * Optional classNames to pass to the shuttle.
     */
    className?: string;

    /**
     * Shuttle children to render.
     */
    children: React.ReactNode[];

    /**
     * Set false to disable user selection hack if it's causing problems
     * in your app.
     */
    enableUserSelectionHack?: boolean;

    onClick?: (e: React.MouseEvent) => void;
};

export function Shuttle({
    shuttleState,
    setShuttleState,
    enableUserSelectionHack,
    className,
    children,
    onClick,
    ...rest
}: ShuttleProps) {
    const { onClick: defaultClickHandler } = useShuttleItemClick({ setShuttleState, shuttleState });

    return (
        <ShuttleContext.Provider value={{ shuttleState, setShuttleState }}>
            <div
                className={classNames(
                    'shuttle',
                    {
                        'shuttle--ush': enableUserSelectionHack,
                    },
                    className
                )}
                role="presentation"
                onClick={onClick || defaultClickHandler}
                {...rest}>
                {children}
            </div>
        </ShuttleContext.Provider>
    );
}

Shuttle.Item = ShuttleItem;
Shuttle.Container = ShuttleContainer;
Shuttle.Controls = ShuttleControls;
