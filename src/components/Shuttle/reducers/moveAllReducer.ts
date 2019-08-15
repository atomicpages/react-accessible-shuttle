import { ShuttleState } from '../Shuttle';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface MOVE_SELECTION_REDUCER_ACTION {
    type?: 'MOVE_ALL';
    from?: 'source' | 'target';
    to?: 'source' | 'target';
}

/**
 * Compact an array safely and in-place. This function works
 * in conjunction with `shuttleAll`.
 */
export const compact = (list: number[], source: any[]) => {
    if (list.length !== source.length) {
        let pointer = 0;

        for (let i = 0; i < list.length; i++) {
            source[pointer++] = source[list[i]];
            source[list[i]] = null;
        }
    }
};

/**
 * Shuttle all items from one array to another array. Specify blacklisted item indexes
 * to prevent those from being moved.
 */
export const shuttleAll = (from: any[], to: any[], disabled: Set<any>) => {
    // this is way more optimal if there are no disabled items
    if (!disabled.size) {
        Array.prototype.push.apply(to, from);
        from.length = 0;
    } else {
        const disabledIndexes: number[] = [];

        for (let i = 0; i < from.length; i++) {
            if (!disabled.has(from[i])) {
                to.push(from.splice(i, 1, null)[0]);
            } else {
                disabledIndexes.push(i);
            }
        }

        compact(disabledIndexes, from);
        from.length = disabledIndexes.length;
    }
};

export const moveAll = (state: ShuttleState, action: MOVE_SELECTION_REDUCER_ACTION = {}) => {
    if (action.type === 'MOVE_ALL') {
        if (!action.from || !action.to) {
            throw new Error(
                `Missing required reducer properties: { from: 'source' | 'target', to: 'source' | 'target' }`
            );
        }

        shuttleAll(state[action.from], state[action.to], state.disabled[action.from]);
        state.selected[action.to].clear();

        return { ...state };
    }

    return { ...state };
};
