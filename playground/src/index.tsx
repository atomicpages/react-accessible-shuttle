import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Shuttle, useShuttleState } from '../../src/index';
import '../../src/styles/shuttle.scss';

if (process.env.NODE_ENV === 'development') {
    (function() {
        const div = document.createElement('div');
        div.id = 'root';

        document.body.appendChild(div);
    })();
}

function App() {
    const shuttle = useShuttleState({
        source: ['a', 'b', 'c'],
        target: ['d', 'e'],
    });

    return (
        <Shuttle {...shuttle}>
            <Shuttle.Container>
                {({ source, selected }, getItemProps) =>
                    source.map((item, index) => (
                        <Shuttle.Item
                            {...getItemProps(index)}
                            key={item}
                            value={item}
                            selected={selected.source.has(item)}>
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
                            selected={selected.target.has(item)}>
                            {item}
                        </Shuttle.Item>
                    ))
                }</Shuttle.Container>
        </Shuttle>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));
