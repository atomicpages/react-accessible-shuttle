import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { ShuttleContainer } from '../ShuttleContainer';

afterEach(cleanup);

describe('ShuttleContainer tests', () => {
  it('should contain data-name and other essential attributes', () => {
    jest.spyOn(React, 'useContext').mockReturnValue({ counter: { current: 1 } });

    const { container } = render(
      <ShuttleContainer data-testid="container">{() => <p>hello</p>}</ShuttleContainer>
    );

    expect(screen.getByTestId('container')).toHaveAttribute('data-name', 'target');
    expect(screen.getByTestId('container')).toHaveAttribute('role', 'listbox');
    expect(screen.getByTestId('container')).toHaveAttribute('tabindex', '0');

    expect(container).toMatchSnapshot();
  });
});
