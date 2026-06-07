'use client';

import Logo from '@/components/shared/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useUiStore } from '@/store/useUiStore';
import {
  Bell,
  ChevronLeft,
  FolderKanban,
  Home,
  LogOut,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useUiStore();

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch {
      // Silently proceed
    } finally {
      clearAuth();
      toast.success('Logged out successfully.');
      router.push('/login');
    }
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    ...(user?.role === 'ADMIN' ? [{ name: 'Users', href: '/users', icon: Users }] : []),
  ];

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-20 flex flex-col border-r border-border bg-card transition-all duration-300',
        // Desktop widths
        isSidebarOpen ? 'md:w-64' : 'md:w-16',
        // Mobile drawer slide behaviors
        isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0'
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center overflow-hidden">
          <Logo iconOnly={!isSidebarOpen} width={isSidebarOpen ? 120 : 32} height={32} />
        </Link>
        {isSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 hover:bg-accent text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-2 pt-3">
        {navItems.map((item) => {
          // For the /users list page, only activate on exact match (not /users/[id])
          const isActive =
            item.href === '/users'
              ? pathname === '/users'
              : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group relative',
                isActive
                  ? 'bg-primary/10 text-primary border-l-2 border-primary rounded-l-none'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
              {isSidebarOpen ? (
                <span>{item.name}</span>
              ) : (
                <span className="absolute left-14 z-50 hidden rounded-md bg-popover border border-border px-2 py-1 text-xs text-popover-foreground group-hover:block whitespace-nowrap shadow-lg">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-border p-2 space-y-0.5">
        {user && (
          <Link
            href={`/users/${user.id}`}
            className={cn(
              'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group relative',
              // Profile footer is active when viewing any specific user profile (/users/[id]), not the list page
              pathname.startsWith('/users/') && pathname !== '/users'
                ? 'bg-primary/10 text-primary border-l-2 border-primary rounded-l-none'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Avatar className="h-7 w-7 shrink-0 border border-primary/30">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isSidebarOpen ? (
              <div className="flex flex-col text-left overflow-hidden">
                <span className="truncate text-xs font-semibold text-foreground">{user.name}</span>
                <span className="truncate text-[10px] text-muted-foreground capitalize">{user.role.toLowerCase().replace('_', ' ')}</span>
              </div>
            ) : (
              <span className="absolute left-14 z-50 hidden rounded-md bg-popover border border-border px-2 py-1 text-xs text-popover-foreground group-hover:block whitespace-nowrap shadow-lg">
                Profile
              </span>
            )}
          </Link>
        )}

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full flex items-center justify-start space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all group relative"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {isSidebarOpen ? (
            <span>Logout</span>
          ) : (
            <span className="absolute left-14 z-50 hidden rounded-md bg-popover border border-border px-2 py-1 text-xs text-popover-foreground group-hover:block whitespace-nowrap shadow-lg">
              Logout
            </span>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
