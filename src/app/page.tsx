import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock,
  GitBranch,
  KanbanSquare,
  Mail,
  MessageSquare,
  Paperclip,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import FaqAccordion from '@/components/modules/home/FaqAccordion';
import FloatingControls from '@/components/modules/home/FloatingControls';
import HeroButtons from '@/components/modules/home/HeroButtons';
import InteractiveSandbox from '@/components/modules/home/InteractiveSandbox';
import LandingHeader from '@/components/modules/home/LandingHeader';
import NewsletterForm from '@/components/modules/home/NewsletterForm';
import PricingPlans from '@/components/modules/home/PricingPlans';
import ScrollReveal from '@/components/modules/home/ScrollReveal';

export const metadata: Metadata = {
  title: 'Syncline - Task Management & Collaboration',
  description: 'Syncline brings collaborative Kanban boards, granular role controls, and chronological activity logs together in one beautiful, high-performance workspace.',
};

const ALL_FEATURES = [
  {
    icon: KanbanSquare,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10 dark:bg-violet-500/15',
    border: 'border-violet-500/20',
    title: 'Drag & Drop Kanban',
    desc: 'Visually manage tasks across Todo → In Progress → Done lanes with instant optimistic UI updates. No page reload, zero lag.',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    border: 'border-emerald-500/20',
    title: 'Role-Based Access',
    desc: 'Three-tier permission model: Admin controls workspace settings; Project Managers manage boards; Members see only their assigned work.',
  },
  {
    icon: Activity,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    border: 'border-blue-500/20',
    title: 'Activity Audit Log',
    desc: 'Full chronological history of every status change, user invite, role update, and task action — always searchable and sortable.',
  },
  {
    icon: Bell,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    border: 'border-amber-500/20',
    title: 'Smart Notifications',
    desc: 'Real-time alerts when tasks are assigned to you, deadlines are approaching, or teammates leave comments on your work.',
  },
  {
    icon: Paperclip,
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-500/10 dark:bg-pink-500/15',
    border: 'border-pink-500/20',
    title: 'File Attachments',
    desc: 'Upload documents, screenshots, and design files directly to task cards. Keep all project context in one organised place.',
  },
  {
    icon: MessageSquare,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    border: 'border-cyan-500/20',
    title: 'Task Comments',
    desc: 'Threaded discussions inside every task card. Leave feedback, request reviews, or attach context — all without leaving the board.',
  },
  {
    icon: Clock,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10 dark:bg-orange-500/15',
    border: 'border-orange-500/20',
    title: 'Deadline Tracking',
    desc: 'Set due dates for tasks and projects. Visual badges warn you of upcoming and overdue items to prevent sprint slippage.',
  },
  {
    icon: BarChart3,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    title: 'Progress Analytics',
    desc: 'Dashboard charts showing completion rates, velocity trends, and workload distribution across your team and milestones.',
  },
  {
    icon: GitBranch,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    border: 'border-rose-500/20',
    title: 'Multi-Project Boards',
    desc: 'Run multiple projects in parallel from one workspace. Switch boards instantly without losing any context or progress.',
  },
];

const TESTIMONIALS = [
  {
    quote: "Syncline completely transformed how our team works. Dragging and dropping tasks on the Kanban board is so smooth that it feels like a desktop app. Our sprint planning is finally organized.",
    name: 'Tanvir Ahmed',
    role: 'Lead Software Engineer',
    company: 'Pathao Tech, Dhaka',
    initials: 'TA',
    color: 'from-violet-500 to-indigo-500',
    textColor: 'text-violet-600 dark:text-violet-400',
    stars: 5,
  },
  {
    quote: "The role-based access control works beautifully. We have 30+ team members, but managing who sees which project is effortless now. Plus, the activity logs keep everything transparent.",
    name: 'Nasrin Sultana',
    role: 'Head of Engineering',
    company: 'bKash Limited, Dhaka',
    initials: 'NS',
    color: 'from-emerald-500 to-teal-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    stars: 5,
  },
  {
    quote: "We migrated from Jira to Syncline three months ago and haven't looked back. The interface is so clean that new team members onboard in minutes. Task comments have cut down our email threads by 80%.",
    name: 'Rafiqul Islam',
    role: 'Product Manager',
    company: 'ShopUp Bangladesh',
    initials: 'RI',
    color: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    stars: 4.5,
  },
  {
    quote: "As a startup, we started with the free tier. Setting up took less than five minutes. Inviting the team and assigning tasks is incredibly intuitive. It's exactly what we needed.",
    name: 'Sabina Akhter',
    role: 'Co-founder & CTO',
    company: 'FinTech BD Startup',
    initials: 'SA',
    color: 'from-amber-500 to-orange-500',
    textColor: 'text-amber-600 dark:text-amber-400',
    stars: 4,
  },
  {
    quote: "Syncline makes sprint management feel lightweight. No more waiting 5 seconds for page updates. Everything is optimistic and instant. Our velocity increased by 40%.",
    name: 'Imtiaz Hadi',
    role: 'Senior Backend Developer',
    company: 'Chaldal, Dhaka',
    initials: 'IH',
    color: 'from-blue-600 to-indigo-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    stars: 4.5,
  },
  {
    quote: "I love how tasks keep all comments and attachments in one tidy place. It reduced my UI design handoff friction with developers by 90%. Simple, clean, and highly active.",
    name: 'Farzana Yasmin',
    role: 'UI/UX Designer',
    company: 'Shajgoj, Dhaka',
    initials: 'FY',
    color: 'from-rose-500 to-pink-500',
    textColor: 'text-rose-600 dark:text-rose-400',
    stars: 5,
  },
  {
    quote: "Managing multiple project boards from a single workspace is a game-changer. The chronological activity logs make tracking progress across teams completely effortless.",
    name: 'Mahbubur Rahman',
    role: 'Engineering Manager',
    company: 'Daraz Bangladesh',
    initials: 'MR',
    color: 'from-emerald-600 to-teal-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    stars: 4,
  },
  {
    quote: "The role-based permission scoping is exactly what we needed. Project Managers get board controls while developers stay focused on assigned tasks. Highly recommended.",
    name: 'Rashedul Hasan',
    role: 'Lead Product Manager',
    company: 'ShareTrip BD',
    initials: 'RH',
    color: 'from-amber-600 to-orange-500',
    textColor: 'text-amber-600 dark:text-amber-400',
    stars: 4.5,
  },
  {
    quote: "Syncline has solved our cross-functional alignment issues. The activity audit logs let our QA team trace exactly when features were deployed or moved to testing.",
    name: 'Niaz Morshed',
    role: 'Senior QA Engineer',
    company: 'Robi Axiata, Dhaka',
    initials: 'NM',
    color: 'from-blue-500 to-indigo-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    stars: 5,
  },
  {
    quote: "The UI design is incredibly polished. The kanban boards make handoffs smooth and the smart notifications keep our content creators on the same page.",
    name: 'Sadia Tasnim',
    role: 'Lead Product Designer',
    company: '10 Minute School',
    initials: 'ST',
    color: 'from-rose-500 to-pink-500',
    textColor: 'text-rose-600 dark:text-rose-400',
    stars: 4.5,
  },
  {
    quote: "We integrated Syncline for our internal systems team. The speed is unmatched—no lag when handling dozens of parallel project boards.",
    name: 'Zeeshan Khan',
    role: 'Tech Lead',
    company: 'SSL Wireless, Dhaka',
    initials: 'ZK',
    color: 'from-amber-500 to-orange-500',
    textColor: 'text-amber-600 dark:text-amber-400',
    stars: 4,
  },
  {
    quote: "Setting up custom permissions for our team took seconds. Syncline keeps our operations clean, organized, and focused on our weekly metrics.",
    name: 'Kaniz Fatima',
    role: 'Operations Manager',
    company: 'PriyoShop, Dhaka',
    initials: 'KF',
    color: 'from-emerald-500 to-teal-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    stars: 5,
  },
];

const STATS = [
  { value: '10,000+', label: 'Active Users' },
  { value: '500+', label: 'Teams Onboarded' },
  { value: '2M+', label: 'Tasks Completed' },
  { value: '99.9%', label: 'Uptime SLA' },
];

const RootPage = () => {
  const renderStars = (stars: number) => {
    const fullStars = Math.floor(stars);
    const hasHalf = stars % 1 !== 0;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
        {hasHalf && (
          <div className="relative h-3.5 w-3.5 shrink-0">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/25 absolute inset-0" />
            <div className="absolute inset-0 overflow-hidden w-[50%]">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 max-w-none" />
            </div>
          </div>
        )}
        {Array.from({ length: 5 - Math.ceil(stars) }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-3.5 w-3.5 text-amber-400 fill-amber-400/25" />
        ))}
      </div>
    );
  };

  const row1 = TESTIMONIALS.slice(0, 6);
  const row2 = TESTIMONIALS.slice(6, 12);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 transition-colors duration-300">
      <ScrollReveal />

      {/* NAVBAR */}
      <LandingHeader />

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 dark:bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-violet-500/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-3xl space-y-7 relative z-10">
          <div className="flex items-center justify-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.25em] text-muted-foreground/85 dark:text-muted-foreground/90 max-w-lg mx-auto">
            <span className="text-primary font-black animate-pulse">✦</span>
            <span>The Modern Team Workspace Built Differently</span>
          </div>

          <h1 className="font-serif-display text-5xl sm:text-6xl md:text-[4.25rem] font-normal leading-[1.08] text-foreground tracking-tight">
            Workflows that <span className="italic font-normal text-primary/90 dark:text-primary">flow.</span>{' '}
            <br className="hidden sm:block" />
            <span className="brand-gradient-text font-semibold">Tasks that get done.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Syncline brings collaborative Kanban boards, granular role controls, and chronological activity logs together in one beautiful, high-performance workspace — so your team ships faster.
          </p>

          <HeroButtons />

          {/* Trust Pills */}
          <div className="flex items-center justify-center gap-4 flex-wrap pt-1">
            {['No credit card required', 'Free plan available', 'Setup in 2 minutes'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-border/50 bg-card/60 dark:bg-card/30 py-8">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{s.value}</div>
              <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 bg-background relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-4 max-w-2xl mx-auto reveal">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-primary/90 dark:text-primary">
                Capabilities
              </span>
              <div className="h-7 w-px bg-gradient-to-b from-primary/40 to-transparent" />
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl font-normal text-foreground leading-tight tracking-tight">
              Everything your team needs,{' '}
              <span className="brand-gradient-text font-semibold">nothing you don't.</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              A lean, purpose-built platform covering every stage of your project lifecycle — from task creation to final delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 reveal-cascade">
            {ALL_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group bg-card/80 dark:bg-card/45 border border-border/50 hover:border-primary/45 p-6 rounded-2xl space-y-4 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/8 transition-all duration-500 cursor-default relative overflow-hidden flex flex-col justify-between h-full backdrop-blur-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 dark:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="space-y-3 relative z-10">
                    <div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm shrink-0`}>
                      <Icon className={`h-5 w-5 ${f.color}`} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary leading-snug">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE SANDBOX */}
      <InteractiveSandbox />

      {/* HOW IT WORKS */}
      <section id="workflow" className="py-24 border-t border-border/50 bg-background relative reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-primary/90 dark:text-primary">
                Workflow
              </span>
              <div className="h-7 w-px bg-gradient-to-b from-primary/40 to-transparent" />
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl font-normal text-foreground leading-tight tracking-tight">
              Get your team running{' '}
              <span className="brand-gradient-text font-semibold">in minutes.</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              No complex setup. No onboarding calls. Just create, invite, and start shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { step: '01', icon: Users, title: 'Create Workspace', desc: 'Sign up and initialize a workspace in seconds. Name your team, set timezone, and configure base settings.', gradient: 'from-violet-500/15 to-indigo-500/10', iconColor: 'text-violet-600 dark:text-violet-400', iconBg: 'bg-violet-500/10 border-violet-500/25' },
              { step: '02', icon: Mail, title: 'Invite Your Team', desc: 'Invite colleagues by email. Assign granular roles — Admin, Project Manager, or Member — with precise permission scopes.', gradient: 'from-blue-500/15 to-cyan-500/10', iconColor: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/25' },
              { step: '03', icon: KanbanSquare, title: 'Create & Assign', desc: 'Build Kanban boards for each project. Create task cards with titles, deadlines, priorities, attachments, and assignees.', gradient: 'from-amber-500/15 to-orange-500/10', iconColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-500/10 border-amber-500/25' },
              { step: '04', icon: BarChart3, title: 'Track & Ship', desc: 'Drag tasks to completion, monitor analytics dashboards, and review audit logs to keep every sprint on track.', gradient: 'from-emerald-500/15 to-teal-500/10', iconColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/25' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative group">
                  <div className={`bg-gradient-to-br ${item.gradient} border border-border/60 p-6 rounded-2xl space-y-4 h-full hover:-translate-y-1 hover:shadow-lg hover:border-primary/25 hover:shadow-primary/5 transition-all duration-300`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-muted-foreground/50">{item.step}</span>
                      <div className={`w-9 h-9 rounded-xl ${item.iconBg} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-4 w-4 ${item.iconColor}`} />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:flex absolute top-1/2 -right-2.5 -translate-y-1/2 z-10 w-5 h-5 items-center justify-center text-muted-foreground/40 bg-background rounded-full border border-border/50 shadow-sm">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 border-t border-border/50 bg-card/30 dark:bg-background relative overflow-hidden reveal">
        <div className="absolute top-0 left-0 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-primary/90 dark:text-primary">
                Testimonials
              </span>
              <div className="h-7 w-px bg-gradient-to-b from-primary/40 to-transparent" />
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl font-normal text-foreground leading-tight tracking-tight">
              Trusted by Bangladesh's{' '}
              <span className="brand-gradient-text font-semibold">leading teams.</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              From lead developers to co-founders, see how team members ship software faster with Syncline.
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-4 max-w-7xl mx-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background dark:from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background dark:from-background to-transparent z-10" />

            {/* Row 1: Leftward Scrolling */}
            <div className="flex gap-4 animate-marquee py-2 whitespace-nowrap">
              {[...row1, ...row1].map((t, idx) => (
                <div
                  key={`r1-${t.name}-${idx}`}
                  className="w-[320px] sm:w-[360px] shrink-0 group bg-card border border-border/60 p-6 rounded-2xl space-y-4 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between whitespace-normal"
                >
                  <div className="space-y-3">
                    {renderStars(t.stars)}
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center font-bold text-[11px] text-white shrink-0 shadow-sm`}>
                      {t.initials}
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold text-foreground">{t.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{t.role}</p>
                      <p className={`text-[10px] font-semibold ${t.textColor}`}>{t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: Rightward Scrolling */}
            <div className="flex gap-4 animate-marquee-reverse py-2 whitespace-nowrap mt-4">
              {[...row2, ...row2].map((t, idx) => (
                <div
                  key={`r2-${t.name}-${idx}`}
                  className="w-[320px] sm:w-[360px] shrink-0 group bg-card border border-border/60 p-6 rounded-2xl space-y-4 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between whitespace-normal"
                >
                  <div className="space-y-3">
                    {renderStars(t.stars)}
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center font-bold text-[11px] text-white shrink-0 shadow-sm`}>
                      {t.initials}
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold text-foreground">{t.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{t.role}</p>
                      <p className={`text-[10px] font-semibold ${t.textColor}`}>{t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterForm />

      {/* PRICING */}
      <PricingPlans />

      {/* FAQ */}
      <FaqAccordion />

      {/* CTA BANNER */}
      <section className="py-20 border-t border-border/50 bg-card/30 dark:bg-background relative overflow-hidden reveal">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-violet-500/6 pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 text-center space-y-7 relative z-10">
          <h2 className="font-serif-display text-4xl sm:text-5xl font-normal text-foreground leading-tight tracking-tight">
            Ready to streamline your{' '}
            <span className="brand-gradient-text font-semibold">{"team's workflow?"}</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Join thousands of teams using Syncline to ship projects on time. Get started free — no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button className="h-12 px-8 font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                Start Free Today <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" className="h-12 px-7 font-bold text-sm border-border bg-card text-foreground hover:bg-accent rounded-xl hover:-translate-y-0.5 transition-all shadow-sm">
                Explore Features
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/50 bg-card/45 dark:bg-card/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Logo width={135} height={36} className="justify-start" />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
              The modern project management workspace built for high-performance teams.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.12em] text-foreground">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium animate-in fade-in">Features</a></li>
              <li><a href="#pricing" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Pricing</a></li>
              <li><a href="#faq" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">FAQ</a></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.12em] text-foreground">Platform</h4>
            <ul className="space-y-2.5">
              <li><Link href="/signup" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Sign Up</Link></li>
              <li><Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Log In</Link></li>
              <li><Link href="/dashboard" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.12em] text-foreground">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Terms of Service</Link></li>
              <li><a href="mailto:hello@syncline.app" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 mt-12 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[11px] text-muted-foreground font-medium order-1 md:order-none">
            © {new Date().getFullYear()} <span className="font-semibold text-foreground">Syncline</span>. All rights reserved.
          </span>
          
          <div className="flex items-center gap-2 order-3 md:order-none">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">All systems operational</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium order-2 md:order-none">
            <span>Developed by</span>
            <span className="font-bold brand-gradient-text">Md Shakil Hossain</span>
            <span className="text-rose-500 animate-pulse">♥</span>
          </div>
        </div>
      </footer>

      {/* Floating dynamic controls */}
      <FloatingControls />
    </div>
  );
};

export default RootPage;
