import { hot } from 'react-hot-loader/root';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Router, Link } from '@reach/router';

import { App as BasicShuttle } from './examples/basic-usage';
import { App as VirtualizedShuttle } from './examples/with-rolling-dom';

import '../../src/styles/shuttle.scss';

if (process.env.NODE_ENV === 'development') {
    (function() {
        const div = document.createElement('div');
        div.id = 'root';

        document.body.appendChild(div);
    })();
}

function Main() {
    return (
        <main>
            <p>Click on a pre-built example to begin</p>
            <nav>
                <Link to="/">Basic Usage</Link>{" "}
                <Link to="virtualized">Virtualized Shuttle</Link>
            </nav>
            <br />
            <Router>
                <BasicShuttle path="/" />
                <VirtualizedShuttle path="virtualized" />
            </Router>
        </main>
    );
}

const App = hot(Main);

ReactDOM.render(<App />, document.querySelector('#root'));
