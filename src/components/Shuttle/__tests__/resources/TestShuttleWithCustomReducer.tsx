import * as React from 'react';
import { Shuttle } from '../../Shuttle';
import { useShuttleState, ShuttleState } from '../../hooks/useShuttleState';

export default function TestShuttleWithCustomReducer() {
  const shuttle = useShuttleState(
    {
      source: ['a', 'b', 'c'],
      target: ['d', 'e', 'f'],
    },
    undefined,
    undefined,
    {
      selectFirstItem: (state: any, action: Record<string, any> = {}) => {
        if (action.type === 'SELECT_FIRST_ITEM') {
          if (action.container !== 'source' && action.container !== 'target') {
            throw new Error('Missing container from SELECT_FIRST_ITEM reducer');
          }

          if (!state[action.container].length) {
            console.warn(`Cannot apply selectFirstItem when ${action.container} is empty`);

            return { ...state };
          }

          if (!state.selected[action.container].size) {
            state.selected[action.container].add(0);
          }

          return { ...state };
        }

        return { ...state };
      },
    }
  );

  return (
    <Shuttle {...shuttle}>
      <Shuttle.Container
        data-testid="source__container"
        onClick={() => {
          (shuttle.setShuttleState as any)({
            type: 'SELECT_FIRST_ITEM',
            container: 'source',
          });
        }}>
        {(
          { source, selected }: ShuttleState,
          getItemProps: (index: number) => Record<string, any>
        ) =>
          source.map((item: any, index: number) => (
            <Shuttle.Item
              {...getItemProps(index)}
              key={item}
              value={item}
              selected={selected.source.has(index)}>
              {item}
            </Shuttle.Item>
          ))
        }
      </Shuttle.Container>
      <Shuttle.Controls />
      <Shuttle.Container>
        {(
          { target, selected }: ShuttleState,
          getItemProps: (index: number) => Record<string, any>
        ) =>
          target.map((item: any, index: number) => (
            <Shuttle.Item
              {...getItemProps(index)}
              key={item}
              value={item}
              selected={selected.target.has(index)}>
              {item}
            </Shuttle.Item>
          ))
        }
      </Shuttle.Container>
    </Shuttle>
  );
}
