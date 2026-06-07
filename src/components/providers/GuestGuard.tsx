'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { accessToken, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated && accessToken) {
      router.replace('/dashboard');
    }
  }, [_hasHydrated, accessToken, router]);

  if (!_hasHydrated || accessToken) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
};

export default GuestGuard;
