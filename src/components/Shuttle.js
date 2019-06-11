// @flow

import * as React from 'react';
import classNames from 'classnames';

import ShuttleItem from './ShuttleItem';
import ShuttleContainer from './ShuttleContainer';
import ShuttleControls from './ShuttleControls';
import Reducers from '../reducers/index';

import { ShuttleContext } from './ShuttleContext';

import {
    convertToSelectionModel,
    getIndexFromItem,
    warnOnce,
    warn,
} from '../utils/utils';

const UP_ARROW = 38;
const DOWN_ARROW = 40;

function init({ store, initialSelectedItems }) {
    const state = { store };

    if (!initialSelectedItems.source) {
        throw new Error('initialSelectedItems must contain source as an array');
    }

    if (!initialSelectedItems.target) {
        throw new Error('initialSelectedItems must contain target as an array');
    }

    state.selected = {
        source: convertToSelectionModel(
            initialSelectedItems.source,
            store.source.length
        ),
        target: convertToSelectionModel(
            initialSelectedItems.target,
            store.target.length
        ),
    };

    return state;
}

/**
 * The store model. This can be an array of whatever you need -- no model
 * massaging necessary!
 */
type Store = {
    source: Array<any>,
    target: Array<any>,
};

type Props = {
    /**
     * Children to render. When a function is provided, you are
     * given the store that can be rendered in a container.
     */
    children: React.Node | ((store: Store) => React.Node),

    /**
     * Pass additional class selectors to the shuttle
     * component.
     */
    className?: string,

    /**
     * The data you want the shuttle to know about. This is used internally
     * by the shuttle to handle reordering, drag-n-drop, etc.
     */
    store: Store,

    /**
     * An array of container names. Used for internal optimizations for click
     * and keyboard events. You probably won't need to use this prop, but in the
     * unlikely event you do need it, specify the name for each container
     * you render. **Order matters**, source is first; target is last.
     * @example
     * containers={['databases', 'selected_databases']}
     * containers={['todo', 'in_progress', 'completed']}
     */
    containers?: Array<string>,

    /**
     * Specify an array of booleans to indicate initial selected items.
     */
    initialSelectedItems: {|
        source: Array<boolean>,
        target: Array<boolean>,
    |},

    /**
     * Set false to disable user selection hack if it's causing problems
     * in your app.
     */
    enableUserSelectionHack: boolean,
};

function Shuttle({
    children,
    className,
    store,
    reducers,
    enableUserSelectionHack = true,
    initialSelectedItems = {
        source: [],
        target: [],
    },
    containers = ['source', 'target'],
    ...rest
}: Props) {
    const [state, dispatch] = React.useReducer(
        Reducers.ShuttleReducer,
        { store, initialSelectedItems },
        init
    );

    // a11y stuff
    const shiftKeyPressed = React.useRef(false);
    const ctrlKeyPressed = React.useRef(false);
    const metaKeyPressed = React.useRef(false);

    const handleItemClick = React.useCallback(e => {
        if (e.target.className.indexOf('shuttle__item') !== -1) {
            let index = e.target.hasAttribute('data-index')
                ? parseInt(e.target.getAttribute('data-index'), 10)
                : -1;

            try {
                const source =
                    e.target
                        .closest('.shuttle__container')
                        .getAttribute('data-name') === containers[0];

                if (isNaN(index) || index === -1) {
                    warnOnce(
                        'getItemProps not passed to Shuttle.Item. This should be added for a performance boost'
                    );

                    index = getIndexFromItem(e.target, state);
                }

                let type = `${source ? 'SOURCE' : 'TARGET'}_SELECTED`;
                const payload = { selections: index };

                if (ctrlKeyPressed.current || metaKeyPressed.current) {
                    type = `${source ? 'SOURCE' : 'TARGET'}_RANGE_SELECTED`;

                    payload.selections = Array.from(
                        state.selected[source ? 'source' : 'target'].selected
                    );

                    const foundIndex = payload.selections.indexOf(index);

                    if (foundIndex === -1) {
                        payload.selections.push(index);
                    } else {
                        payload.selections.splice(foundIndex, 1);
                    }
                } else if (shiftKeyPressed.current) {
                    type = `${source ? 'SOURCE' : 'TARGET'}_RANGE_SELECTED`;

                    payload.selections = Array.from(
                        state.selected[source ? 'source' : 'target'].selected
                    );

                    const peek = payload.selections[payload.selections.length - 1];

                    if (index < peek) {
                        for (let i = peek - 1; i >= 0; i--) {
                            payload.selections.push(i);
                        }
                    } else if (index > peek) {
                        for (let i = peek + 1; i <= index; i++) {
                            payload.selections.push(i);
                        }
                    }
                }

                dispatch({
                    type: `RESET_${source ? 'SOURCE' : 'TARGET'}_SELECTION`,
                });

                dispatch({ type, payload });
            } catch (e) {
                warn(e);
            }
        }
    }, []);

    const handleKeyDown = React.useCallback(e => {
        e.preventDefault();

        shiftKeyPressed.current = e.shiftKey;
        ctrlKeyPressed.current = e.ctrlKey;
        metaKeyPressed.current = e.metaKey;
    }, []);

    const handleKeyUp = React.useCallback(
        e => {
            e.preventDefault();

            shiftKeyPressed.current = e.shiftKey;
            ctrlKeyPressed.current = e.ctrlKey;
            metaKeyPressed.current = e.metaKey;

            if (e.keyCode === UP_ARROW || e.keyCode === DOWN_ARROW) {
                e.preventDefault();

                let index = e.target.hasAttribute('data-index')
                    ? parseInt(e.target.getAttribute('data-index'), 10)
                    : -1;

                const source =
                    e.target
                        .closest('.shuttle__container')
                        .getAttribute('data-name') === containers[0];

                const selectionAsArray = Array.from(
                    state.selected[source ? 'source' : 'target'].selected
                );

                const shuttle = e.currentTarget.querySelector(
                    `[data-name=${source ? 'source' : 'target'}]`
                );

                let type = 'SOURCE_SELECTED_BY_KEYBOARD';

                const payload: {
                    selections: number | number[],
                    direction: 'UP' | 'DOWN',
                } = {
                    selections: 0,
                    direction: e.keyCode === UP_ARROW ? 'UP' : 'DOWN',
                };

                if (!source) {
                    type = 'TARGET_SELECTED_BY_KEYBOARD';
                }

                if (shiftKeyPressed.current) {
                    type = `${source ? 'SOURCE' : 'TARGET'}_RANGE_SELECTED`;

                    payload.selections = [...selectionAsArray];

                    if (payload.selections.length) {
                        const peek =
                            payload.selections[payload.selections.length - 1];

                        if (e.keyCode === UP_ARROW) {
                            if (payload.selections.indexOf(peek - 1) === -1) {
                                payload.selections.push(peek - 1);
                                shuttle
                                    .querySelector(`[data-index="${peek - 1}"]`)
                                    .focus();
                            } else {
                                payload.selections.pop();
                            }
                        } else if (e.keyCode === DOWN_ARROW) {
                            if (payload.selections.indexOf(peek + 1) === -1) {
                                payload.selections.push(peek + 1);
                                shuttle
                                    .querySelector(`[data-index="${peek + 1}"]`)
                                    .focus();
                            } else {
                                payload.selections.pop();
                            }
                        }
                    }
                } else {
                    if (selectionAsArray.length === 1) {
                        payload.selections = selectionAsArray.pop();
                    }

                    if (e.keyCode === UP_ARROW) {
                        payload.selections--;
                    } else {
                        payload.selections++;
                    }

                    shuttle
                        .querySelector(`[data-index="${payload.selections}"]`)
                        .focus();
                }

                if (
                    payload.selections < 0 ||
                    payload.selections >=
                        state.store[source ? 'source' : 'target'].length
                ) {
                    return false;
                }

                dispatch({
                    type: `RESET_${source ? 'SOURCE' : 'TARGET'}_SELECTION`,
                });

                dispatch({ type, payload });
            }
        },
        [state]
    );

    return (
        <div
            className={classNames('shuttle', className)}
            onClick={handleItemClick}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
            role="presentation"
            {...rest}>
            <ShuttleContext.Provider
                value={{
                    state,
                    dispatch,
                    containers,
                    enableUserSelectionHack,
                }}>
                {typeof children === 'function' ? children(state) : children}
            </ShuttleContext.Provider>
        </div>
    );
}

Shuttle.Item = ShuttleItem;
Shuttle.Container = ShuttleContainer;
Shuttle.Controls = ShuttleControls;
Shuttle.Reducers = Reducers;

export default Shuttle;
