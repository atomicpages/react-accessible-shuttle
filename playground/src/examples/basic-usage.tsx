import * as React from 'react';

import * as faker from 'faker';

import { Shuttle, useShuttleState, useShuttleKeyboardControls } from '../../../src/index';

const state = {
    source: new Array(25)
        .fill(null)
        .map(() =>
            faker.fake('{{name.prefix}} {{name.lastName}} {{name.suffix}}, {{name.firstName}}')
        ),
    target: new Array(5)
        .fill(null)
        .map(() =>
            faker.fake('{{name.prefix}} {{name.lastName}} {{name.suffix}}, {{name.firstName}}')
        ),
};

state.source.push('Dr. Borer III, Dale');

export function App(props: any) {
    const shuttle = useShuttleState(state, null, {
        source: ['Dr. Borer III, Dale'],
        target: []
    });

    const controls = useShuttleKeyboardControls(shuttle);

    return (
        <Shuttle {...shuttle} {...controls} enableUserSelectionHack>
            <Shuttle.Container>
                {({ source, selected, disabled }, getItemProps) =>
                    source.map((item, index) => (
                        <Shuttle.Item
                            {...getItemProps(index)}
                            key={item}
                            value={item}
                            selected={selected.source.has(index)}
                            disabled={disabled.source.has(item)}>
                            {item}
                        </Shuttle.Item>
                    ))
                }
            </Shuttle.Container>
            <Shuttle.Controls />
            <Shuttle.Container>
                {({ target, selected }, getItemProps) =>
                    target.map((item, index) => (
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
