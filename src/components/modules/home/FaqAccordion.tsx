'use client';

import React, { useState } from 'react';
import { Plus, Minus, Zap, TrendingUp, ShieldCheck, CheckCircle2, Users, MessageSquare } from 'lucide-react';

const FAQS = [
  {
    q: 'Is Syncline free to use?',
    a: 'Yes! Our Starter plan is completely free forever. It includes up to 3 projects, 5 team members, and full Kanban board access. You can upgrade at any time to unlock advanced features.',
    icon: Zap,
  },
  {
    q: 'Can I change my plan later?',
    a: 'Absolutely. You can upgrade, downgrade, or cancel your subscription at any time. Billing is handled on a monthly basis, and there are no long-term contracts.',
    icon: TrendingUp,
  },
  {
    q: 'How does role-based access control work?',
    a: 'Syncline offers three distinct roles: Admin (full workspace controls), Project Manager (manages specific boards and team members), and Member (collaborates on assigned tasks). Permissions are carefully scoped for each role.',
    icon: ShieldCheck,
  },
  {
    q: 'Is my data secure?',
    a: 'Yes, your data is secure. All data is encrypted in transit and at rest. We use secure JWT-based authentication with refresh token rotation, and keep workspace data isolated.',
    icon: CheckCircle2,
  },
  {
    q: 'Can I invite external collaborators?',
    a: 'Yes. You can invite anyone to your workspace or specific projects via email. Guests can be assigned the Member role so they only access tasks assigned to them.',
    icon: Users,
  },
  {
    q: 'Is there a mobile app available?',
    a: 'Our web application is fully responsive and optimized for mobile browsers. A dedicated native mobile app is on our roadmap for Q3 2026.',
    icon: MessageSquare,
  },
];

export const FaqAccordion = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 border-t border-border/50 bg-background reveal">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-primary/90 dark:text-primary">
              FAQ
            </span>
            <div className="h-7 w-px bg-gradient-to-b from-primary/40 to-transparent" />
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-normal text-foreground leading-tight tracking-tight">
            Frequently Asked{' '}
            <span className="brand-gradient-text font-semibold">Questions.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Got questions about Syncline? We've got answers.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            const Icon = faq.icon;
            return (
              <div
                key={i}
                className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? 'border-primary/30 bg-primary/5 dark:bg-primary/8 shadow-md shadow-primary/5'
                    : 'border-border/60 bg-card hover:border-primary/20 hover:bg-primary/3 dark:bg-card/80'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    }`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className={`text-sm font-semibold transition-colors ${isOpen ? 'text-primary' : 'text-foreground'}`}>
                      {faq.q}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isOpen ? 'bg-primary text-primary-foreground rotate-180' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    {isOpen
                      ? <Minus className="h-3 w-3" />
                      : <Plus className="h-3 w-3" />
                    }
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'}`}>
                  <div className="px-5 pb-5 pl-[3.75rem]">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqAccordion;
