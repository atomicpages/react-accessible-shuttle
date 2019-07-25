import * as React from 'react';
import { ShuttleReducer, ShuttleState } from '../Shuttle';
import { useShuttleItemClick } from './useShuttleItemClick';
import { getIndexFromItem, getContainerMetadata } from '../../../utils/utils';
import { SELECT_ITEM_REDUCER_ACTION } from '../reducers/selectItemReducer';

enum ARROWS {
    UP_ARROW = 38,
    DOWN_ARROW = 40,
}

type Options = {
    setShuttleState: (args: ShuttleReducer) => void;
    shuttleState: ShuttleState;
};

export function useShuttleKeyboardControls({ setShuttleState, shuttleState }: Options) {
    const shiftKeyPressed = React.useRef(false);
    const ctrlKeyPressed = React.useRef(false);
    const metaKeyPressed = React.useRef(false);

    const { onClick: defaultClickHandler } = useShuttleItemClick({ setShuttleState, shuttleState });

    const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        shiftKeyPressed.current = e.shiftKey;
        ctrlKeyPressed.current = e.ctrlKey;
        metaKeyPressed.current = e.metaKey;
    }, []);

    const onKeyUp = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        shiftKeyPressed.current = e.shiftKey;
        ctrlKeyPressed.current = e.ctrlKey;
        metaKeyPressed.current = e.metaKey;

        if (e.keyCode === ARROWS.UP_ARROW || e.keyCode === ARROWS.DOWN_ARROW) {
            e.preventDefault(); // FIXME: might be redundant...

            const target = e.target as HTMLDivElement;

            if (target.className.indexOf('shuttle__item') !== -1) {
                const itemIndex = getIndexFromItem(target, shuttleState);
                const increment = e.keyCode === ARROWS.UP_ARROW;
                const container = target.closest('.shuttle__container');

                if (container) {
                    const { containerName } = getContainerMetadata(container);

                    if (itemIndex >= 0 && itemIndex < shuttleState[containerName].length) {
                        const selectionArray = Array.from(shuttleState.selected[containerName]);

                        const payload: SELECT_ITEM_REDUCER_ACTION = {
                            type: 'SELECT_ITEM',
                            container: containerName,
                        };

                        if (shiftKeyPressed.current) {
                            // TODO: implement...
                        } else {
                            const [index] = selectionArray;

                            if (index >= 0) {
                                payload.index = index + (increment ? -1 : 1);
                            }
                        }

                        // @ts-ignore
                        // container.children[itemIndex].focus();

                        setShuttleState(payload);
                    }
                }
            }
        }
    }, []);

    const onClick = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (ctrlKeyPressed.current || metaKeyPressed.current || shiftKeyPressed.current) {
                const target = e.target as HTMLDivElement;
                const index = getIndexFromItem(target, shuttleState);
                const container = target.closest('.shuttle__container');

                if (container) {
                    const { containerName } = getContainerMetadata(container);

                    const payload: SELECT_ITEM_REDUCER_ACTION = {
                        type: 'SELECT_ITEM',
                        container: containerName,
                        index: Array.from(shuttleState.selected[containerName]),
                    };

                    const selectionArray = Array.from(shuttleState.selected[containerName]);
                    const lastItemInArray = selectionArray[selectionArray.length - 1];

                    if (shiftKeyPressed.current) {
                        if (index < lastItemInArray) {
                            for (let i = lastItemInArray - 1; i >= 0; i--) {
                                selectionArray.push(i);
                            }
                        } else if (index > lastItemInArray) {
                            for (let i = lastItemInArray + 1; i <= index; i++) {
                                selectionArray.push(i);
                            }
                        }
                    } else {
                        const foundIndex = selectionArray.indexOf(index);

                        if (foundIndex === -1) {
                            selectionArray.push(index);
                        } else {
                            selectionArray.splice(foundIndex, 1);
                        }
                    }

                    payload.index = selectionArray;
                    setShuttleState(payload);
                }
            } else {
                defaultClickHandler(e);
            }
        },
        [defaultClickHandler]
    );

    return { onKeyDown, onKeyUp, onClick };
}
