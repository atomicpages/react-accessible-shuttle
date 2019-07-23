import * as React from 'react';
import classNames from 'classnames';

import { ShuttleItem } from './ShuttleItem';
import { ShuttleContainer } from './ShuttleContainer';
import { ShuttleControls } from './ShuttleControls';

import { toSet } from '../../utils/utils';
import { ShuttleContext } from './ShuttleContext';

// 1. Consumer passes state data via hook
// 2. Default reducers are created to handle user data
// 3. Consumer is _required_ to pass a children function since Shuttle
//    doesn't know how the items should be rendered (like Downshift)
// 4. Consumer can use various hooks to extend functionality of the Shuttle
//    this allows for modularity without HOCs.
//    a. useShuttleKeyboardControls - hooks up keyboard interactions
//    b. useShuttleReducer - allows consumers to listen for Shuttle dispatches via their own functions
//    c.

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
    children: React.ReactNode | React.ReactNode[];

    /**
     * Set false to disable user selection hack if it's causing problems
     * in your app.
     */
    enableUserSelectionHack?: boolean;
};

function init({
    source,
    target,
    selections = {
        source: [],
        target: [],
    },
}: {
    source: any[];
    target: any[];
    selections: {
        source: any[];
        target: any[];
    };
}) {
    if (!selections.source) {
        throw new Error('Initial selection "source" must be an array');
    }

    if (!selections.target) {
        throw new Error('Initial selection "target" must be an array');
    }

    return {
        source,
        target,
        selected: {
            source: toSet(selections.source, source.length),
            target: toSet(selections.target, target.length),
        },
    };
}

export function useShuttleState(
    initialState: {
        source: any[];
        target: any[];
    } = {
        source: [],
        target: [],
    },
    // @ts-ignore
    initialSelections: {
        source: string[];
        target: string[];
    } = {
        source: [],
        target: [],
    }
) {
    const [shuttleState, setShuttleState] = React.useReducer(
        (state: ShuttleState) => state,
        // @ts-ignore
        initialState,
        init
    );

    return { shuttleState, setShuttleState };
}

// expose all features as a series of hooks
// export const useShuttleKeyboardControls = () => null

export function Shuttle({ shuttleState, setShuttleState, className, children }: ShuttleProps) {
    return (
        <ShuttleContext.Provider value={{ shuttleState, setShuttleState }}>
            <div className={classNames('shuttle', className)} role="presentation">
                {children}
            </div>
        </ShuttleContext.Provider>
    );
}

Shuttle.Item = ShuttleItem;
Shuttle.Container = ShuttleContainer;
Shuttle.Controls = ShuttleControls;
