import * as React from 'react';

import { toSet } from '../../../utils/utils';
import { composeReducers, move, moveAll, selectItem, lazyLoad } from '../reducers/index';
import { useAsyncState } from './useAsyncState';
import { InitialArrayType } from '../types';

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

    disabled: {
        /**
         * The source containers disabled items.
         */
        source: Set<any>;

        /**
         * The target container disabled items.
         */
        target: Set<any>;
    };
};

export type InitialState = InitialArrayType<any> | Promise<InitialArrayType<any>>;
export type InitialSelections = InitialArrayType<number>;
export type DisabledSelections = InitialArrayType<any>;

export type InitArgs = {
    source: any[];
    target: any[];
    selections: InitialSelections;
    disabled: DisabledSelections;
};

export function init({
    source = [],
    target = [],
    selections = {
        source: [],
        target: [],
    },
    disabled = {
        source: [],
        target: [],
    },
}: InitArgs): ShuttleState {
    if (!Array.isArray(selections.source)) {
        throw new Error('Initial selection "source" must be an array');
    }

    if (!Array.isArray(selections.target)) {
        throw new Error('Initial selection "target" must be an array');
    }

    return {
        source,
        target,
        selected: {
            source: toSet<number>(selections.source),
            target: toSet<number>(selections.target),
        },
        disabled: {
            source: toSet<any>(disabled.source),
            target: toSet<any>(disabled.target),
        },
    };
}

/**
 * useShuttleState allows you to own the state of the Shuttle. Pass in custom
 * data without trying to remember what prop needs to be set and with what params.
 * Save this result in a variable and spread ot back to `<Shuttle>`. Let the Shuttle
 * know:
 *
 * 1. What your data is
 * 2. What (if any) items need to be pre-selected
 * 3. What (if any) custom state reducers you want to process -- you can even override Shuttle state reducers here too!
 * @param initialState
 * @param initialSelections
 * @param reducers
 */
export function useShuttleState(
    initialState: InitialState = {
        source: [],
        target: [],
    },
    initialSelections?: InitialSelections,
    disabled?: DisabledSelections,
    reducers: Record<string, React.Reducer<ShuttleState, any>> = {}
) {
    const [shuttleState, setShuttleState] = React.useReducer(
        // eslint-disable-next-line react-hooks/exhaustive-deps
        React.useCallback(
            composeReducers({ move, moveAll, selectItem, lazyLoad, ...reducers }),
            []
        ),
        {
            ...initialState,
            // @ts-ignore
            disabled: disabled || {
                source: [],
                target: [],
            },
            selections: initialSelections || {
                source: [],
                target: [],
            },
        },
        init
    );

    useAsyncState(initialState, setShuttleState);

    return { shuttleState, setShuttleState };
}
