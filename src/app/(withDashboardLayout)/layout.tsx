'use client';

import Header from '@/components/core/layout/Header';
import Sidebar from '@/components/core/layout/Sidebar';
import AuthGuard from '@/components/providers/AuthGuard';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/useUiStore';
import React, { useEffect } from 'react';

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isSidebarOpen, setSidebarOpen } = useUiStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Global Dashboard Header */}
        <Header />
        
        <div className="flex flex-1 pt-16">
          {/* Navigation Sidebar */}
          <Sidebar />

          {/* Click-to-close Backdrop for mobile drawers */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <main
            className={cn(
              "flex-1 p-4 md:p-6 transition-all duration-300 min-h-[calc(100vh-4rem)] bg-background min-w-0 overflow-x-hidden",
              isSidebarOpen ? "md:pl-[17.5rem]" : "md:pl-[5.5rem]"
            )}
          >
            <div className="mx-auto max-w-7xl w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;

