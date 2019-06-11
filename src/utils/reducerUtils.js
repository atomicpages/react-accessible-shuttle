// @flow

import compact from 'lodash.compact';

/**
 * Moves only the selected items from source
 * to the target. This mutates the existing array
 * for better performance.
 */
export const moveSelected = (
    from: string[],
    to: string[],
    selected: Set<number>
) => {
    const entries = selected.entries();
    const placeholders: number[] = [];

    for (let entry of entries) {
        const index = entry[0];

        placeholders.push(index);
        to.push(from.splice(index, 1, null)[0]);
    }

    // @see https://jsperf.com/inc-compact
    return compact(from);
};

/**
 * Super fast in-place array manipulation. Prevents
 * bottlenecks when pushing large amounts of data.
 */
export const moveAll = (from, to) => {
    Array.prototype.push.apply(to, from);
    from.length = 0;
};

export default {
    moveSelected,
    moveAll,
};
