import React from 'react';
import GuestGuard from '@/components/providers/GuestGuard';
import Logo from '@/components/shared/Logo';

const AuthLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <GuestGuard>
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 overflow-hidden select-none">
        {/* Background Grid and Soft Glowing Orbs for Premium Aesthetics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />
        <div className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full bg-primary/10 dark:bg-primary/15 blur-[120px] pointer-events-none animate-pulse-subtle z-0" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/12 blur-[100px] pointer-events-none z-0" />
        
        <div className="relative z-10 w-full max-w-md flex flex-col items-center">
          <div className="mb-8 flex justify-center hover:scale-[1.02] transition-transform duration-300">
            <Logo width={160} height={42} />
          </div>
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </GuestGuard>
  );
};

export default AuthLayout;


