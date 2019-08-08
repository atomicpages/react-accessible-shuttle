import * as React from 'react';
import { Shuttle, ShuttleState } from '../../Shuttle';
import { moveAll } from '../../reducers';
import { dummyState } from './stateGenerator';

export default class TestClassShuttle extends React.Component {
    public state: ShuttleState = {
        ...dummyState(),
        selected: {
            source: new Set(),
            target: new Set(),
        },
        disabled: {
            source: new Set(),
            target: new Set(),
        },
    };

    public handleMoveAllToTarget = () => {
        this.setState({
            ...moveAll(this.state, {
                type: 'MOVE_ALL',
                from: 'source',
                to: 'target',
            }),
        });
    };

    render() {
        return (
            <Shuttle shuttleState={this.state} setShuttleState={this.setState}>
                <Shuttle.Container data-testid="source_container">
                    {({ source, selected }: ShuttleState, getItemProps: (index: number) => Object) =>
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
                <Shuttle.Controls data-testid="controls">
                    {() => (
                        <>
                            <button className="move_all" onClick={this.handleMoveAllToTarget}>
                                Move All to Target
                            </button>
                        </>
                    )}
                </Shuttle.Controls>
                <Shuttle.Container data-testid="target_container">
                    {({ target, selected }: ShuttleState, getItemProps: (index: number) => Object) =>
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
}
