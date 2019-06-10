// @flow

import { moveSelected, moveAll } from '../utils/reducerUtils';

export default function ShuttleReducer(state, action) {
    switch (action.type) {
    case 'MOVE_SELECTED_TO_TARGET':
        if (state.selected.source.selected.size) {
            moveSelected(
                state.store.source,
                state.store.target,
                state.selected.source.selected
            );

            state.selected.source.selected.clear();

            return { ...state };
        }

        return state;
    case 'MOVE_SELECTED_TO_SOURCE':
        if (state.selected.target.selected.size) {
            moveSelected(
                state.store.target,
                state.store.source,
                state.selected.target.selected
            );

            state.selected.target.selected.clear();

            return { ...state };
        }

        return state;
    case 'MOVE_ALL_TO_TARGET':
        if (state.store.source.length) {
            moveAll(state.store.source, state.store.target);
            state.selected.source.selected.clear();

            return { ...state };
        }

        return state;
    case 'MOVE_ALL_TO_SOURCE':
        if (state.store.target.length) {
            moveAll(state.store.target, state.store.source);
            state.selected.target.selected.clear();

            return { ...state };
        }

        return state;
    case 'RESET_SOURCE_SELECTION':
        state.selected.source.selected.clear();

        return { ...state };
    case 'RESET_TARGET_SELECTION':
        state.selected.target.selected.clear();

        return { ...state };
    case 'SOURCE_SELECTED':
    case 'TARGET_SELECTED':
    case 'SOURCE_SELECTED_BY_KEYBOARD':
    case 'TARGET_SELECTED_BY_KEYBOARD': {
        const source =
                action.type.indexOf('SOURCE') !== -1 ? 'source' : 'target';

        if (action.payload.selections > -1) {
            state.selected[source].selected.add(action.payload.selections);

            return { ...state };
        }

        return state;
    }
    case 'SOURCE_RANGE_SELECTED':
    case 'TARGET_RANGE_SELECTED': {
        const source =
                action.type.indexOf('SOURCE') !== -1 ? 'source' : 'target';

        if (
            Array.isArray(action.payload.selections) &&
                action.payload.selections.length
        ) {
            action.payload.selections.forEach(index =>
                state.selected[source].selected.add(index)
            );

            return { ...state };
        }

        return state;
    }
    default:
        return state;
    }
}
