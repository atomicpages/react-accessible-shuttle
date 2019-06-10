// @flow

import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.Node,
    className?: string,
    disabled?: boolean,
    value: string,
    selected: boolean
};

function ShuttleItem({
    children,
    className,
    disabled,
    value,
    selected,
    ...rest
}: Props) {
    return (
        <div
            className={classNames(
                'shuttle__item',
                { 'shuttle__item--disabled': disabled },
                { 'shuttle__item--selected': selected },
                className
            )}
            data-value={value}
            role="listitem"
            tabIndex="0"
            {...rest}
        >
            {children}
        </div>
    );
}

ShuttleItem.displayName = 'Shuttle.Item';

export default React.memo(ShuttleItem);
