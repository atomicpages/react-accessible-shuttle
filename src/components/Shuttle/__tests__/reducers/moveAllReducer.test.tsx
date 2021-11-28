import { moveAll } from '../../reducers/moveAllReducer';
import { dummyState } from '../resources/stateGenerator';

const replicator = {
  selected: {
    source: new Set<number>(),
    target: new Set<number>(),
  },
  disabled: {
    source: new Set(),
    target: new Set(),
  },
};

describe('Move all reducer tests', () => {
  it('should work with basic state', () => {
    const state = {
      ...dummyState({ source: 1, target: 1 }),
      ...replicator,
    };

    const newState = moveAll(state, {
      type: 'MOVE_ALL',
      from: 'source',
      to: 'target',
    });

    expect(newState).toMatchObject({
      source: [],
      target: [0, 0],
    });
  });

  it('should work with complex state objects', () => {
    const state = {
      source: [{ a: 1 }, { a: 2 }],
      target: [{ a: 3 }],
      ...replicator,
    };

    const newState = moveAll(state, {
      type: 'MOVE_ALL',
      from: 'source',
      to: 'target',
    });

    expect(newState).toMatchObject({
      source: [],
      target: [{ a: 3 }, { a: 1 }, { a: 2 }],
    });
  });

  it('should work with items are disabled with simple items', () => {
    const state = {
      source: ['a', 'b', 'c'],
      target: ['d', 'e', 'f'],
      ...replicator,
      disabled: {
        source: new Set(['a', 'c']),
        target: new Set(),
      },
    };

    const newState = moveAll(state, {
      type: 'MOVE_ALL',
      from: 'source',
      to: 'target',
    });

    expect(newState).toMatchObject({
      source: ['a', 'c'],
      target: ['d', 'e', 'f', 'b'],
    });
  });

  it('should gracefully handle malformed disabled input', () => {
    const state = {
      source: ['a', 'b', 'c'],
      target: ['d', 'e', 'f'],
      ...replicator,
      disabled: {
        source: new Set(['a', 'b', 'c', 'd']),
        target: new Set(),
      },
    };

    const newState = moveAll(state, {
      type: 'MOVE_ALL',
      from: 'source',
      to: 'target',
    });

    expect(newState).toMatchObject({
      source: ['a', 'b', 'c'],
      target: ['d', 'e', 'f'],
    });
  });

  it('should throw an error when action is missing arguments', () => {
    expect(() => {
      moveAll(
        // @ts-ignore
        {},
        {
          type: 'MOVE_ALL',
          to: 'target',
        }
      );
    }).toThrow();
  });
});
