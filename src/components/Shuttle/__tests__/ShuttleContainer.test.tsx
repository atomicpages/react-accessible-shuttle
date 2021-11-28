import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { ShuttleContainer } from '../ShuttleContainer';

afterEach(cleanup);

describe('ShuttleContainer tests', () => {
  it('should render', () => {
    expect(() => {
      render(<ShuttleContainer>{() => <p>hello</p>}</ShuttleContainer>);
    }).not.toThrow();
  });

  it('should contain data-name and other essential attributes', () => {
    const { container, getByTestId } = render(
      <ShuttleContainer data-testid="container">{() => <p>hello</p>}</ShuttleContainer>
    );

    expect(getByTestId('container')).toHaveAttribute('data-name', 'target');
    expect(getByTestId('container')).toHaveAttribute('role', 'listbox');
    expect(getByTestId('container')).toHaveAttribute('tabindex', '0');

    expect(container).toMatchSnapshot();
  });
});
