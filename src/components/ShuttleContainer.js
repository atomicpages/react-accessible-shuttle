// @flow

import * as React from 'react';
import classNames from 'classnames';

import { ShuttleContext } from './ShuttleContext';

let id_int = 0;

type Props = {
    children: (
        store: Array<Object>,
        selected: Array<Object>,
        getItemProps: Object
    ) => React.Node,
    className?: string,
};

/**
 * Pass a child render function or a render prop.
 */
function ShuttleContainer({ children, className, ...rest }: Props) {
    const { state, selected, containers } = React.useContext(ShuttleContext);

    // mod needed for HMR updates
    const id = React.useRef(
        containers[Math.floor(id_int++ % containers.length)]
    );

    /**
     * Pass the props to the item as you render it.
     * This is important to include since it contains
     * optimizations for click events on the shuttle
     * item.
     */
    const getItemProps = React.useCallback(index => {
        return {
            'data-index': index,
            selected: state.selected[id.current].selected.has(index)
        };
    }, [state]);

    return (
        <div
            className={classNames('shuttle__container', className)}
            role="listbox"
            {...rest}
            data-name={id.current}
            tabIndex="0">
            {children(state.store, state.selected, getItemProps)}
        </div>
    );
}

ShuttleContainer.displayName = 'Shuttle.Container';

export default React.memo(ShuttleContainer);
