import { Terms } from '@/components/modules/terms/Terms';
import { ShieldAlert } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Syncline',
  description: "Read the Syncline Terms of Service and user agreement details under Bangladesh's Cyber Security Act, 2023.",
};

const TermsOfServicePage = () => {
  return (
    <Terms>
      {/* 1. Agreement to Terms */}
      <section id="agreement" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">1.</span> Agreement to Terms
        </h2>
        <p className="leading-relaxed text-sm">
          By creating an account, accessing, or using the <strong>Syncline</strong> workspace application, you declare that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree to these terms, you are prohibited from utilizing the service.
        </p>
        <p className="leading-relaxed text-sm">
          These Terms constitute a legally binding contract between you and Syncline, recognized under the Contract Act, 1872 of the People's Republic of Bangladesh.
        </p>
      </section>

      {/* 2. Account Registration */}
      <section id="accounts" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">2.</span> Account Registration & Security
        </h2>
        <p className="leading-relaxed text-sm">
          To use Syncline, you must register by providing accurate and complete information. You agree to:
        </p>
        <ul className="list-none pl-0 space-y-3 text-sm">
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span>Maintain the absolute confidentiality of your login credentials and session integrity.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span>Notify our support team immediately if you detect unauthorized access or credential leak.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span>Accept full responsibility for all activities, tasks, comments, and state changes performed under your account.</span>
          </li>
        </ul>
      </section>

      {/* 3. Subscriptions & Billing */}
      <section id="subscriptions" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">3.</span> Subscriptions, Fees & Billing
        </h2>
        <p className="leading-relaxed text-sm">
          Syncline provides tiered subscription options including free starter accounts and premium tiers. The billing terms are outlined below:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="p-4 rounded-xl border border-border/40 bg-card/30 space-y-2">
            <span className="text-xs font-bold text-foreground block">Pricing & Currency</span>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Premium plans are priced in Bangladeshi Taka (BDT) and subject to local taxes. Professional plans are billed at <strong>৳1,200/month</strong>, and Business plans at <strong>৳3,500/month</strong>.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/30 space-y-2">
            <span className="text-xs font-bold text-foreground block">Billing & SLA</span>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Payments are authorized securely via cards or mobile financial services (bKash, Nagad, Rocket). Professional and Business plans feature a 99.9% uptime SLA guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Prohibitions & Cyber Law Compliance */}
      <section id="conduct" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">4. Acceptable Conduct & Cyber Law</span>
        </h2>
        <div className="p-5 rounded-2xl border border-destructive/20 bg-destructive/[0.03] dark:bg-destructive/[0.06] text-xs text-foreground/85 space-y-3 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-destructive/60" />
          <div className="flex items-center gap-2 font-bold text-destructive uppercase tracking-wider text-[10px]">
            <ShieldAlert className="h-4 w-4" /> Compliance Notice
          </div>
          <p className="leading-relaxed">
            Pursuant to the <strong>Bangladesh Cyber Security Act, 2023</strong>, users are strictly prohibited from using Syncline to host, transmit, or comment on materials containing cyber-terrorist elements, religiously defamatory contents, pornography, malware, or statements compromising state security.
          </p>
        </div>
        <p className="leading-relaxed text-sm">
          Syncline holds a zero-tolerance policy towards illegal content. We reserve the right to immediately terminate violating workspaces and report illegal activity to the appropriate regulatory authorities in Bangladesh.
        </p>
      </section>

      {/* 5. Role-Based Permissions */}
      <section id="roles" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">5.</span> Role-Based Permissions & Limits
        </h2>
        <p className="leading-relaxed text-sm">
          Workspace member capabilities are strictly controlled using configured role parameters:
        </p>
        <ul className="list-none pl-0 space-y-3 text-sm">
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Admins:</strong> Ultimate authority to manage billing tiers, export logs, adjust role parameters, or delete the workspace.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Project Managers:</strong> Create boards, invite workspace members, allocate tasks, and leave comments.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Members:</strong> View boards, update tasks (e.g. dragging cards between columns), and post comment updates.</span>
          </li>
        </ul>
      </section>

      {/* 6. Intellectual Property */}
      <section id="ip-rights" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">6.</span> Intellectual Property Rights
        </h2>
        <p className="leading-relaxed text-sm">
          All Syncline codebase, design assets, custom React modules, layouts, backend services, database schemes, and branding elements are the exclusive property of Syncline.
        </p>
        <p className="leading-relaxed text-sm">
          Your workspace contents (tasks, custom checklists, team commentary) remain your intellectual property. You grant Syncline a limited, secure license to store and render your content to execute requested task features.
        </p>
      </section>

      {/* 7. Limitation of Liability */}
      <section id="liability" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">7.</span> Limitation of Liability
        </h2>
        <p className="leading-relaxed text-sm">
          Syncline is provided "as is" and "as available". To the maximum extent permitted under law, Syncline is not liable for indirect, incidental, or consequential damages resulting from:
        </p>
        <ul className="list-none pl-0 space-y-3 text-sm">
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span>System downtime or network disruptions affecting workspace availability.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span>Loss of tasks, board information, or attachment files.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span>Delays, errors, or failed transactions processing through local payment networks.</span>
          </li>
        </ul>
      </section>

      {/* 8. Account Termination */}
      <section id="termination" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">8.</span> Account Termination
        </h2>
        <p className="leading-relaxed text-sm">
          We reserve the right to suspend, freeze, or terminate your workspace access without prior notice if you violate these Terms or local cyber safety laws.
        </p>
        <p className="leading-relaxed text-sm">
          Admins may close their workspaces at any time, initiating data deletion from active database instances.
        </p>
      </section>

      {/* 9. Governing Law */}
      <section id="governing-law" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">9.</span> Governing Law & Jurisdiction
        </h2>
        <p className="leading-relaxed text-sm">
          These Terms of Service, along with any disputes arising from platform use, shall be governed by and interpreted in accordance with the laws of the <strong>People's Republic of Bangladesh</strong>.
        </p>
        <p className="leading-relaxed text-sm">
          Any legal proceedings, actions, or disputes must be filed exclusively in the courts and tribunals located in <strong>Dhaka, Bangladesh</strong>.
        </p>
      </section>
    </Terms>
  );
};

export default TermsOfServicePage;
