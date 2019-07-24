import { ShuttleState } from '../Shuttle';

export type MOVE_SELECTION_REDUCER_ACTION = {
    type?: 'MOVE_ALL';
    from?: 'source' | 'target';
    to?: 'source' | 'target';
};

const shuttleAll = (from: any[], to: any[]) => {
    Array.prototype.push.apply(to, from);
    from.length = 0;
};

export const moveAll = (state: ShuttleState, action: MOVE_SELECTION_REDUCER_ACTION = {}) => {
    if (action.type === 'MOVE_ALL') {
        if (!action.from || !action.to) {
            throw new Error(
                `Missing required actions: from: 'source' | 'target', to: 'source' | 'target'`
            );
        }

        shuttleAll(state[action.from], state[action.to]);
        state.selected[action.to].clear();

        return { ...state };
    }

    return { ...state };
};
