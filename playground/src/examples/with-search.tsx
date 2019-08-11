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
            <div className="shuttle__container-wrapper">
                <input
                    type="text"
                    onChange={handleSourceFilterChange}
                    value={sourceFilter}
                    placeholder="Filter source..."
                />
                <Shuttle.Container>
                    {({ source, selected }, getItemProps) =>
                        source
                            // for large lists you'd want avoid filtering if sourceFilter is empty
                            .filter(item => item.indexOf(sourceFilter) !== -1)
                            .map((item, index) => (
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
            </div>
            <Shuttle.Controls />
            <div className="shuttle__container-wrapper">
                <input
                    type="text"
                    onChange={handleTargetFilterChange}
                    value={targetFilter}
                    placeholder="Filter target..."
                />
                <Shuttle.Container>
                    {({ target, selected }, getItemProps) =>
                        target
                            // for large lists you'd want avoid filtering if targetFilter is empty
                            .filter(item => item.indexOf(targetFilter) !== -1)
                            .map((item, index) => (
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
            </div>
        </Shuttle>
    );
}
