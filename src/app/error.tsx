'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden select-none px-4">
      {/* Background Decorative Grid Mask and Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full bg-primary/10 dark:bg-primary/15 blur-[120px] pointer-events-none z-0 animate-pulse-subtle" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-destructive/10 dark:bg-destructive/12 blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-md w-full text-center space-y-8 bg-card/60 dark:bg-card/25 backdrop-blur-2xl border border-border/40 p-8 sm:p-12 rounded-[2rem] shadow-sm">
        {/* Animated Error Alert Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 dark:bg-destructive/20 flex items-center justify-center text-destructive animate-pulse-subtle">
            <AlertCircle className="h-8 w-8" />
          </div>
        </div>

        {/* Error Headers */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-destructive">
            System Error
          </span>
          <h1 className="text-3xl font-serif-display font-normal text-foreground">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            An unexpected workspace error occurred. Please try to reload or recover to the home dashboard.
          </p>
        </div>

        {/* Action Button Grid */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground font-bold transition-all py-5 h-11 rounded-xl shadow-sm shadow-primary/10 hover:shadow-primary/20 active:scale-[0.99] flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="h-4 w-4" /> Try Again
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button
              variant="outline"
              className="w-full font-semibold border-border/60 hover:bg-muted/50 transition-all py-5 h-11 rounded-xl flex items-center justify-center gap-1.5"
            >
              <Home className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
