import * as React from 'react';
import classNames from 'classnames';
import { warnOnce } from '../../utils/utils';

type ShuttleItemProps = {
    /**
     * Children to pass into the shuttle item.
     * This can be any react node.
     */
    children: React.ReactNode;

    /**
     * Optional `className` values to pass to the
     * shuttle item.
     */
    className?: string;

    /**
     * Disable all click and keyboard events
     * on the shuttle item. This will also prevent
     * the shuttle item from moving to other containers.
     */
    disabled?: boolean;

    /**
     * Supply a meaningful value to the shuttle
     * item.
     */
    value: string;

    /**
     * Set the selection status of the shuttle item.
     */
    selected?: boolean;

    /**
     * Used for optimizing lookups on DOM nodes. This helps keep
     * react-shuttle super fast!
     */
    'data-index'?: number;
};

export const ShuttleItem = React.memo(function({
    children,
    className,
    disabled,
    value,
    selected,
    ...rest
}: ShuttleItemProps) {
    if (typeof rest['data-index'] !== 'number') {
        warnOnce('data-index is missing from Shuttle.Item. Did you forget to pass getItemProps to the item?');
    }

    return (
        <div
            className={classNames(
                'shuttle__item',
                { 'shuttle__item--disabled': disabled },
                { 'shuttle__item--selected': selected },
                className
            )}
            data-value={value}
            data-disabled={disabled || undefined}
            role="option"
            tabIndex={0}
            {...rest}>
            {children}
        </div>
    );
});

ShuttleItem.displayName = 'Shuttle.Item';
