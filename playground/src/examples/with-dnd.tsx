import * as React from 'react';
import faker from 'faker';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Shuttle, useShuttleState, useShuttleKeyboardControls } from '../../../src/index';
import { ShuttleState } from '../../../src/components/Shuttle/hooks/useShuttleState';

const state = {
    source: new Array(25)
        .fill(null)
        .map(() =>
            faker.fake('{{name.prefix}} {{name.lastName}} {{name.suffix}}, {{name.firstName}}')
        ),
    target: new Array(25)
        .fill(null)
        .map(() =>
            faker.fake('{{name.prefix}} {{name.lastName}} {{name.suffix}}, {{name.firstName}}')
        ),
};

function recalculateSelectionIndex(set: Set<number>, base: number, mode: 'push' | 'pop' = 'pop') {
    const selectionsAsArray: number[] = Array.from(set);
    set.clear();

    selectionsAsArray.forEach(selection => {
        if (mode === 'pop') {
            if (selection < base) {
                set.add(selection);
            } else {
                set.add(selection - 1);
            }
        } else {
            if (selection > base) {
                set.add(selection + 1);
            } else {
                set.add(selection);
            }
        }
    });
}

function dragReducer(state: ShuttleState, action: any = {}) {
    if (action.type === 'DRAG_AND_DROP') {
        const { source, target } = action;

        const result = {
            ...state,
            source: [...state.source],
            target: [...state.target],
        };

        result.target.splice(target.index, 0, result.source.splice(source.index, 1)[0]);

        if (result.selected[source.droppableId].size) {
            recalculateSelectionIndex(
                result.selected[source.droppableId],
                source.index,
                source.droppableId === 'target' ? 'pop' : 'push'
            );
        }

        if (result.selected[target.droppableId].size) {
            recalculateSelectionIndex(
                result.selected[target.droppableId],
                target.index,
                target.droppableId === 'source' ? 'pop' : 'push'
            );
        }

        return { ...result };
    }

    return { ...state };
}

export function App(props: any) {
    const shuttle = useShuttleState(state, undefined, undefined, {
        dragReducer,
    });

    const controls = useShuttleKeyboardControls(shuttle);

    const onDragEnd = React.useCallback(result => {
        if (result.source.droppableId !== result.destination.droppableId) {
            shuttle.setShuttleState({
                type: 'DRAG_AND_DROP',
                source: result.source,
                target: result.destination,
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <Shuttle {...shuttle} {...controls}>
                    <Droppable droppableId="source">
                        {provided => (
                            <Shuttle.Container {...provided.droppableProps} ref={provided.innerRef}>
                                {({ source }, getItemProps) => {
                                    const result = source.map((item, index) => (
                                        <Draggable key={item} draggableId={item} index={index}>
                                            {provided => (
                                                <Shuttle.Item
                                                    {...getItemProps(index)}
                                                    key={item}
                                                    value={item}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    {item}
                                                </Shuttle.Item>
                                            )}
                                        </Draggable>
                                    ));

                                    // whacky usage, but this is required
                                    // https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/droppable.md
                                    result.push(
                                        React.cloneElement(provided.placeholder, {
                                            key: 'placeholder',
                                        })
                                    );

                                    return result;
                                }}
                            </Shuttle.Container>
                        )}
                    </Droppable>
                    <Shuttle.Controls />
                    <Droppable droppableId="target">
                        {provided => (
                            <Shuttle.Container {...provided.droppableProps} ref={provided.innerRef}>
                                {({ target }, getItemProps) => {
                                    const result = target.map((item, index) => (
                                        <Draggable key={item} draggableId={item} index={index}>
                                            {provided => (
                                                // @ts-ignore
                                                <Shuttle.Item
                                                    {...getItemProps(index)}
                                                    key={item}
                                                    value={item}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    {item}
                                                </Shuttle.Item>
                                            )}
                                        </Draggable>
                                    ));

                                    result.push(
                                        React.cloneElement(provided.placeholder, {
                                            key: 'placeholder',
                                        })
                                    );

                                    return result;
                                }}
                            </Shuttle.Container>
                        )}
                    </Droppable>
                </Shuttle>
            </DragDropContext>
        </>
    );
}
