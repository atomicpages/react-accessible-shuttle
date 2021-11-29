import React from 'react';

import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import * as faker from 'faker';

import { Shuttle, useShuttleState, useShuttleKeyboardControls } from '../../../src/index';
import '../../../src/styles/shuttle.scss';

const state = {
  source: new Array(1000)
    .fill(null)
    .map(() => faker.fake('{{name.prefix}} {{name.lastName}} {{name.suffix}}, {{name.firstName}}')),
  target: new Array(1000)
    .fill(null)
    .map(() => faker.fake('{{name.prefix}} {{name.lastName}} {{name.suffix}}, {{name.firstName}}')),
};

const Row = ({ index, style, data }: { index: number; style: any; data: any }) => {
  return (
    <Shuttle.Item
      {...data.getItemProps(index)}
      value={data.source[index]}
      style={{
        ...style,
        height: 36,
        width: 232,
        padding: '0 5px',
        margin: 0,
      }}
      selected={data.selected.has(index)}>
      <span
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
        }}>
        {data.source[index]}
      </span>
    </Shuttle.Item>
  );
};

export function App(props: any) {
  const shuttle = useShuttleState(state);
  const controls = useShuttleKeyboardControls(shuttle);

  return (
    <>
      <p>
        Rolling DOM, otherwise known as virtualization, allows us to define a small amount of DOM
        nodes and recycle their instances. Instead of rendering 10K real DOM nodes in the browser we
        can render about 10 per container and reuse the HTMLElement instances.
      </p>
      <Shuttle {...shuttle} {...controls} enableUserSelectionHack>
        <Shuttle.Container>
          {({ source, selected }, getItemProps) => {
            return (
              <AutoSizer>
                {({ height, width }) => {
                  return (
                    <List
                      height={height}
                      width={width}
                      itemCount={source.length}
                      itemData={{
                        source,
                        selected: selected.source,
                        getItemProps,
                      }}
                      itemSize={36}>
                      {Row}
                    </List>
                  );
                }}
              </AutoSizer>
            );
          }}
        </Shuttle.Container>
        <Shuttle.Controls />
        <Shuttle.Container>
          {({ target, selected }, getItemProps) => (
            <AutoSizer>
              {({ height, width }) => {
                return (
                  <List
                    height={height}
                    width={width}
                    itemCount={target.length}
                    itemData={{
                      source: target,
                      selected: selected.target,
                      getItemProps,
                    }}
                    itemSize={36}>
                    {Row}
                  </List>
                );
              }}
            </AutoSizer>
          )}
        </Shuttle.Container>
      </Shuttle>
    </>
  );
}
