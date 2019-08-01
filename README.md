# React Accessible Shuttle

A tiny, zero dependency, shuttle (a.k.a list shuttle, dual listbox, etc.) implementation in React using hooks.

## Background

### Wait, What's a Shuttle?

A Shuttle, or list shuttle, is two containers that allow you to move items from a "source" to a "target". It's pretty rare in the wild, but great for business applications.

TODO: add animated gif

### Why?

Other implementations are great but they generally force you to massage your data into a model and are restrictive. Hooks allow you to send data to react accessible shuttle so it can internally manipulate things _without_ sacrificing your ability to control rendering of the shuttle items, controls, etc.

## Usage

### Installing

```bash
npm i react-accessible-shuttle
```

### Consuming

react-accessible-shuttle is a controlled component, but is flexible and adapts to your needs. Using it easy. Since you have _complete_ control over the rendering process, feel free to customize the layout to your liking!

```jsx
import React from 'react';
import { Shuttle, useShuttleState } from 'react-accessible-shuttle';

function App() {
    const shuttle = useShuttleState({
        source: ['a', 'b', 'c'],
        target: ['d', 'e', 'f'],
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
                            selected={selected.source.has(index)}>
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

ReactDOM.render(<App />, document.getElementById('app'));
```

If you're new to hooks, the example might seem verbose; however, we can easily abstract react-accessible-shuttle to take in a model and render on your behalf.

### Without Hooks

> **Note:** React 16.8 is a peer dependency of react-accessible-shuttle which means we can use hooks! However, if, for some reason, you find yourself stubbing 16.8 APIs so you can use newer stuff without upgrading, then you could possibly make things work :astonished:

Not on the hooks train yet? No worries. `react-accessible-shuttle` depends in React 16.8.0+ so if you have that, then you can use without hooks (i.e. in a `class` component) with a some extra effort :smiley: (although we should really use hooks because they make our live much easier).

Here are the things that need to be done:

-   Pass `selected` and `disabled` to state (`useShuttleState` generates these automatically for us)
-   Override `Shuttle.Controls` and manually construct `setState` calls. See [ShuttleControls.tsx](https://github.com/atomicpages/react-accessible-shuttle/blob/master/src/components/Shuttle/ShuttleControls.tsx) for code you can copy and paste or the example below.

If you're new to state reducing, this might seem mind-bending, but remember that we're using `this.setState` to pass information to a function that _returns_ our modified state.

```jsx
import React from 'react';
import { Shuttle, useShuttleState } from 'react-accessible-shuttle';

class App extends React.Component {
    state = {
        source: ['a', 'b', 'c'],
        target: ['d', 'e', 'f'],

        // you MUST provide these when using
        // class components
        selections: {
            source: new Set(),
            target: new Set(),
        },
        disabled: {
            source: new Set(),
            target: new Set(),
        },
    };

    this.moveAllFromSource = () => {
        this.setState({
            action: 'MOVE_ALL',
            from: 'source',
            to: 'target',
        });
    };

    this.moveSelectedFromSource = () => {
        this.setState({
            action: 'MOVE_SELECTIONS',
            from: 'source',
            to: 'target',
        });
    };

    this.moveSelectedFromTarget = () => {
        this.setState({
            action: 'MOVE_SELECTIONS',
            from: 'target',
            to: 'source',
        });
    };

    this.moveAllFromTarget = () => {
        this.setState({
            action: 'MOVE_ALL',
            from: 'target',
            to: 'source',
        });
    };

    render() {
        return (
            <Shuttle shuttleState={this.state} setShuttleState={this.setState}>
                <Shuttle.Container>
                    {/* ... */}
                </Shuttle.Container>
                <Shuttle.Controls>
                    {() => (
                        <>
                            <button onClick={this.moveAllFromSource}>{'\u00BB'}</button>
                            <button onClick={this.moveSelectedFromSource}>{'\u203A'}</button>
                            <button onClick={this.moveSelectedFromTarget}>{'\u2039'}</button>
                            <button onClick={this.moveAllFromTarget}>{'\u00AB'}</button>
                        </>
                    )}
                </Shuttle.Controls>
                <Shuttle.Container>
                    {/* ... */}
                </Shuttle.Container>
            </Shuttle>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

## How it Works

At a high level, react-accessible-shuttle uses state reducing to keep the code maintainable, while offering you the ability to override, extend, and enhance functionality without needing to create a PR for a new feature :smile:

`useShuttleState` is the entry point. This **pure** function takes in your data and outputs `shuttleState` and `setShuttleState` that are generated from `React.useReducer`. These are passed down to `Shuttle` and off we go.

### State Reducer API

If you're new to hooks, but familiar with Redux, then the concepts are the same. react-accessible-shuttle exposes each reducer function as a separate module, modifying the state as needed. react-accessible-shuttle uses a `composeReducers` redux-style function to combine all reducers. Like Redux, all reducers are executed when `setShuttleState` is called.

If you're brand new to state reducing, fear not! Reducer functions are just pure functions that take in `state` + some arguments and return the modified/unmodified state. Our extra arguments tell us useful information like what kind of action we're getting, additional information that helps us modify the state, debugging info, etc. How does this help? Read on!

### Passing Custom Reducers

`useShuttleState` takes in four arguments:

1. state
2. initialSelections - optional
3. disabled - optional
4. reducers - optional

We can pass custom reducers to enhance functionality pretty easily. Suppose if a container has no selection, but when clicked we want to select the first (0-ith) item in the array. Using state reducing, we can achieve this easily without bloating the Shuttle API:

```jsx
import React from 'react';
import { Shuttle, useShuttleState } from 'react-accessible-shuttle';

function App() {
    const shuttle = useShuttleState(
        {
            source: ['a', 'b', 'c'],
            target: ['d', 'e', 'f'],
        },
        null,
        null,
        reducers: {
            selectFirstItem: (state, action = {}) => {
                // ensure our reducer runs on the right type
                if (action.type === 'SELECT_FIRST_ITEM') {
                    // this is bad, since we use action.container to perform a lookup
                    // in the state object, it becomes critical that it's present
                    if (action.container !== 'source' || action.container !== 'target') {
                        throw new Error('Missing container from SELECT_FIRST_ITEM reducer');
                    }

                    // check if the container has nodes in it
                    if (!state[action.container].length) {
                        console.warn(`Cannot apply selectFirstItem when ${action.container} is empty`);
                        return { ...state };
                    }

                    // check if the container has any pre-selected items
                    // either by useShuttleState or user action
                    if (!state.selected[action.container].size) {
                        state.selected[action.container].add(0);
                    }

                    return { ...state };
                }

                // no change, return original state -- component will NOT re-render.
                return { ...state };
            }
        }
    );

    return (
        <Shuttle {...shuttle}>
            <Shuttle.Container onClick={() => {
                shuttle.setShuttleState(shuttle.state, {
                    type: 'SELECT_FIRST_ITEM',
                    container: 'source',
                });
            }}>
                {/* ... */}
            </Shuttle.Container>
            <Shuttle.Controls />
            <Shuttle.Container>
                {/* ... */}
            </Shuttle.Container>
        </Shuttle>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
```
