'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden select-none">
      {/* Background Decorative Mask Grid and Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full bg-primary/10 dark:bg-primary/15 blur-[120px] pointer-events-none z-0" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/12 blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Loading Spinner with Double Orbit Rings */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-primary animate-spin" />
          <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 animate-pulse-subtle flex items-center justify-center">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1.5 text-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/80">
            Syncline
          </h2>
          <p className="text-xs text-muted-foreground animate-pulse">
            Loading your workspace...
          </p>
        </div>
      </div>
    </div>
  );
}
