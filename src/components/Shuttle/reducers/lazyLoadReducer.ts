import { init, InitArgs, ShuttleState } from '../hooks/useShuttleState';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export type LAZY_INITIALIZE_REDUCER_ACTION = {
    type: 'LAZY_LOAD';
    data: InitArgs;
};

export const lazyLoad = (
    state: ShuttleState,
    action: LAZY_INITIALIZE_REDUCER_ACTION
): ShuttleState => {
    if (action.type === 'LAZY_LOAD') {
        return init(action.data);
    }

    return { ...state };
};
