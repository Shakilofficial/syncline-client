'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    tagline: 'Ideal for freelancers and solo developers.',
    highlight: true,
    badge: 'App Launch Special',
    accentClass: '',
    features: [
      'Up to 3 active projects',
      'Up to 5 team members',
      'Basic Kanban boards',
      'Task comments & attachments',
      '7-day activity log history',
      'Email support',
    ],
    cta: 'Start Free Today',
  },
  {
    name: 'Professional',
    price: '৳1,200',
    period: '/ month',
    tagline: 'For growing teams needing advanced workflow controls.',
    highlight: false,
    badge: null,
    accentClass: 'border-border/60 dark:border-border/30',
    features: [
      'Unlimited active projects',
      'Up to 25 team members',
      'Full drag & drop Kanban',
      'Role-based access control',
      'Full activity audit logs',
      'Priority support (email + chat)',
      'Deadline tracking & alerts',
      'Progress analytics dashboard',
    ],
    cta: 'Start Pro Trial',
  },
  {
    name: 'Business',
    price: '৳3,500',
    period: '/ month',
    tagline: 'For large organizations requiring security and compliance.',
    highlight: false,
    badge: null,
    accentClass: 'border-border/60 dark:border-border/30',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Advanced user permissions',
      'Compliance audit exports',
      'Multi-workspace management',
      'Dedicated account manager',
      '99.9% SLA uptime guarantee',
      'Custom integrations & API',
    ],
    cta: 'Contact Sales',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    tagline: 'Tailored solutions for large enterprise clients.',
    highlight: false,
    badge: 'Custom',
    accentClass: 'border-border/60 dark:border-border/30',
    features: [
      'Everything in Business',
      'On-premise deployment',
      'Custom SSO & LDAP integration',
      'White-label branding',
      'Custom data retention policies',
      '24/7 dedicated support',
      'Security & compliance review',
      'Quarterly business reviews',
    ],
    cta: 'Talk to Us',
  },
];

export const PricingPlans = () => {
  const { accessToken } = useAuthStore();
  const isAuthenticated = !!accessToken;
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 border-t border-border/50 bg-card/30 dark:bg-background relative overflow-hidden reveal">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-primary/90 dark:text-primary">
              Pricing
            </span>
            <div className="h-7 w-px bg-gradient-to-b from-primary/40 to-transparent" />
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-normal text-foreground leading-tight tracking-tight">
            Plans that scale{' '}
            <span className="brand-gradient-text font-semibold">with your team.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Start free and grow as your needs expand. All prices in Bangladeshi Taka (BDT ৳). Choose the plan that works best for you.
          </p>

          {/* Monthly / Yearly Switch */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className={`text-xs font-bold transition-colors duration-200 ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative h-6 w-11 rounded-full bg-border dark:bg-white/10 hover:bg-border/80 transition-colors p-0.5 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              aria-label="Toggle annual billing"
            >
              <div
                className={`h-5 w-5 rounded-full bg-primary transition-transform duration-300 shadow-md ${
                  isAnnual ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold transition-colors duration-200 flex items-center gap-1.5 ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
              <Badge className="bg-primary/15 text-primary dark:bg-primary/25 dark:text-primary border-none text-[9px] font-black py-0.5 px-2 rounded-full hover:bg-primary/20">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 max-w-6xl mx-auto items-start reveal-cascade">
          {PRICING_PLANS.map((plan) => {
            // Calculate dynamic prices
            let displayPrice = plan.price;
            let displayPeriod = plan.period;
            let displayAnnualSub = '';

            if (plan.name === 'Professional') {
              displayPrice = isAnnual ? '৳960' : '৳1,200';
              displayPeriod = isAnnual ? '/ month' : '/ month';
              displayAnnualSub = isAnnual ? '৳11,520 billed annually' : '';
            } else if (plan.name === 'Business') {
              displayPrice = isAnnual ? '৳2,800' : '৳3,500';
              displayPeriod = isAnnual ? '/ month' : '/ month';
              displayAnnualSub = isAnnual ? '৳33,600 billed annually' : '';
            }

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-6 space-y-5 border transition-all duration-500 group ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-primary to-primary/95 text-primary-foreground border-primary/30 shadow-2xl shadow-primary/25 xl:scale-[1.04] xl:-mt-2 hover:scale-[1.07] hover:-translate-y-2.5 hover:shadow-primary/35'
                    : 'bg-card border-border/60 dark:border-border/30 hover:border-primary/45 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 hover:scale-[1.02] dark:bg-card/80'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-black px-3.5 py-1 rounded-full shadow-sm whitespace-nowrap ${
                    plan.highlight
                      ? 'bg-white text-primary'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                {/* Plan header */}
                <div className="space-y-1.5">
                  <h3 className={`text-[10px] font-black uppercase tracking-[0.15em] ${plan.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-2xl font-extrabold leading-none transition-all duration-300">{displayPrice}</span>
                    <span className={`text-[11px] ${plan.highlight ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{displayPeriod}</span>
                  </div>
                  {displayAnnualSub && (
                    <span className={`text-[9px] font-bold block transition-all duration-300 animate-in fade-in duration-300 ${plan.highlight ? 'text-primary-foreground/75' : 'text-muted-foreground/80'}`}>
                      {displayAnnualSub}
                    </span>
                  )}
                  <p className={`text-[11px] leading-relaxed ${plan.highlight ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
                    {plan.tagline}
                  </p>
                </div>

                <div className={`h-px ${plan.highlight ? 'bg-white/20' : 'bg-border/60'}`} />

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-[11px] leading-snug ${plan.highlight ? 'text-primary-foreground/90' : 'text-foreground/80'}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 mt-0.5 transition-all duration-300 ${
                        plan.highlight
                          ? 'text-white/90 group-hover:scale-115 group-hover:rotate-6'
                          : 'text-primary group-hover:text-emerald-500 dark:group-hover:text-[#6EEFC0] group-hover:scale-115 group-hover:rotate-6'
                      }`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.name === 'Enterprise' ? 'mailto:hello@syncline.app' : '/signup'} className="block mt-auto">
                  <Button
                    className={`w-full text-xs font-bold rounded-xl h-10 transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      plan.highlight
                        ? 'bg-white text-primary hover:bg-white/90 shadow-md group-hover:scale-[1.02] group-hover:shadow-lg'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm group-hover:scale-[1.02] group-hover:shadow-md'
                    }`}
                  >
                    {isAuthenticated ? 'Go to Dashboard' : plan.cta}
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 group-hover:translate-x-0.5 transition-all duration-300" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          All prices in BDT (Bangladeshi Taka ৳). Taxes may apply.{' '}
          <a href="#faq" className="text-primary underline-offset-4 hover:underline font-semibold">See FAQ</a> for billing details.
        </p>
      </div>
    </section>
  );
};

export default PricingPlans;
