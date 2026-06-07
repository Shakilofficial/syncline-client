'use client';

import Logo from '@/components/shared/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useUiStore } from '@/store/useUiStore';
import { useQuery } from '@tanstack/react-query';
import { Bell, LogOut, Menu, Moon, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  PROJECT_MANAGER: 'Project Manager',
  TEAM_MEMBER: 'Team Member',
};

const Header = () => {
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar } = useUiStore();
  const { user, clearAuth } = useAuthStore();
  const { theme, setTheme } = useTheme();

  // Unread notifications badge count
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications', { status: 'unread' }],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/notifications', {
        params: { status: 'unread', limit: 1 },
      });
      return response.data;
    },
    enabled: !!user,
    refetchInterval: 30_000,
  });

  const unreadCount = notificationsData?.meta?.total ?? 0;

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch {
      // Ignore logout endpoint errors
    } finally {
      clearAuth();
      router.replace('/login');
    }
  };

  const handleProfileClick = () => {
    if (!user?.id) return;
    router.push(`/users/${user.id}`);
  };

  // Safe initials — guard against empty/undefined name
  const initials = user?.name?.trim()
    ? user.name.trim().substring(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md">
      {/* Left: Logo + sidebar toggle + workspace label */}
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hover:bg-accent text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link href="/dashboard" className="flex items-center select-none shrink-0 mr-1">
          <Logo width={110} height={28} />
        </Link>
        <span className="hidden md:inline text-border">/</span>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">Workspace</span>
          <span className="text-border">/</span>
          <span className="text-sm font-bold brand-gradient-text">Dashboard</span>
        </div>
      </div>


      {/* Right: Theme + Bell + User */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="hover:bg-accent text-muted-foreground hover:text-foreground relative"
          title="Toggle theme"
        >
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/notifications')}
          className="relative hover:bg-accent text-muted-foreground hover:text-foreground"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground ring-2 ring-card">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>

        {/* User Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full hover:bg-accent p-0 ring-offset-card focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Avatar className="h-9 w-9 border-2 border-primary/30">
                  <AvatarImage
                    src={user.avatarUrl || undefined}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-60 border-border bg-popover text-popover-foreground shadow-xl"
              align="end"
              sideOffset={8}
            >
              {/* User info header */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/30 shrink-0">
                      <AvatarImage src={user.avatarUrl || undefined} alt={user.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <Badge className="mt-1 bg-primary/10 text-primary border border-primary/20 text-[10px] py-0">
                        {ROLE_LABELS[user.role] || user.role}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleProfileClick}
                className="cursor-pointer hover:bg-accent focus:bg-accent focus:text-accent-foreground gap-2"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 shrink-0">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Profile Settings</p>
                  <p className="text-[10px] text-muted-foreground">Manage your account</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push('/notifications')}
                className="cursor-pointer hover:bg-accent focus:bg-accent focus:text-accent-foreground gap-2"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent shrink-0 relative">
                  <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-primary text-[8px] font-black text-primary-foreground">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-[10px] text-muted-foreground">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer hover:bg-rose-500/10 focus:bg-rose-500/10 text-rose-500 focus:text-rose-500 gap-2"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/10 shrink-0">
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Log out</p>
                  <p className="text-[10px] text-rose-500/70">End current session</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
