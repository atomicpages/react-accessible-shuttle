import * as React from 'react';

import { toSet } from '../../../utils/utils';
import { composeReducers, move, moveAll, selectItem, lazyLoad } from '../reducers/index';

import { ShuttleState } from '../Shuttle';
import { useAsyncState } from './useAsyncState';

interface InitialArrayType<T> {
    source: T[];
    target: T[];
}

export type InitialState = InitialArrayType<any> | Promise<InitialArrayType<any>>;
export type InitialSelections = InitialArrayType<number>;
export type DisabledSelections = InitialArrayType<any>;

export interface InitArgs {
    source: any[];
    target: any[];
    selections: InitialSelections;
    disabled: DisabledSelections;
}

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
    initialSelections: InitialSelections = {
        source: [],
        target: [],
    },
    disabled: DisabledSelections = {
        source: [],
        target: [],
    },
    reducers: { [key: string]: Function } = {}
) {
    const composedReducer = React.useCallback(
        composeReducers({ move, moveAll, selectItem, lazyLoad, ...reducers }),
        []
    );

    // TODO: fix the type errors
    // @ts-ignore
    const [shuttleState, setShuttleState] = React.useReducer(
        composedReducer,
        {
            ...initialState,
            // @ts-ignore
            disabled,
            selections: initialSelections,
        },
        init
    );

    useAsyncState(initialState, setShuttleState);

    return { shuttleState, setShuttleState };
}
