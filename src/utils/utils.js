/**
 * Selection model is an object that contains an array of selected
 * indexes and an array of deselected indexes.
 */
export function convertToSelectionModel(source, length) {
    const store = { selected: new Set() };

    for (let i = 0; i < length; i++) {
        if (i < source.length && source[i]) {
            store.selected.add(i);
        }
    }

    return store;
}

/**
 * Gets the index of the item based on the `textContent`
 * of the HTML Element. This is bad, we don't _want_ to
 * use this, but when `data-index` isn't present, we have to.
 */
export const getIndexFromItem = (e, state) => {
    const container = e.closest('.shuttle__container');
    const source = container.nextSibling;

    let index = -1;
    const text = e.textContent;
    const store = state.store[source ? 'source' : 'target'];

    for (let i = 0; i < store.length; i++) {
        if (text === store[i]) {
            index = i;
            break;
        }
    }

    return index;
};

/**
 * Small warn wrapper.
 * @see https://github.com/i18next/react-i18next/blob/master/src/utils.js
 */
export function warn(...args) {
    if (console && console.warn) {
        if (typeof args[0] === 'string') {
            args[0] = `react-shuttle:: ${args[0]}`;
        }

        console.warn(...args);
    }
}

const alreadyWarned = {};

/**
 * Warn about issues only once.
 * @see https://github.com/i18next/react-i18next/blob/master/src/utils.js
 */
export function warnOnce(...args) {
    if (typeof args[0] === 'string' && alreadyWarned[args[0]]) {
        return;
    }

    if (typeof args[0] === 'string') {
        alreadyWarned[args[0]] = new Date();
    }

    warn(...args);
}

export default {
    convertToSelectionModel,
    getIndexFromItem,
    warnOnce,
    warn,
};
