import { Mail, Phone, Scale } from 'lucide-react';
import type { Metadata } from 'next';
import { Privacy } from '../../components/modules/privacy/Privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy - Syncline',
  description: "Read the Syncline Privacy Policy to understand how we secure and manage your collaborative data under Bangladesh's ICT standards.",
};

const PrivacyPolicyPage = () => {
  return (
    <Privacy>
      {/* 1. Introduction */}
      <section id="introduction" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">1.</span> Introduction
        </h2>
        <p className="leading-relaxed text-sm">
          Welcome to <strong>Syncline</strong>. We are committed to protecting your privacy and ensuring the confidentiality of your workspace data. This Privacy Policy describes how Syncline collects, uses, shares, and secures data gathered during your use of our boards, tasks, comments, and related tools.
        </p>
        <p className="leading-relaxed text-sm">
          This policy is governed under the jurisdiction of the People's Republic of Bangladesh. By accessing or using Syncline, you agree to the terms described in this Privacy Policy.
        </p>
      </section>

      {/* 2. Information We Collect */}
      <section id="data-collection" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">2.</span> Information We Collect
        </h2>
        <p className="leading-relaxed text-sm">
          We collect information to support collaborative features, dashboard tracking, and account security. This includes:
        </p>
        <ul className="list-none pl-0 space-y-3 text-sm">
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Credentials:</strong> Name, email address, password hash, and role designations (Admin, Project Manager, or Member).</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Workspace Data:</strong> Task descriptions, column placements, board configs, comment records, and file uploads.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Billing Info:</strong> Subscription history and secure transaction references (processed via local mobile financial services including bKash, Nagad, Rocket). We do not store financial account credentials directly.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Technical Logs:</strong> IP address, device specifications, browser settings, cookies, and authentication tokens.</span>
          </li>
        </ul>
      </section>

      {/* 3. How We Use Information */}
      <section id="data-usage" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">3.</span> How We Use Information
        </h2>
        <p className="leading-relaxed text-sm">
          We process data to maintain real-time application responsiveness and collaborative features:
        </p>
        <ul className="list-none pl-0 space-y-3 text-sm">
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Kanban Updates:</strong> Ensuring dynamic, drag-and-drop state synchronization across all team members' boards.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Authorization Framework:</strong> Protecting workspace data via JWT mechanisms and session token rotations.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Workspace Alerts:</strong> Triggering notifications for task deadlines and member mentions.</span>
          </li>
        </ul>
      </section>

      {/* 4. Workspace Sharing & Roles */}
      <section id="workspace-roles" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">4.</span> Workspace Sharing & Roles
        </h2>
        <p className="leading-relaxed text-sm">
          Syncline is built for collaborative project tasks. Data you upload or change is visible to other workspace participants according to user roles:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="p-4 rounded-xl border border-border/40 bg-card/30 space-y-1">
            <span className="text-xs font-bold text-foreground block mb-1">Admin Role</span>
            <p className="text-xs leading-relaxed text-muted-foreground">Full access to settings, role overrides, billing logs, and workspace backup archives.</p>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/30 space-y-1">
            <span className="text-xs font-bold text-foreground block mb-1">Project Manager Role</span>
            <p className="text-xs leading-relaxed text-muted-foreground">Modify boards, manage status columns, invite new team members, and allocate tasks.</p>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/30 space-y-1">
            <span className="text-xs font-bold text-foreground block mb-1">Member Role</span>
            <p className="text-xs leading-relaxed text-muted-foreground">Access assigned workspace boards, move cards across columns, and comment on task details.</p>
          </div>
        </div>
      </section>

      {/* 5. Security & Encryption */}
      <section id="data-security" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">5.</span> Security & Encryption
        </h2>
        <p className="leading-relaxed text-sm">
          We secure your workspace using industry-standard protocols:
        </p>
        <ul className="list-none pl-0 space-y-3 text-sm">
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span>Connections are encrypted using HTTPS (TLS 1.3) protocols.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span>Passwords are hashed cryptographically to prevent exposure during breach risks.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span>Uploaded files are held in isolated cloud storage, restricted to authorized workspace members.</span>
          </li>
        </ul>
      </section>

      {/* 6. Cyber Security & Compliance */}
      <section id="legal-compliance" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">6.</span> Cyber Security Compliance
        </h2>
        <div className="p-5 rounded-2xl border border-primary/20 bg-primary/[0.03] dark:bg-primary/[0.06] text-xs text-foreground/85 space-y-3 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/60" />
          <div className="flex items-center gap-2 font-bold text-primary uppercase tracking-wider text-[10px]">
            <Scale className="h-4 w-4" /> Legal Compliance Notice
          </div>
          <p className="leading-relaxed">
            All workspace services and content inside Syncline must comply with the <strong>Cyber Security Act, 2023</strong> and the <strong>Information and Communication Technology (ICT) Act, 2006</strong> of Bangladesh.
          </p>
        </div>
        <p className="leading-relaxed text-sm">
          Syncline coordinates with regulatory authorities should user content contain files or boards flagrantly violating local cybersecurity laws. Platform support and administration are managed from Dhaka, Bangladesh.
        </p>
      </section>

      {/* 7. Data Retention & Deletion */}
      <section id="data-retention" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">7.</span> Data Retention & Deletion
        </h2>
        <p className="leading-relaxed text-sm">
          You hold control over your dashboard data:
        </p>
        <ul className="list-none pl-0 space-y-3 text-sm">
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Profile Deletion:</strong> Initiating account termination purges your personal credentials and credentials records.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Workspace Continuity:</strong> Comments, status cards, and descriptions you created are retained under an anonymous "Deactivated Member" label to protect workflow continuity.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
            <span><strong className="text-foreground">Backups:</strong> Database backups are kept securely for 30 days for emergency restoration, then overwritten.</span>
          </li>
        </ul>
      </section>

      {/* 8. Contact Us */}
      <section id="contact" className="space-y-4 scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2.5">
          <span className="brand-gradient-text font-bold">8.</span> Contact Us
        </h2>
        <p className="leading-relaxed text-sm">
          For any data requests, inquiries, security disclosures, or questions regarding local legal compliance, reach out to our team:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-border/40 bg-card/20 hover:bg-card/40 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-foreground block">Email Support</span>
              <a href="mailto:hello@syncline.app" className="text-xs text-primary hover:underline truncate block">hello@syncline.app</a>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-border/40 bg-card/20 hover:bg-card/40 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-foreground block">WhatsApp Business</span>
              <a href="https://wa.me/8801620521215" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block">+880 1620-521215</a>
            </div>
          </div>
        </div>
      </section>
    </Privacy>
  );
};

export default PrivacyPolicyPage;
