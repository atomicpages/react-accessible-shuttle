import * as React from 'react';
import { render, cleanup, fireEvent, act, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// resources for tests
import { dummyState } from './resources/stateGenerator';
import TestShuttle from './resources/TestShuttle';
import TestClassShuttle from './resources/TestClassShuttle';
import TestShuttleWithCustomReducer from './resources/TestShuttleWithCustomReducer';

afterEach(cleanup);

describe('Shuttle tests', () => {
  describe('Shuttle smoke test and other basic operations', () => {
    it('should render', () => {
      expect(() => {
        render(<TestShuttle state={dummyState()} />);
      }).not.toThrow();
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

      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();
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

      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();
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
      const { getByTestId } = render(<TestClassShuttle />);
      const button = getByTestId('controls').querySelector('.move_all');

      act(() => {
        if (button) {
          fireEvent.click(button);
        }
      });

      expect(getByTestId('target_container').children.length).toEqual(10);
    });
  });

  describe('should expose a reducer API', () => {
    it('should execute custom reducers', () => {
      const { container } = render(<TestShuttleWithCustomReducer />);
      getByTestId(container, 'source__container').click();
      expect(getByTestId(container, 'source__container').children[0]).toHaveClass(
        'shuttle__item--selected'
      );
    });
  });
});
