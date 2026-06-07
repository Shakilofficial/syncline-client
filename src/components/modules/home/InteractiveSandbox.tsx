'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface SandboxTask {
  id: string;
  title: string;
  desc: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: string;
}

export const InteractiveSandbox = () => {
  const [sandboxTasks, setSandboxTasks] = useState<SandboxTask[]>([
    { id: '1', title: 'Design System Revamp', desc: 'Migrate layout tokens & color scales.', status: 'TODO', priority: 'HIGH' },
    { id: '2', title: 'Setup Nesting Guards', desc: 'Configure Next.js layout min-w rules.', status: 'IN_PROGRESS', priority: 'MEDIUM' },
    { id: '3', title: 'Integrate JWT Refresh', desc: 'Secure backend refresh token rotation.', status: 'COMPLETED', priority: 'LOW' },
  ]);

  const moveTask = (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'COMPLETED') => {
    setSandboxTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    toast.success(`Task moved to ${newStatus.replace(/_/g, ' ')}`);
  };

  return (
    <section id="interactive-sandbox" className="py-24 border-t border-border/50 bg-card/30 dark:bg-card/10 relative overflow-hidden reveal">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-primary/90 dark:text-primary">
              Interactive Demo
            </span>
            <div className="h-7 w-px bg-gradient-to-b from-primary/40 to-transparent" />
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-normal text-foreground leading-tight tracking-tight">
            See Syncline in action —{' '}
            <span className="brand-gradient-text font-semibold">right here.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Click the arrows on each task card to move them between lanes. This is exactly how the real Kanban board feels — instant and fluid.
          </p>
        </div>

        {/* Sandbox */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card/40 p-3 shadow-2xl backdrop-blur-md">
          <div className="rounded-xl border border-border/60 bg-background overflow-hidden flex flex-col h-[330px]">
            {/* Window Chrome */}
            <div className="h-10 border-b border-border/60 px-4 flex items-center justify-between bg-muted/40 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="h-3 w-px bg-border mx-2" />
                <span className="text-[9px] font-bold text-muted-foreground font-mono">SYNCLINE / SANDBOX</span>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>

            {/* Lanes */}
            <div className="flex-1 p-3 flex gap-3 overflow-x-auto min-h-0">
              {[
                { status: 'TODO' as const, label: 'To Do', accent: 'bg-blue-500', bg: 'bg-blue-500/8 dark:bg-blue-500/10', badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25' },
                { status: 'IN_PROGRESS' as const, label: 'In Progress', accent: 'bg-amber-500', bg: 'bg-amber-500/8 dark:bg-amber-500/10', badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25' },
                { status: 'COMPLETED' as const, label: 'Completed', accent: 'bg-emerald-500', bg: 'bg-emerald-500/8 dark:bg-emerald-500/10', badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25' },
              ].map((lane) => {
                const tasks = sandboxTasks.filter((t) => t.status === lane.status);
                return (
                  <div key={lane.status} className={`flex flex-col gap-2 flex-1 min-w-[155px] rounded-xl ${lane.bg} border border-border/30 p-2`}>
                    <div className="flex items-center justify-between pb-1.5 border-b border-border/30">
                      <span className="text-[10px] font-bold text-foreground">{lane.label}</span>
                      <span className={`rounded-full border px-1.5 py-0.5 text-[8px] font-bold ${lane.badge}`}>{tasks.length}</span>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto">
                      {tasks.map((t) => (
                        <div key={t.id} className={`bg-card border border-border/50 rounded-lg p-2 space-y-1.5 shadow-sm relative pl-2.5 ${lane.status === 'COMPLETED' ? 'opacity-60' : ''} hover:border-primary/30 transition-colors`}>
                          <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${lane.accent} rounded-l-lg`} />
                          <div className="flex items-start justify-between gap-1">
                            {lane.status !== 'TODO' && (
                              <button
                                onClick={() => moveTask(t.id, lane.status === 'IN_PROGRESS' ? 'TODO' : 'IN_PROGRESS')}
                                className="p-0.5 hover:bg-muted text-muted-foreground rounded transition-colors rotate-180 shrink-0"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            )}
                            <span className={`text-[9px] font-semibold leading-tight line-clamp-2 flex-1 text-foreground ${lane.status === 'COMPLETED' ? 'line-through' : ''}`}>
                              {t.title}
                            </span>
                            {lane.status !== 'COMPLETED' && (
                              <button
                                onClick={() => moveTask(t.id, lane.status === 'TODO' ? 'IN_PROGRESS' : 'COMPLETED')}
                                className="p-0.5 hover:bg-primary/10 text-primary rounded transition-colors shrink-0"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-[8px] text-muted-foreground leading-normal">{t.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveSandbox;
