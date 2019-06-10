/**
 * Moves only the selected items from source
 * to the target. This mutates the existing array
 * for better performance.
 */
export const moveSelected = (from, to, selected) => {
    const entries = selected.entries();
    let i = 0;

    for (let [entry] of entries) {
        to.push(from.splice(entry, 1));
        from.push(null);
        i++;
    }

    from.length = from.length - i;
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
