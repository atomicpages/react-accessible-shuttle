import { ShuttleState } from '../hooks/useShuttleState';

export { move } from './moveSelectedReducer';
export { moveAll } from './moveAllReducer';
export { selectItem } from './selectItemReducer';
export { lazyLoad } from './lazyLoadReducer';

export enum SHUTTLE_CONTROL_TYPES {
  MOVE_SELECTIONS = 'MOVE_SELECTIONS',
  MOVE_ALL = 'MOVE_ALL',
  SELECT_ITEM = 'SELECT_ITEM',
}

/**
 * Redux-style composeReducers function. The main difference here
 * is that this function operates on the _same_ slice of state
 * for _all_ reducer functions.
 * @param reducers An object of key: function pairs.
 * @see useShuttleState for usage and other configuration docs.
 */
export const composeReducers =
  (reducers: { [key: string]: any }) =>
  (state: ShuttleState, action: Record<string, any>): ShuttleState => {
    const result = { ...state };

    for (const key in reducers) {
      if (typeof reducers[key] !== 'function') {
        throw new Error(`Reducers must be functions. Saw ${typeof reducers[key]} for ${key}`);
      }

      Object.assign(result, reducers[key](result, action));
    }

    return { ...result };
  };
