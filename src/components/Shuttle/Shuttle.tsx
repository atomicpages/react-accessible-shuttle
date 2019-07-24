import * as React from 'react';
import classNames from 'classnames';

import { ShuttleItem } from './ShuttleItem';
import { ShuttleContainer } from './ShuttleContainer';
import { ShuttleControls } from './ShuttleControls';
import { ShuttleContext } from './ShuttleContext';

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

type ShuttleProps = {
    /**
     * The state to pass to the Shuttle.
     */
    shuttleState: ShuttleState;

    /**
     * The set state function passed to the shuttle.
     */
    setShuttleState: (state: ShuttleState) => void;

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
};

export function Shuttle({
    shuttleState,
    setShuttleState,
    enableUserSelectionHack,
    className,
    children,
}: ShuttleProps) {
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
                role="presentation">
                {children}
            </div>
        </ShuttleContext.Provider>
    );
}

Shuttle.Item = ShuttleItem;
Shuttle.Container = ShuttleContainer;
Shuttle.Controls = ShuttleControls;
