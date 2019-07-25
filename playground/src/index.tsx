import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as faker from 'faker';

import { Shuttle, useShuttleState, useShuttleKeyboardControls } from '../../src/index';
import '../../src/styles/shuttle.scss';

if (process.env.NODE_ENV === 'development') {
    (function() {
        const div = document.createElement('div');
        div.id = 'root';

        document.body.appendChild(div);
    })();
}

const start = performance.now();

const state = {
    source: new Array(100).fill(null).map(() => faker.fake('{{name.lastName}}, {{name.firstName}}')),
    target: new Array(25).fill(null).map(() => faker.fake('{{name.lastName}}, {{name.firstName}}')),
};

const end = performance.now() - start;

console.log(`Data generation offset ${Number(end).toFixed(4)}ms`);

function App() {
    const shuttle = useShuttleState(state);

    const controls = useShuttleKeyboardControls(shuttle);

    return (
        <Shuttle {...shuttle} {...controls} enableUserSelectionHack>
            <Shuttle.Container>
                {({ source, selected }, getItemProps) =>
                    source.map((item, index) => (
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
            <Shuttle.Container>{({ target, selected }, getItemProps) =>
                    target.map((item, index) => (
                        <Shuttle.Item
                            {...getItemProps(index)}
                            key={item}
                            value={item}
                            selected={selected.target.has(index)}>
                            {item}
                        </Shuttle.Item>
                    ))
                }</Shuttle.Container>
        </Shuttle>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));
