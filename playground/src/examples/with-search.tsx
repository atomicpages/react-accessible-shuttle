import * as React from 'react';
import * as faker from 'faker';

import { Shuttle, useShuttleState, useShuttleKeyboardControls } from '../../../src/index';

const state = {
    source: new Array(100)
        .fill(null)
        .map(() =>
            faker.fake('{{name.prefix}} {{name.lastName}} {{name.suffix}}, {{name.firstName}}')
        ),
    target: new Array(50)
        .fill(null)
        .map(() =>
            faker.fake('{{name.prefix}} {{name.lastName}} {{name.suffix}}, {{name.firstName}}')
        ),
};

const CONTAINER_STYLES = {
    display: 'flex',
    'flex-direction': 'column',
};

const INPUT_STYLES = { marginBottom: '0.75rem', padding: '0.25rem' };

export function App(props: any) {
    const shuttle = useShuttleState(state);
    const controls = useShuttleKeyboardControls(shuttle);

    const [sourceFilter, setSourceFilter] = React.useState('');
    const [targetFilter, setTargetFilter] = React.useState('');

    const handleSourceFilterChange = React.useCallback(e => {
        setSourceFilter(e.currentTarget.value);
    }, []);

    const handleTargetFilterChange = React.useCallback(e => {
        setTargetFilter(e.currentTarget.value);
    }, []);

    return (
        <Shuttle {...shuttle} {...controls}>
            <div className="shuttle__container-wrapper" style={CONTAINER_STYLES}>
                <input
                    type="text"
                    onChange={handleSourceFilterChange}
                    value={sourceFilter}
                    placeholder="Filter source..."
                    style={INPUT_STYLES}
                />
                <Shuttle.Container>
                    {({ source, selected }, getItemProps) =>
                        source.map((item, index) => {
                            if (!sourceFilter || item.includes(sourceFilter)) {
                                return (
                                    <Shuttle.Item
                                        {...getItemProps(index)}
                                        key={item}
                                        value={item}
                                        selected={selected.source.has(item)}>
                                        {item}
                                    </Shuttle.Item>
                                );
                            }

                            return null;
                        })
                    }
                </Shuttle.Container>
            </div>
            <Shuttle.Controls />
            <div className="shuttle__container-wrapper" style={CONTAINER_STYLES}>
                <input
                    type="text"
                    onChange={handleTargetFilterChange}
                    value={targetFilter}
                    placeholder="Filter target..."
                    style={INPUT_STYLES}
                />
                <Shuttle.Container>
                    {({ target, selected }, getItemProps) =>
                        target.map((item, index) => {
                            if (!targetFilter || item.includes(targetFilter)) {
                                return (
                                    <Shuttle.Item
                                        {...getItemProps(index)}
                                        key={item}
                                        value={item}
                                        selected={selected.target.has(index)}>
                                        {item}
                                    </Shuttle.Item>
                                );
                            }

                            return null;
                        })
                    }
                </Shuttle.Container>
            </div>
        </Shuttle>
    );
}
