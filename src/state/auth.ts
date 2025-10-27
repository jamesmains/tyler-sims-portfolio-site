import { atom } from 'jotai';

// --- State Atoms ---

/**
 * Stores the user's secret key (token) input.
 * This is what the user enters into the login form.
 */
export const adminSecretAtom = atom<string | null>(null);

/**
 * Stores the current authentication status.
 * Starts as false, only set to true after successful server validation.
 */
export const isAdminLoggedInAtom = atom((get) => !!get(adminSecretAtom));

// Checks the hydration for the applications readiness/hydration status   
export const isSessionCheckedAtom = atom(false);
