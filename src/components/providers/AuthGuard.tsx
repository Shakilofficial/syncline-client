'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { accessToken, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Only redirect AFTER Zustand has fully rehydrated from localStorage.
    // _hasHydrated is set by onRehydrateStorage in the store — it fires once
    // the async localStorage read is complete, so accessToken is reliable here.
    if (_hasHydrated && !accessToken) {
      router.replace('/login');
    }
  }, [_hasHydrated, accessToken, router]);

  // Show spinner until:
  //   1. Zustand has rehydrated (_hasHydrated = false → waiting), OR
  //   2. No token exists (redirect is in-flight)
  if (!_hasHydrated || !accessToken) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-slate-400 font-medium">Verifying active session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
