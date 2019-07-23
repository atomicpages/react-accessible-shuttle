// @flow

import * as React from 'react';
import classNames from 'classnames';

import { ShuttleContext } from './ShuttleContext';
import { SHUTTLE_CONTAINERS } from './globals';
import { ShuttleState } from './Shuttle';

let id_int = 0;

type ShuttleContainerProps = {
    children: (
        store: ShuttleState,
        getItemProps: (index: number) => {
            'data-index': number,
            selected: boolean,
        }
    ) => React.ReactNode;
    className?: string;
};

/**
 * Pass a child render function or a render prop.
 */
export const ShuttleContainer = React.memo(function({
    children,
    className,
    ...rest
}: ShuttleContainerProps) {
    const { shuttleState } = React.useContext(ShuttleContext);

    // mod needed for HMR updates
    const id = React.useRef(SHUTTLE_CONTAINERS[Math.floor(id_int++ % SHUTTLE_CONTAINERS.length)]);

    /**
     * Pass the props to the item as you render it.
     * This is important to include since it contains
     * optimizations for click events on the shuttle
     * item.
     */
    const getItemProps = React.useCallback(
        index => {
            return {
                'data-index': index,
                selected: shuttleState.selected[id.current].has(index),
            };
        },
        [shuttleState]
    );

    return (
        <div
            className={classNames('shuttle__container', className)}
            role="listbox"
            {...rest}
            data-name={id.current}
            tabIndex={0}>
            {children(shuttleState, getItemProps)}
        </div>
    );
});

ShuttleContainer.displayName = 'Shuttle.Container';
