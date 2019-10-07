import * as React from 'react';
import { isPromise } from '../../../utils/utils';
import { InitialState } from './useShuttleState';

type State = {
    source: any[];
    target: any[];
};

/**
 * An internal hook to lazily set the state from a Promise
 * or something that is Promise A+ compliant. We really only
 * want this hook to run when the state is first initialized.
 */
export function useAsyncState(
    state: InitialState,
    setShuttleState: React.Dispatch<{
        [key: string]: any;
    }>
) {
    const resolved = React.useRef(false);

    React.useEffect(() => {
        if (isPromise(state) && !resolved.current) {
            (state as Promise<State>).then(data => {
                resolved.current = true;
                setShuttleState({ type: 'LAZY_LOAD', data });
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
