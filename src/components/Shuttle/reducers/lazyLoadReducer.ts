import { ShuttleState } from '../Shuttle';
import { init, InitArgs } from '../hooks/useShuttleState';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface LAZY_INITIALIZE_REDUCER_ACTION {
    type: 'LAZY_LOAD';
    data: InitArgs;
}

export const lazyLoad = (state: ShuttleState, action: LAZY_INITIALIZE_REDUCER_ACTION) => {
    if (action.type === 'LAZY_LOAD') {
        return init(action.data);
    }

    return { ...state };
};
