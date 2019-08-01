import * as React from 'react';
import { render, cleanup, fireEvent, act, getByTestId } from '@testing-library/react';

import { Shuttle, ShuttleState } from '../Shuttle';
import { useShuttleState } from '../hooks/useShuttleState';
import { moveAll } from '../reducers/moveAllReducer';

const dummyState = () => {
    let i = 0;
    let j = 0;

    return {
        source: new Array(5).fill(null).map(() => i++),
        target: new Array(5).fill(null).map(() => j++),
    };
};

const TestShuttle = ({ state }: any) => {
    const shuttle = useShuttleState(state);

    return (
        <Shuttle {...shuttle}>
            <Shuttle.Container data-testid="source_container">
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
            <Shuttle.Controls data-testid="controls" />
            <Shuttle.Container data-testid="target_container">
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
};

afterEach(cleanup);

describe('Shuttle tests', () => {
    describe('Shuttle smoke test and other basic operations', () => {
        it('should render', () => {
            expect(() => {
                render(<TestShuttle state={dummyState()} />);
            }).not.toThrow();
        });

        it('should throw when source selections or target selections is not an array', () => {
            expect(() => {
                render(<TestShuttle state={{ selections: { source: 0 } }} />);
            }).toThrow();

            expect(() => {
                render(<TestShuttle state={{ selections: { source: [], target: 0 } }} />);
            }).toThrow();
        });

        it('should select items', () => {
            const { container, getByTestId } = render(<TestShuttle state={dummyState()} />);

            (getByTestId('source_container').children[0] as HTMLDivElement).click();
            expect(container).toMatchSnapshot();
        });
    });

    describe('Shuttle Controls work', () => {
        it('should shuttle all items to target', () => {
            const { getByTestId } = render(<TestShuttle state={dummyState()} />);
            const button = getByTestId('controls').querySelectorAll('button')[0];

            act(() => {
                if (button) {
                    fireEvent.click(button);
                }
            });

            expect(getByTestId('source_container').children.length).toEqual(0);
        });

        it('should shuttle all items to source', () => {
            const { getByTestId } = render(<TestShuttle state={dummyState()} />);
            const button = getByTestId('controls').querySelectorAll('button')[3];

            act(() => {
                if (button) {
                    fireEvent.click(button);
                }
            });

            expect(getByTestId('target_container').children.length).toEqual(0);
        });

        it('should shuttle selected items to source', () => {
            const { container } = render(<TestShuttle state={dummyState()} />);
            const button = getByTestId(container, 'controls').querySelectorAll('button')[1];

            (getByTestId(container, 'source_container').children[0] as HTMLDivElement).click();

            act(() => {
                if (button) {
                    fireEvent.click(button);
                }
            });

            expect(getByTestId(container, 'source_container').children.length).toEqual(4);
            expect(getByTestId(container, 'target_container').children.length).toEqual(6);
        });

        it('should shuttle selected items to target', () => {
            const { container } = render(<TestShuttle state={dummyState()} />);
            const button = getByTestId(container, 'controls').querySelectorAll('button')[2];

            (getByTestId(container, 'target_container').children[0] as HTMLDivElement).click();

            act(() => {
                if (button) {
                    fireEvent.click(button);
                }
            });

            expect(getByTestId(container, 'source_container').children.length).toEqual(6);
            expect(getByTestId(container, 'target_container').children.length).toEqual(4);
        });
    });

    describe('should work as a class component', () => {
        it('should function as a class component', () => {
            class Demo extends React.Component {
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

                constructor(props: any) {
                    super(props);
                }

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
                            <Shuttle.Controls data-testid="controls">
                                {() => (
                                    <>
                                        <button className="move_all" onClick={this.handleMoveAllToTarget}>Move All to Target</button>
                                    </>
                                )}
                            </Shuttle.Controls>
                            <Shuttle.Container data-testid="target_container">
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
            }

            const { getByTestId } = render(<Demo />);
            const button = getByTestId('controls').querySelector('.move_all');

            act(() => {
                if (button) {
                    fireEvent.click(button);
                }
            });

            expect(getByTestId('target_container').children.length).toEqual(10);
        });
    });
});
