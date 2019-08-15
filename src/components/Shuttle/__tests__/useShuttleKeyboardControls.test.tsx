import * as React from 'react';
import { render, cleanup, getByTestId, fireEvent } from '@testing-library/react';

import TestKbdShuttle from './resources/TestKbdShuttle';
import { dummyState } from './resources/stateGenerator';
import { act } from 'react-test-renderer';

import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

describe('useShuttleKeyboardControls tests', () => {
    it('should render without errors', () => {
        expect(() => {
            render(<TestKbdShuttle />);
        }).not.toThrow();
    });

    describe('useShuttleKeyboardControls basic keyboard controls', () => {
        it('should select the first item in the container when the down arrow is pressed', () => {
            const { container } = render(<TestKbdShuttle state={dummyState()} />);
            const sourceContainer = getByTestId(container, 'source_container');

            expect(sourceContainer).toBeDefined();

            act(() => {
                fireEvent.keyUp(sourceContainer, { key: 'ArrowDown', code: 40, keyCode: 40 });
            });

            expect(sourceContainer.children[0]).toHaveClass('shuttle__item--selected');
        });

        it('should select next and previous items when up/down arrow is used', () => {
            const { container } = render(<TestKbdShuttle state={dummyState()} />);
            const sourceContainer = getByTestId(container, 'source_container');

            act(() => {
                fireEvent.click(sourceContainer.children[0]);
            });

            expect(sourceContainer.children[0]).toHaveClass('shuttle__item--selected');

            act(() => {
                fireEvent.keyUp(sourceContainer.children[0], { key: 'ArrowDown', code: 40, keyCode: 40 });
            });

            expect(sourceContainer.children[0]).not.toHaveClass('shuttle__item--selected');
            expect(sourceContainer.children[1]).toHaveClass('shuttle__item--selected');

            act(() => {
                fireEvent.keyUp(sourceContainer.children[1], { key: 'ArrowUp', code: 38, keyCode: 38 });
            });

            expect(sourceContainer.children[0]).toHaveClass('shuttle__item--selected');
            expect(sourceContainer.children[1]).not.toHaveClass('shuttle__item--selected');
        });
    });

    describe('useShuttleKeyboardControls multiple selection using shift', () => {
        it('should select multiple items when shift + click is used', () => {
            const { container } = render(<TestKbdShuttle state={dummyState()} />);
            const sourceContainer = getByTestId(container, 'source_container');

            act(() => {
                fireEvent.click(sourceContainer.children[0]);
                fireEvent.keyDown(sourceContainer, { key: 'Shift', shiftKey: true });
                fireEvent.click(sourceContainer.children[3]);
            });

            for (let i = 0; i <= 3; i++) {
                expect(sourceContainer.children[i]).toHaveClass('shuttle__item--selected');
            }

            act(() => {
                fireEvent.click(sourceContainer.children[3]);
                fireEvent.keyDown(sourceContainer, { key: 'Shift', shiftKey: true });
                fireEvent.click(sourceContainer.children[0]);
            });

            for (let i = 0; i <= 3; i++) {
                expect(sourceContainer.children[i]).toHaveClass('shuttle__item--selected');
            }
        });

        it('should select multiple items when shift + arrow is used', () => {
            const { container } = render(<TestKbdShuttle state={dummyState()} />);
            const targetContainer = getByTestId(container, 'target_container');

            act(() => {
                fireEvent.click(targetContainer.children[0]);
                fireEvent.keyDown(targetContainer, { key: 'Shift', shiftKey: true });
                fireEvent.keyUp(targetContainer.children[0], { key: 'ArrowDown', code: 40, keyCode: 40, shiftKey: true });
                fireEvent.keyUp(targetContainer.children[0], { key: 'ArrowDown', code: 40, keyCode: 40, shiftKey: true });
            });

            for (let i = 0; i <= 2; i++) {
                expect(targetContainer.children[i]).toHaveClass('shuttle__item--selected');
            }
        });
    });
});
