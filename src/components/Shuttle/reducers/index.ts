import { ShuttleState } from '../Shuttle';

export { move } from './moveSelectedReducer';
export { moveAll } from './moveAllReducer';
export { selectItem } from './selectItemReducer';

export enum SHUTTLE_CONTROL_TYPES {
    MOVE_SELECTIONS = 'MOVE_SELECTIONS',
    MOVE_ALL = 'MOVE_ALL',
    SELECT_ITEM = 'SELECT_ITEM',
}

/**
 * Redux-style composeReducers function.
 * @param reducers An object of key: function pairs.
 * @see useShuttleState for usage and other configuration docs.
 */
export const composeReducers = (reducers: { [key: string]: Function }) => (
    state: ShuttleState,
    action?: any
) => {
    // @ts-ignore
    const result: ShuttleState = {};

    for (const key in reducers) {
        if (typeof reducers[key] !== 'function') {
            throw new Error(`Reducers must be functions. Saw ${typeof reducers[key]} for ${key}`);
        }

        Object.assign(result, reducers[key](state, action));
    }

    return result;
};
