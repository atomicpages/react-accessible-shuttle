// globals only for Shuttle.Container
export const NUMBER_OF_CONTAINERS = 2;
export const SHUTTLE_CONTAINERS_ARRAY = ['source', 'target'];

/**
 * Global IDs of the containers. This allows us to quickly reference the containers
 * in the DOM in the event `getItemProps()` is not passed to `Shuttle.Item`.
 */
export enum SHUTTLE_CONTAINERS {
    SOURCE = 'source',
    TARGET = 'target',
}
