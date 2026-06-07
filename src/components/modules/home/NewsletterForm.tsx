'use client';

import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const NewsletterForm = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setIsSubscribed(true);
      toast.success('Thank you! You are now subscribed to the Syncline newsletter.');
      setNewsletterEmail('');
    }, 800);
  };

  return (
    <section className="py-20 border-t border-border/50 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-violet-500/5 pointer-events-none" />
      <div className="mx-auto max-w-3xl px-4 text-center space-y-7 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-lg shadow-primary/10">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-3">
          <h2 className="font-serif-display text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
            Stay ahead of the curve
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Get the latest product updates, workflow tips, and feature releases delivered to your inbox.
          </p>
        </div>

        {isSubscribed ? (
          <div className="mx-auto max-w-sm flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-5 py-3.5 justify-center text-sm text-emerald-700 dark:text-emerald-400 font-semibold">
            <Check className="h-4 w-4 shrink-0" /> Subscribed — welcome aboard!
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mx-auto max-w-md flex flex-col sm:flex-row items-stretch gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="h-11 text-sm border-border bg-card text-foreground placeholder:text-muted-foreground/50 rounded-xl focus-visible:ring-primary/40 shadow-sm"
              disabled={isSubscribing}
              required
            />
            <Button
              type="submit"
              className="h-11 px-5 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shrink-0 shadow-sm"
              disabled={isSubscribing}
            >
              {isSubscribing ? 'Subscribing…' : 'Subscribe Free'}
            </Button>
          </form>
        )}
        <p className="text-[10px] text-muted-foreground/50">No spam, ever. Unsubscribe at any time.</p>
      </div>
    </section>
  );
};

export default NewsletterForm;
