import { SHUTTLE_CONTAINERS } from '../components/Shuttle/globals';

/**
 * Converts the source array to a Set.
 * Needed because the polyfill for `new Set([1,2,3])` might fail.
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
