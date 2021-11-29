import * as React from 'react';
import * as faker from 'faker';

import { Shuttle, useShuttleState, useShuttleKeyboardControls } from '../../../src/index';

const state = {
  source: new Array(25).fill(null).map(() => {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      prefix: faker.name.prefix(),
      suffix: faker.name.suffix(),
    };
  }),
  target: new Array(5).fill(null).map(() => {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      prefix: faker.name.prefix(),
      suffix: faker.name.suffix(),
    };
  }),
};

state.source.push({
  firstName: 'Dale',
  lastName: 'Borer',
  prefix: 'Dr.',
  suffix: 'III',
});

export function App(props: any) {
  const shuttle = useShuttleState(state, null, {
    source: [state.source[state.source.length - 1]],
    target: [],
  });

  const controls = useShuttleKeyboardControls(shuttle);

  return (
    <Shuttle {...shuttle} {...controls} enableUserSelectionHack>
      <Shuttle.Container>
        {({ source, disabled }, getItemProps) =>
          source.map((item, index) => (
            <Shuttle.Item
              {...getItemProps(index)}
              key={index}
              value={item}
              disabled={disabled.source.has(item)}>
              {`${item.prefix} ${item.lastName} ${item.suffix}, ${item.firstName}`}
            </Shuttle.Item>
          ))
        }
      </Shuttle.Container>
      <Shuttle.Controls />
      <Shuttle.Container>
        {({ target }, getItemProps) =>
          target.map((item, index) => (
            <Shuttle.Item {...getItemProps(index)} key={index} value={item}>
              {`${item.prefix} ${item.lastName} ${item.suffix}, ${item.firstName}`}
            </Shuttle.Item>
          ))
        }
      </Shuttle.Container>
    </Shuttle>
  );
}
