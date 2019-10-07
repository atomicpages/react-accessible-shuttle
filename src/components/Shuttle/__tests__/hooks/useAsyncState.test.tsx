import { renderHook, act } from '@testing-library/react-hooks';
import { useAsyncState } from '../../hooks/useAsyncState';
import { useShuttleState } from '../../hooks/useShuttleState';
import { Promise as BluebirdPromise } from 'bluebird';

type State = {
    source: any[];
    target: any[];
};

const mockState = {
    source: [1, 2, 3],
    target: [4, 5, 6],
};

const mockPromise = () => jest.fn().mockResolvedValue(mockState);

const realPromise = (): Promise<State> =>
    new Promise(resolve => {
        act(() => {
            resolve(mockState);
        });
    });

const realBlurBird = (): Promise<State> =>
    new BluebirdPromise(resolve => {
        act(() => {
            resolve(mockState);
        });
    });

describe('useAsyncState tests', () => {
    it('should work without errors', () => {
        expect(() => {
            const { result } = renderHook(() => useShuttleState());

            renderHook(() => {
                // @ts-ignore
                return useAsyncState(mockPromise(), result.current.setShuttleState);
            });
        }).not.toThrow();
    });

    it('should update the state when the promise is resolved', async () => {
        const setShuttleState = jest.fn();
        const promise = realPromise();

        renderHook(() => useAsyncState(promise, setShuttleState));
        await promise;

        expect(setShuttleState).toHaveBeenCalled();
        expect(setShuttleState).toHaveBeenCalledWith({
            type: 'LAZY_LOAD',
            data: expect.objectContaining(mockState),
        });
    });

    it('should work with native async/await', async () => {
        const setShuttleState = jest.fn();

        const mockAsync = async () => {
            return await realPromise();
        };

        const promise = mockAsync();

        // @ts-ignore
        renderHook(() => useAsyncState(promise, setShuttleState));
        await promise;

        expect(setShuttleState).toHaveBeenCalled();
        expect(setShuttleState).toHaveBeenCalledWith({
            type: 'LAZY_LOAD',
            data: expect.objectContaining(mockState),
        });
    });

    it('should work with non-native Promise A+ implementations', async () => {
        const setShuttleState = jest.fn();
        const promise = realBlurBird();

        renderHook(() => useAsyncState(promise, setShuttleState));
        await promise;

        expect(setShuttleState).toHaveBeenCalled();
        expect(setShuttleState).toHaveBeenCalledWith({
            type: 'LAZY_LOAD',
            data: expect.objectContaining(mockState),
        });
    });
});
