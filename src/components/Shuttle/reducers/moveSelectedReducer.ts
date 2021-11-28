import { ShuttleState } from '../hooks/useShuttleState';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export type MOVE_SELECTION_REDUCER_ACTION = {
  type?: 'MOVE_SELECTIONS';
  from?: 'source' | 'target';
  to?: 'source' | 'target';
};

export const shuttleSelections = (from: any[], to: any[], selected: Set<number>): any[] => {
  const entries = selected.entries();

  for (const [entry] of entries) {
    to.push(from.splice(entry, 1, null)[0]);
  }

  return from.filter(Boolean);
};

export const move = (
  state: ShuttleState,
  action: MOVE_SELECTION_REDUCER_ACTION = {}
): ShuttleState => {
  if (action.type === 'MOVE_SELECTIONS') {
    if (!action.from || !action.to) {
      throw new Error(
        `Missing required actions: from: 'source' | 'target', to: 'source' | 'target'`
      );
    }

    state[action.from] = shuttleSelections(
      state[action.from],
      state[action.to],
      state.selected[action.from]
    );

    state.selected[action.from].clear();

    return { ...state };
  }

  return { ...state };
};
