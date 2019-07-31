import * as React from 'react';

import { ShuttleState, ShuttleReducer } from '../Shuttle';
import { getIndexFromItem, getContainerMetadata } from '../../../utils/utils';
import { SHUTTLE_CONTROL_TYPES } from '../reducers/index';

type Options = {
    setShuttleState: (args: ShuttleReducer) => void;
    shuttleState: ShuttleState;
};

export function useShuttleItemClick({ setShuttleState, shuttleState }: Options) {
    const onClick = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLDivElement;

            if (target.className.includes('shuttle__item')) {
                const index = getIndexFromItem(target);
                const container = target.closest('.shuttle__container');

                if (container) {
                    const { source } = getContainerMetadata(container);
                    '';

                    const action = {
                        type: SHUTTLE_CONTROL_TYPES.SELECT_ITEM,
                        container: source ? 'source' : 'target',
                        index,
                    };

                    setShuttleState(action);
                }
            }
        },
        [shuttleState]
    );

    return { onClick };
}
