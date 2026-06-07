'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const HeroButtons = () => {
  const { accessToken } = useAuthStore();
  const isAuthenticated = !!accessToken;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
      {isAuthenticated ? (
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-7 font-bold flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
            Open Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <>
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-7 font-bold flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
              Start Free Today <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-border bg-card hover:bg-accent text-foreground h-12 px-7 font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-sm">
              Sign In
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default HeroButtons;
