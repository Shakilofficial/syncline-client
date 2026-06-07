'use client';

import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#interactive-sandbox', label: 'Demo' },
  { href: '#workflow', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
];

export const LandingHeader = () => {
  const { theme, setTheme } = useTheme();
  const { accessToken } = useAuthStore();
  const isAuthenticated = !!accessToken;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 dark:bg-card/75 backdrop-blur-xl transition-all shadow-sm dark:shadow-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Logo width={110} height={28} className="flex items-center shrink-0" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
              className="relative h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            <div className="h-5 w-px bg-border hidden sm:block" />

            {isAuthenticated ? (
              <Link href="/dashboard" className="hidden sm:block">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm h-9 font-semibold flex items-center gap-1.5 px-5 rounded-xl">
                  Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-foreground text-sm h-9 px-5 rounded-xl font-semibold"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" className="hidden sm:block">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm h-9 font-semibold px-5 rounded-xl">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed top-16 right-0 bottom-0 left-0 z-50 bg-background/95 dark:bg-card/95 backdrop-blur-2xl border-t border-border/50 overflow-y-auto transition-all duration-300 ${
          mobileNavOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-6 py-8 space-y-6 flex flex-col min-h-[calc(100vh-4rem)]">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 py-3.5 border-b border-border/40 text-sm font-bold text-foreground hover:text-primary transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 mt-auto flex flex-col gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setMobileNavOpen(false)} className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm h-11 rounded-xl shadow-lg shadow-primary/20">
                  Go to Dashboard <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <Link href="/login" onClick={() => setMobileNavOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full font-semibold text-sm h-11 rounded-xl border-border bg-card">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileNavOpen(false)} className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm h-11 rounded-xl shadow-lg shadow-primary/20">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingHeader;
