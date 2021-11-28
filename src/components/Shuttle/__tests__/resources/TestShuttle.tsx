import * as React from 'react';
import { Shuttle } from '../../Shuttle';
import { useShuttleState, ShuttleState } from '../../hooks/useShuttleState';

export default function TestShuttle({ state }: any) {
  const shuttle = useShuttleState(state);

  return (
    <Shuttle {...shuttle}>
      <Shuttle.Container data-testid="source_container">
        {(
          { source, selected }: ShuttleState,
          getItemProps: (index: number) => Record<string, any>
        ) =>
          source.map((item, index) => (
            <Shuttle.Item
              {...getItemProps(index)}
              key={item}
              value={item}
              selected={selected.source.has(index)}
            >
              {item}
            </Shuttle.Item>
          ))
        }
      </Shuttle.Container>
      <Shuttle.Controls data-testid="controls" />
      <Shuttle.Container data-testid="target_container">
        {(
          { target, selected }: ShuttleState,
          getItemProps: (index: number) => Record<string, any>
        ) =>
          target.map((item, index) => (
            <Shuttle.Item
              {...getItemProps(index)}
              key={item}
              value={item}
              selected={selected.target.has(index)}
            >
              {item}
            </Shuttle.Item>
          ))
        }
      </Shuttle.Container>
    </Shuttle>
  );
}
