import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import { ShuttleControls } from '../ShuttleControls';

afterEach(cleanup);

describe('ShuttleControls tests', () => {
    it('should allow customized rendering via child render function', () => {
        const { container } = render(
            <ShuttleControls>
                {({ moveAllFromSource, moveAllFromTarget }) => (
                    <>
                        <button onClick={moveAllFromSource}>Move All to Target</button>
                        <button onClick={moveAllFromTarget}>Move All to Source</button>
                    </>
                )}
            </ShuttleControls>
        );

        expect(container).toMatchSnapshot();
    });
});
