import * as React from 'react';
import * as faker from 'faker';

import { Shuttle, useShuttleState } from '../../../src/index';

const data = new Promise(resolve => {
  setTimeout(() => {
    const data = {
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

    resolve(data);
  }, 1500);
});

export function App(props: any) {
  // @ts-ignore
  const shuttle = useShuttleState(data);

  return (
    <Shuttle {...shuttle} enableUserSelectionHack>
      <Shuttle.Container>
        {({ source, disabled }, getItemProps) =>
          source.map((item, index) => (
            <Shuttle.Item
              {...getItemProps(index)}
              key={index}
              value={item}
              disabled={disabled.source.has(item)}
            >
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
