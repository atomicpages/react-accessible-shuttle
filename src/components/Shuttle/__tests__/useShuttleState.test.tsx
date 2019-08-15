import { renderHook } from '@testing-library/react-hooks';
import { useShuttleState } from '../hooks/useShuttleState';

describe('useShuttleState tests', () => {
    it('should throw when selections source is misconfigured', () => {
        const { result } = renderHook(() =>
            useShuttleState(
                {
                    source: [],
                    target: [],
                },
                // @ts-ignore
                {
                    source: null,
                    target: null,
                }
            )
        );

        expect(result.error).toBeDefined();
        expect(result.error.message).toContain('Initial selection "source" must be an array');
    });

    it('should throw when selections source is misconfigured', () => {
        const { result } = renderHook(() =>
            useShuttleState(
                {
                    source: [],
                    target: [],
                },
                // @ts-ignore
                {
                    source: [],
                    target: null,
                }
            )
        );

        expect(result.error).toBeDefined();
        expect(result.error.message).toContain('Initial selection "target" must be an array');
    });

    it('should return state and a dispatch when defined', () => {
        const { result } = renderHook(() =>
            useShuttleState({
                source: [],
                target: [],
            })
        );

        expect(result.current).toBeDefined();

        expect(result.current.shuttleState).toMatchObject({
            source: expect.any(Array),
            target: expect.any(Array),
            selected: {
                source: expect.any(Set),
                target: expect.any(Set),
            },
            disabled: {
                source: expect.any(Set),
                target: expect.any(Set),
            },
        });

        expect(result.current.setShuttleState).toBeInstanceOf(Function);
    });
});
