/* istanbul ignore file */
import { useShuttleState } from './components/Shuttle/hooks/useShuttleState';
import { useShuttleKeyboardControls } from './components/Shuttle/hooks/useShuttleKeyboardControls';
import { Shuttle } from './components/Shuttle/Shuttle';
import { polyfill } from './utils/polyfills';

export { Shuttle, useShuttleState, useShuttleKeyboardControls };
polyfill();
