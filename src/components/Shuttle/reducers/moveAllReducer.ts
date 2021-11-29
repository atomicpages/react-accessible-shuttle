import { ShuttleState } from '../hooks/useShuttleState';

export type MOVE_SELECTION_REDUCER_ACTION = {
  type?: 'MOVE_ALL';
  from?: 'source' | 'target';
  to?: 'source' | 'target';
};

/**
 * Compact an array safely and in-place. This function works
 * in conjunction with `shuttleAll`.
 */
export const compact = (list: number[], source: any[]): any[] => {
  // spread is overwhelmingly faster https://jsperf.com/array-allocation-perf/1
  const result = [...Array(list.length)];
  let pointer = 0;

  for (let i = 0; i < list.length; i++) {
    if (source[list[i]] !== null) {
      result[pointer++] = source[list[i]];
    }
  }

  return result;
};

/**
 * Shuttle all items from one array to another array. Specify blacklisted item indexes
 * to prevent those from being moved.
 */
export const shuttleAll = (from: any[], to: any[], disabled: Set<any>): any[] => {
  // this is way more optimal if there are no disabled items
  if (!disabled.size) {
    Array.prototype.push.apply(to, from);
    from.length = 0;
  } else if (disabled.size < from.length) {
    const disabledIndexes: number[] = [];

    for (let i = 0; i < from.length; i++) {
      if (!disabled.has(from[i])) {
        to.push(from.splice(i, 1, null)[0]);
      } else {
        disabledIndexes.push(i);
      }
    }

    return compact(disabledIndexes, from);
  }

  return from;
};

export const moveAll = (
  state: ShuttleState,
  action: MOVE_SELECTION_REDUCER_ACTION = {}
): ShuttleState => {
  if (action.type === 'MOVE_ALL') {
    if (!action.from || !action.to) {
      throw new Error(
        `Missing required reducer properties: { from: 'source' | 'target', to: 'source' | 'target' }`
      );
    }

    state[action.from] = shuttleAll(
      state[action.from],
      state[action.to],
      state.disabled[action.from]
    );

    state.selected[action.from].clear();

    return { ...state };
  }

  return { ...state };
};
