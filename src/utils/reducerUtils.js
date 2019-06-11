// @flow

/**
 * Removed falsy values form an array incrementally.
 *
 * Incrementally compact the array without iterating over every item in the source.
 * This method uses a little extra storage for a performance boost when reading
 * large lists.
 * @param {string[]} from
 * @param {string[]} to
 * @param {number[]} placeholders
 */
function incrementalCompact(from: string[], to: string[], placeholders: number[]) {
    for (let j = 0; j < placeholders.length; j++) {
        if (!from[placeholders[j]]) {
            from.splice(placeholders[j], 1);
        } else {
            // previous entry was removed so we need to percolate down
            for (let k = placeholders[j]; k >= 0; k--) {
                if (!from[k]) {
                    from.splice(k, 1);
                    break;
                }
            }
        }
    }
}

/**
 * Moves only the selected items from source
 * to the target. This mutates the existing array
 * for better performance.
 */
export const moveSelected = (from: string[], to: string[], selected: Set<number>) => {
    const entries = selected.entries();
    const placeholders: number[] = [];

    for (let entry of entries) {
        const index = entry[0];

        placeholders.push(index);
        to.push(from.splice(index, 1, null)[0]);
    }

    incrementalCompact(from, to, placeholders);
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
