import { ShuttleState } from '../Shuttle';

export type MOVE_SELECTION_REDUCER_ACTION = {
    type?: 'MOVE_SELECTIONS';
    from?: 'source' | 'target';
    to?: 'source' | 'target';
};

const shuttleSelections = (from: any[], to: any[], selected: Set<number>) => {
    const entries = selected.entries();

    for (let entry of entries) {
        to.push(from.splice(entry[0], 1, null)[0]);
    }

    return from.filter(Boolean);
};

export const move = (state: ShuttleState, action: MOVE_SELECTION_REDUCER_ACTION = {}) => {
    if (action.type === 'MOVE_SELECTIONS') {
        if (!action.from || !action.to) {
            throw new Error(
                `Missing required actions: from: 'source' | 'target', to: 'source' | 'target'`
            );
        }

        const nextState = shuttleSelections(
            state[action.from],
            state[action.to],
            state.selected[action.to]
        );

        state.selected[action.to].clear();

        return {
            ...state,
            ...nextState,
        };
    }

    return { ...state };
};
