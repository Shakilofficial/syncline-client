import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';
  avatarUrl?: string | null;
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────
const COOKIE_NAME = 'syncline-access-token';

function deleteCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

function setCookie(value: string | null | undefined) {
  if (typeof document === 'undefined') return;
  if (!value || value === 'undefined' || value === 'null') {
    deleteCookie();
    return;
  }
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${value}; path=/; expires=${expires}; SameSite=Lax`;
}

// ─── Store ────────────────────────────────────────────────────────────────────
interface AuthState {
  /** True once Zustand has finished reading from localStorage */
  _hasHydrated: boolean;
  user: User | null;
  accessToken: string | null;
  setHasHydrated: (value: boolean) => void;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  updateUser: (updates: Partial<User>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      user: null,
      accessToken: null,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      setAuth: (user, accessToken) => {
        setCookie(accessToken);
        set({ user, accessToken });
      },

      setAccessToken: (accessToken) => {
        setCookie(accessToken);
        set({ accessToken });
      },

      /** Patch specific fields on the current user (e.g. name/avatar after profile update) */
      updateUser: (updates) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...updates } });
      },

      clearAuth: () => {
        deleteCookie();
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: 'syncline-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Called once localStorage has been read and state restored.
      // Until this fires, _hasHydrated stays false and guards show a spinner.
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
