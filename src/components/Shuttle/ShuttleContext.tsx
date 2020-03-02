import React from 'react';
import { ShuttleState } from './hooks/useShuttleState';

type ShuttleContextType = {
    shuttleState: ShuttleState;
    setShuttleState: React.Dispatch<Record<string, any>>;
};

// @ts-ignore
export const ShuttleContext = React.createContext<ShuttleContextType>({});
