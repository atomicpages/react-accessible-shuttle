import React from 'react';
import { ShuttleState } from './Shuttle';

type ShuttleContextType = {
    shuttleState: ShuttleState;
    setShuttleState: (state: ShuttleState) => void;
};

// @ts-ignore
export const ShuttleContext = React.createContext<ShuttleContextType>({});
