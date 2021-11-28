/* istanbul ignore file */
import { useShuttleState } from './components/Shuttle/hooks/useShuttleState';
import { useShuttleKeyboardControls } from './components/Shuttle/hooks/useShuttleKeyboardControls';
import { polyfill } from './utils/polyfills';

export * from './components/Shuttle/Shuttle';

export { useShuttleState, useShuttleKeyboardControls };
polyfill();
