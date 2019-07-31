import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import { ShuttleItem } from '../ShuttleItem';
afterEach(cleanup);

describe('ShuttleItem tests', () => {
    it('should render without errors', () => {
        const spy = jest.spyOn(global.console, 'warn');

        expect(() => {
            render(<ShuttleItem value="testing">Testing</ShuttleItem>);
        }).not.toThrow();

        expect(console.warn).toHaveBeenCalled();

        spy.mockRestore();
    });

    it('should match the snapshot', () => {
        const spy = jest.spyOn(global.console, 'warn');
        const { container } = render(<ShuttleItem data-index={1} value="foo">Foo</ShuttleItem>);

        expect(container).toMatchSnapshot();
        expect(console.warn).not.toHaveBeenCalled();

        spy.mockRestore();
    });
});
