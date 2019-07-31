import * as React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';

// import '@testing-library/jest-dom/extend-expect';

import { Shuttle, useShuttleState } from '../../../index';

const dummyState = {
    source: new Array(5).fill(null).map(() => Math.round(Math.random() * 1000)),
    target: new Array(5).fill(null).map(() => Math.round(Math.random() * 1000)),
};

const TestShuttle = ({ state }: any) => {
    const shuttle = useShuttleState(state);

    return (
        <Shuttle {...shuttle} enableUserSelectionHack>
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
            <Shuttle.Controls data-testid="controls" />
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
};

afterEach(cleanup);

describe('Shuttle tests', () => {
    it('should render', () => {
        expect(() => {
            render(<TestShuttle state={dummyState} />);
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
        const { container, getByTestId } = render(<TestShuttle state={dummyState} />);

        const button = getByTestId("controls").querySelector('button');

        if (button) {
            fireEvent.click(button);
        }

        expect(container).toMatchSnapshot();
    });
});
