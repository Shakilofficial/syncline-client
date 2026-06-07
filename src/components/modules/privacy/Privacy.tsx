'use client';

import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Eye,
  FileText,
  HelpCircle,
  Lock,
  Moon,
  Scale,
  Server,
  Shield,
  Sun,
  Trash2,
  Users,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'introduction', title: '1. Introduction', icon: FileText },
  { id: 'data-collection', title: '2. Information We Collect', icon: Eye },
  { id: 'data-usage', title: '3. How We Use Information', icon: Server },
  { id: 'workspace-roles', title: '4. Workspace Sharing & Roles', icon: Users },
  { id: 'data-security', title: '5. Security & Encryption', icon: Lock },
  { id: 'legal-compliance', title: '6. Cyber Security & Compliance', icon: Scale },
  { id: 'data-retention', title: '7. Data Retention & Deletion', icon: Trash2 },
  { id: 'contact', title: '8. Contact Us', icon: HelpCircle },
];

export const Privacy = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Space for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 transition-colors duration-300 relative">
      {/* Background Decorative Grid Mask and Glowing Orbs wrapper with overflow-hidden */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] animate-pulse-subtle" />
        <div className="absolute top-[20%] right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px]" />
      </div>

      {/* Sticky Navbar Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 dark:bg-background/60 backdrop-blur-xl transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo width={110} height={28} className="flex items-center shrink-0" />
            <div className="h-5 w-px bg-border/60 hidden sm:block" />
            <span className="text-xs font-bold text-muted-foreground tracking-wide hidden sm:inline-block">
              Privacy Policy
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-xs h-9 px-3.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all hover:bg-muted/80 border border-transparent hover:border-border/30">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
              </Button>
            </Link>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
              className="relative h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent hover:border-border/30 transition-all"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        
        {/* Banner Title */}
        <div className="relative mb-14 text-center lg:text-left py-2">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 dark:bg-primary/5 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5" /> Last Updated: June 7, 2026
            </div>
            <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground leading-tight">
              Privacy <span className="brand-gradient-text font-semibold">Policy</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              At Syncline, we value the trust you place in our collaborative project workspace. This policy details how we handle information in compliance with modern technology and security standards.
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar Navigation Index (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-fit z-30">
            <div className="space-y-4 bg-card/40 dark:bg-card/20 border border-border/30 rounded-3xl p-6 backdrop-blur-xl shadow-sm shadow-background/50 dark:shadow-none">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/80 px-2 block">
                Table of Contents
              </span>
              <div className="relative border-l border-border/50 ml-2 pl-3 py-1 space-y-2">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left py-1.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all duration-200 relative -ml-[13px] pl-3 border-l-2 ${
                        isActive
                          ? 'border-primary text-primary font-semibold'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border/60'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 transition-transform ${isActive ? 'scale-110 text-primary' : 'text-muted-foreground/70'}`} />
                      <span className="truncate">{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Policy Document Contents */}
          <div className="col-span-1 lg:col-span-9 space-y-6">
            <div className="bg-card/50 dark:bg-card/25 backdrop-blur-2xl border border-border/40 p-8 sm:p-12 rounded-[2rem] shadow-sm space-y-12 leading-relaxed text-sm text-foreground/80 dark:text-foreground/75 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              {children}
            </div>
          </div>

        </div>

      </main>

      {/* Simplified Legal Footer */}
      <footer className="border-t border-border/40 bg-card/20 dark:bg-card/10 backdrop-blur-sm py-8 mt-12 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} <span className="font-semibold text-foreground">Syncline</span>. Built for modern collaborative teams.
          </span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <Link href="/" className="hover:text-primary transition-colors">Home Page</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
