import { SHUTTLE_CONTAINERS } from '../components/Shuttle/globals';

/**
 * Converts the source array to a Set.
 * Needed because IE 11 fails with `new Set([1,2,3])`.
 */
export function toSet<T>(source: T[]) {
    const set = new Set<T>();
    source.forEach(item => set.add(item));

    return set;
}

/**
 * Gets the index of the HTMLElement. As an escape hatch, if `data-index` was not passed
 * to the Shuttle.Item we will look through the list to find the item we want.
 */
export const getIndexFromItem = (target: HTMLDivElement) => {
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
export const getShuttleItem = (e: HTMLElement) => (e.closest('.shuttle__item') as HTMLDivElement);

export const removeDisabledIndexes = (collection: HTMLCollection, indexes: number[]) =>
    indexes.filter(
        index =>
            index >= 0 &&
            index < collection.length &&
            !collection[index].hasAttribute('data-disabled')
    );

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
