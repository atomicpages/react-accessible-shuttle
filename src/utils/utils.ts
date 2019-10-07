import { SHUTTLE_CONTAINERS } from '../components/Shuttle/globals';

/**
 * A contrived implementation of classNames. This allows
 * react-accessible-shuttle to have zero dependencies.
 */
export function classNames(...args: any[]): string {
    let selectors = '';

    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] === 'string') {
            selectors += ` ${args[i]}`;
        } else if (Array.isArray(args[i])) {
            selectors += args[i].join(' ');
        } else if (typeof args[i] === 'object') {
            selectors += ' ';

            selectors += Object.keys(args[i])
                .filter(key => {
                    if (args[i][key]) {
                        return args[i][key];
                    }
                })
                .join(' ');
        }
    }

    return selectors.trim();
}

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

/**
 * Converts the source array to a Set.
 * Needed because IE 11 fails with `new Set([1,2,3])`.
 */
export function toSet<T>(source: T[]): Set<T> {
    const set = new Set<T>();
    source.forEach(item => set.add(item));

    return set;
}

/**
 * Filters only visible items. This happens when the selection array is
 * greater than the collection length.
 * @see removeDisabledIndexes for usage
 */
const filterVisibleItems = (collection: HTMLCollection, indexes: number[]): number[] => {
    const set = toSet<number>(indexes);
    const matches: number[] = [];

    for (let i = 0; i < collection.length; i++) {
        const index = collection[i].getAttribute('data-index');
        const disabled = collection[i].hasAttribute('data-disabled');

        if (!disabled && index && set.has(parseInt(index))) {
            matches.push(parseInt(index));
        }
    }

    return matches;
};

/**
 * Gets the index of the HTMLElement. As an escape hatch, if `data-index` was not passed
 * to the Shuttle.Item we will look through the list to find the item we want.
 */
export const getIndexFromItem = (target: HTMLDivElement): number => {
    if (!target.hasAttribute('data-index')) {
        warnOnce(
            'Did you forget to pass getItemProps on each Shuttle.Item? This is sever impact on performance.'
        );

        const container = target.closest('.shuttle__container');

        if (container) {
            let node: Element | null = target;
            let index = 0;

            while ((node = node.previousElementSibling)) {
                index++;
            }

            return index;
        }

        return -1;
    }

    const index = parseInt(target.getAttribute('data-index') || '', 10);

    return isNaN(index) ? -1 : index;
};

/**
 * Gets the shuttle item from the DOM since consumers can render whatever
 * they want inside the item itself, we might need to look up the DOM tree
 * to get the HTMLElement.
 */
export const getShuttleItem = (e: HTMLElement): HTMLDivElement | null =>
    e.closest('.shuttle__item') as HTMLDivElement;

export const removeDisabledIndexes = (collection: HTMLCollection, indexes: number[]) => {
    if (collection.length < indexes.length) {
        return filterVisibleItems(collection, indexes);
    }

    // FIXME: DOM nodes should not hold state. If the disabled items needs to be updated
    // consumers should update the set themselves

    return indexes.filter(
        index =>
            index >= 0 &&
            index < collection.length &&
            !collection[index].hasAttribute('data-disabled')
    );
};

/**
 * Gets relevant metadata from the container including
 * if the container is the source or target and the name
 * of the container.
 */
export const getContainerMetadata = (container: Element) => {
    const source = container.getAttribute('data-name') === SHUTTLE_CONTAINERS.SOURCE;
    const containerName = (source && SHUTTLE_CONTAINERS.SOURCE) || SHUTTLE_CONTAINERS.TARGET;

    return { source, containerName };
};

export const isContainer = (container: HTMLDivElement) => {
    const bool = container.hasAttribute('data-name');
    const name = container.getAttribute('data-name');

    return bool && (name === SHUTTLE_CONTAINERS.SOURCE || name === SHUTTLE_CONTAINERS.TARGET);
};

/**
 *
 * @see https://github.com/then/is-promise/blob/master/index.js
 */
export function isPromise(obj: any) {
    return (
        !!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function'
    );
}
