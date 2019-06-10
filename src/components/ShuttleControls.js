// @flow

import * as React from 'react';
import { ShuttleContext } from './ShuttleContext';

type Props =
    | {| children: React.Node | (() => React.Node) |}
    | {| render: () => React.Node |};

/**
 * ShuttleControls. Provide your own render function
 * to customize the buttons. The Shuttle `dispatch` method
 * is provided or you can use your own state reducer
 * as needed.
 *
 * Exposed reducers:
 * 1. `MOVE_ALL_TO_TARGET`
 * 2. `MOVE_SELECTED_TO_TARGET`
 * 3. `MOVE_SELECTED_TO_SOURCE`
 * 4. `MOVE_ALL_TO_SOURCE`
 *
 * @example
 * // Custom render controls
 * <Shuttle.Controls render={dispatch => (
 *      <CustomButton onClick={() => dispatch({ type: 'MOVE_ALL_TO_TARGET' })} />
 * )} />
 */
function ShuttleControls({ children, render }: Props) {
    const { dispatch } = React.useContext(ShuttleContext);

    if (typeof children === 'function') {
        return children(dispatch);
    }

    if (typeof render === 'function') {
        return render(dispatch);
    }

    return (
        <div className="shuttle__controls">
            <button onClick={() => dispatch({ type: 'MOVE_ALL_TO_TARGET' })}>
                {'\u00BB'}
            </button>
            <button
                onClick={() => dispatch({ type: 'MOVE_SELECTED_TO_TARGET' })}>
                {'\u203A'}
            </button>
            <button
                onClick={() => dispatch({ type: 'MOVE_SELECTED_TO_SOURCE' })}>
                {'\u2039'}
            </button>
            <button onClick={() => dispatch({ type: 'MOVE_ALL_TO_SOURCE' })}>
                {'\u00AB'}
            </button>
        </div>
    );
}

ShuttleControls.displayName = 'Shuttle.Controls';

export default ShuttleControls;
