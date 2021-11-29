import * as React from 'react';

import { ShuttleItem } from './ShuttleItem';
import { ShuttleContainer } from './ShuttleContainer';
import { ShuttleControls } from './ShuttleControls';
import { ShuttleContext } from './ShuttleContext';
import { useShuttleItemClick } from './hooks/useShuttleItemClick';
import { classNames } from '../../utils/utils';
import { ShuttleState } from './hooks/useShuttleState';

export type ShuttleReducer = Record<string, any>;

type Statics = {
  Item: typeof ShuttleItem;
  Container: typeof ShuttleContainer;
  Controls: typeof ShuttleControls;
};

export type ShuttleProps = {
  /**
   * The state to pass to the Shuttle.
   */
  shuttleState: ShuttleState;

  /**
   * The set state function passed to the shuttle.
   * Internally this function is a `dispatch` from
   * `React.useReducer`. If you're not using the
   * `useShuttleState` hook you **must** provide
   * a dispatch-compatible function yourself.
   */
  setShuttleState: React.Dispatch<Record<string, any>>;

  /**
   * Optional classNames to pass to the shuttle.
   */
  className?: string;

  /**
   * Shuttle children to render.
   */
  children: React.ReactNode[];

  /**
   * Set false to disable user selection hack if it's causing problems
   * in your app.
   */
  enableUserSelectionHack?: boolean;
};

export const Shuttle: React.FC<ShuttleProps> & Statics = ({
  shuttleState,
  setShuttleState,
  enableUserSelectionHack = true,
  className,
  children,
  ...rest
}: ShuttleProps) => {
  const { onClick: defaultClickHandler } = useShuttleItemClick({ setShuttleState, shuttleState });

  return (
    <ShuttleContext.Provider value={{ shuttleState, setShuttleState }}>
      <div
        className={classNames(
          'shuttle',
          {
            'shuttle--ush': enableUserSelectionHack,
          },
          className
        )}
        role="presentation"
        onClick={defaultClickHandler}
        {...rest}>
        {children}
      </div>
    </ShuttleContext.Provider>
  );
};

Shuttle.Item = ShuttleItem;
Shuttle.Container = ShuttleContainer;
Shuttle.Controls = ShuttleControls;
