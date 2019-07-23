import { ShuttleState } from "../components/Shuttle/Shuttle";

/**
 * Converts the source array to a Set.
 */
export function toSet(source: string[], length: number) {
    const set = new Set<number>();

    for (let i = 0; i < length; i++) {
        if (i < source.length && source[i]) {
            set.add(i);
        }
    }

    return set;
}

/**
 * Gets the index of the item based on the `textContent`
 * of the HTML Element. This is bad, we don't _want_ to
 * use this, but when `data-index` isn't present, we have to.
 */
export const getIndexFromItem = (e: HTMLElement, state: ShuttleState) => {
    warnOnce('Did you forget to pass getItemProps on each Shuttle.Item?');

    const container = e.closest('.shuttle__container');

    if (container) {
        const source = container.nextSibling;

        let index = -1;
        const text = e.textContent;
        const store = state[source ? 'source' : 'target'];

        for (let i = 0; i < store.length; i++) {
            if (text === store[i]) {
                index = i;
                break;
            }
        }

        return index;
    }

    return -1;
};

/**
 * Small warn wrapper.
 * @see https://github.com/i18next/react-i18next/blob/master/src/utils.js
 */
export function warn(...args: string[]) {
    if (console && console.warn) {
        if (typeof args[0] === 'string') {
            args[0] = `react-shuttle:: ${args[0]}`;
        }

        console.warn(...args);
    }
}

const alreadyWarned: { [key: string]: Date } = {};

/**
 * Warn about issues only once.
 * @see https://github.com/i18next/react-i18next/blob/master/src/utils.js
 */
export function warnOnce(...args: string[]) {
    if (typeof args[0] === 'string' && alreadyWarned[args[0]]) {
        return;
    }

    if (typeof args[0] === 'string') {
        alreadyWarned[args[0]] = new Date();
    }

    warn(...args);
}
