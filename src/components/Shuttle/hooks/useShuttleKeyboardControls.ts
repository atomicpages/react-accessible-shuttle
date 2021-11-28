import * as React from 'react';
import { ShuttleReducer } from '../Shuttle';
import { useShuttleItemClick } from './useShuttleItemClick';
import { ShuttleState } from './useShuttleState';

import {
  getIndexFromItem,
  getContainerMetadata,
  removeDisabledIndexes,
  getShuttleItem,
  isContainer,
} from '../../../utils/utils';

import { SELECT_ITEM_REDUCER_ACTION } from '../reducers/selectItemReducer';

enum KEYS {
  END = 35,
  HOME = 36,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
}

type Options = {
  setShuttleState: (args: ShuttleReducer) => void;
  shuttleState: ShuttleState;
  useMeta?: boolean;
  useShift?: boolean;
};

const handleShiftKeyboardControl = (
  selectionArray: number[],
  increment: boolean,
  container: Element
) => {
  const lastItemInArray = selectionArray[selectionArray.length - 1];

  if (increment) {
    if (selectionArray.indexOf(lastItemInArray - 1) === -1) {
      selectionArray.push(lastItemInArray - 1);
    } else {
      selectionArray.pop();
    }
  } else {
    if (selectionArray.indexOf(lastItemInArray + 1) === -1) {
      selectionArray.push(lastItemInArray + 1);
    } else {
      selectionArray.pop();
    }
  }

  selectionArray = removeDisabledIndexes(container.children, selectionArray);

  return selectionArray;
};

const handleDefaultKeyboardControl = (
  selectionArray: number[],
  increment: boolean,
  shuttleItemParent: Element
): number => {
  let [index] = selectionArray;
  index = index + (increment ? -1 : 1);

  while (
    index >= 0 &&
    index < shuttleItemParent.children.length &&
    (shuttleItemParent.children[index] as HTMLElement).hasAttribute('data-disabled')
  ) {
    index = index + (increment ? -1 : 1);
  }

  return index;
};

export function useShuttleKeyboardControls({
  setShuttleState,
  shuttleState,
  useMeta = true,
  useShift = true,
}: Options) {
  const shiftKeyPressed = React.useRef(false);
  const ctrlKeyPressed = React.useRef(false);
  const metaKeyPressed = React.useRef(false);

  const { onClick: defaultClickHandler } = useShuttleItemClick({ setShuttleState, shuttleState });

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (useShift) {
        shiftKeyPressed.current = e.shiftKey;
      }

      if (useMeta) {
        ctrlKeyPressed.current = e.ctrlKey;
        metaKeyPressed.current = e.metaKey;
      }

      if (e.keyCode === KEYS.UP_ARROW || e.keyCode === KEYS.DOWN_ARROW) {
        e.preventDefault();
      }
    },
    [useMeta, useShift]
  );

  const onKeyUp = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (useShift) {
        shiftKeyPressed.current = e.shiftKey;
      }

      if (useMeta) {
        ctrlKeyPressed.current = e.ctrlKey;
        metaKeyPressed.current = e.metaKey;
      }

      // TODO: implement HOME and END keycodes support
      // https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-scrollable.html

      if (e.keyCode === KEYS.UP_ARROW || e.keyCode === KEYS.DOWN_ARROW) {
        e.preventDefault();

        const item = getShuttleItem(e.target as HTMLDivElement);

        if (isContainer(e.target as HTMLDivElement)) {
          const container = e.target as HTMLDivElement;
          const { containerName } = getContainerMetadata(container);

          setShuttleState({
            type: 'SELECT_ITEM',
            container: containerName,
            index: 0,
          });

          (container.children[0] as HTMLDivElement).focus();
        } else if (item && item.className.includes('shuttle__item')) {
          const itemIndex = getIndexFromItem(item);
          const increment = e.keyCode === KEYS.UP_ARROW;
          const container = item.closest('.shuttle__container');

          if (container) {
            // dereference the parent to shuttle__item in th event we're wrapping
            // or virtualizing the container
            const shuttleItemParent = item.parentElement || container;
            const { containerName } = getContainerMetadata(container);

            if (itemIndex >= 0 && itemIndex < shuttleState[containerName].length) {
              const selectionArray = Array.from(shuttleState.selected[containerName]);

              const payload: SELECT_ITEM_REDUCER_ACTION = {
                type: 'SELECT_ITEM',
                container: containerName,
              };

              if (shiftKeyPressed.current) {
                payload.index = handleShiftKeyboardControl(selectionArray, increment, container);

                (
                  shuttleItemParent.children[payload.index[payload.index.length - 1]] as HTMLElement
                ).focus();
              } else {
                payload.index = handleDefaultKeyboardControl(
                  selectionArray,
                  increment,
                  shuttleItemParent
                );

                if (payload.index < 0 || payload.index >= shuttleItemParent.children.length) {
                  return;
                }

                (shuttleItemParent.children[payload.index] as HTMLElement).focus();
              }

              setShuttleState(payload);
            }
          }
        }
      }
    },
    [setShuttleState, shuttleState, useMeta, useShift]
  );

  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (ctrlKeyPressed.current || metaKeyPressed.current || shiftKeyPressed.current) {
        const target = getShuttleItem(e.target as HTMLDivElement);

        if (target) {
          const index = getIndexFromItem(target);
          const container = target.closest('.shuttle__container');

          if (container) {
            const { containerName } = getContainerMetadata(container);

            const payload: SELECT_ITEM_REDUCER_ACTION = {
              type: 'SELECT_ITEM',
              container: containerName,
              index: Array.from(shuttleState.selected[containerName]),
            };

            let selectionArray = Array.from(shuttleState.selected[containerName]);
            const lastItemInArray = selectionArray[selectionArray.length - 1];

            if (shiftKeyPressed.current) {
              if (index < lastItemInArray) {
                let i = lastItemInArray;

                while (i-- > index) {
                  selectionArray.push(i);
                }
              } else if (index > lastItemInArray) {
                let i = lastItemInArray;

                while (i++ < index) {
                  selectionArray.push(i);
                }
              }

              selectionArray = removeDisabledIndexes(
                (target.parentElement && target.parentElement.children) || container.children,
                selectionArray
              );
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
        }
      } else {
        defaultClickHandler(e);
      }
    },
    [defaultClickHandler, setShuttleState, shuttleState.selected]
  );

  return { onKeyDown, onKeyUp, onClick };
}
