import { hot } from 'react-hot-loader/root';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Router, Link } from '@reach/router';

import { App as BasicShuttle } from './examples/basic-usage';
import { App as VirtualizedShuttle } from './examples/with-rolling-dom';
import { App as SearchShuttle } from './examples/with-search';
import { App as DragAndDropShuttle } from './examples/with-dnd';
import { App as AsyncLoadingShuttle } from './examples/async-loading';

import '../../src/styles/shuttle.scss';

function Main() {
    return (
        <main>
            <p>Click on a pre-built example to begin</p>
            <nav>
                <Link to="/">Basic Usage</Link> <Link to="virtualized">Virtualized Shuttle</Link>{' '}
                <Link to="search">Shuttle with Searching</Link>{' '}
                <Link to="dnd">Drag and Drop Shuttle</Link>{' '}
                <Link to="async-loading">Async Loading</Link>
            </nav>
            <br />
            <Router>
                <BasicShuttle path="/" />
                <VirtualizedShuttle path="virtualized" />
                <SearchShuttle path="search" />
                <DragAndDropShuttle path="dnd" />
                <AsyncLoadingShuttle path="async-loading" />
            </Router>
        </main>
    );
}

const App = hot(Main);

ReactDOM.render(<App />, document.querySelector('#root'));
