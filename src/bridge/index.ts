import { BRIDGE_KEY, type MudanzifyBridge } from './contract';

declare global {
  interface Window {
    [BRIDGE_KEY]?: MudanzifyBridge;
  }
}

/**
 * Returns the API exposed by the backend preload script, or `null` when the UI
 * runs in a regular browser (e.g. opening the Vite URL outside Electron).
 */
export function getBridge(): MudanzifyBridge | null {
  return window[BRIDGE_KEY] ?? null;
}

export type { AppInfo, MudanzifyBridge, ThemePreference, ThemeState } from './contract';
