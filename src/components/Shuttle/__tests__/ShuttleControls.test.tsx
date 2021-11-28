import * as React from 'react';
import { render, cleanup } from '@testing-library/react';

import { ShuttleControls, CONTROL_BUTTONS } from '../ShuttleControls';

afterEach(cleanup);

describe('ShuttleControls tests', () => {
  it('should allow customized rendering via child render function', () => {
    const { container } = render(
      <ShuttleControls>
        {({ moveAllFromSource, moveAllFromTarget, getButtonProps }) => (
          <>
            <button
              onClick={moveAllFromSource}
              {...getButtonProps(CONTROL_BUTTONS.MOVE_ALL_TARGET)}
            >
              Move All to Target
            </button>
            <button
              onClick={moveAllFromTarget}
              {...getButtonProps(CONTROL_BUTTONS.MOVE_ALL_SOURCE)}
            >
              Move All to Source
            </button>
          </>
        )}
      </ShuttleControls>
    );

    expect(container).toMatchSnapshot();
  });
});
