'use client';

import ChangeRoleDialog from '@/components/modules/dashboard/users/ChangeRoleDialog';
import CreateUserDialog from '@/components/modules/dashboard/users/CreateUserDialog';
import ToggleStatusDialog from '@/components/modules/dashboard/users/ToggleStatusDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { apiClient } from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  ShieldAlert,
  ShieldBan,
  UserCheck,
  UserCog,
  UserPlus,
  UserX,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  PROJECT_MANAGER: 'Project Manager',
  TEAM_MEMBER: 'Team Member',
};

const ROLE_STYLES: Record<string, string> = {
  ADMIN: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
  PROJECT_MANAGER: 'bg-violet-500/10 text-violet-500 border border-violet-500/20',
  TEAM_MEMBER: 'bg-primary/10 text-primary border border-primary/20',
};

const ROLE_ICONS: Record<string, React.ElementType> = {
  ADMIN: ShieldAlert,
  PROJECT_MANAGER: Shield,
  TEAM_MEMBER: ShieldBan,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function UsersContent() {
  const { user: currentUser } = useAuthStore();
  const router = useRouter();
  const isAdmin = currentUser?.role === 'ADMIN';

  // ── Filter & pagination state ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const limit = 10;

  // ── Action dialog state ────────────────────────────────────────────────────
  const [changeRoleTarget, setChangeRoleTarget] = useState<UserRow | null>(null);
  const [toggleStatusTarget, setToggleStatusTarget] = useState<UserRow | null>(null);

  // ── Fetch users ────────────────────────────────────────────────────────────
  const { data: usersData, isLoading, isError } = useQuery({
    queryKey: ['users', { searchTerm, roleFilter, statusFilter, sortBy, sortOrder, page }],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page,
        limit,
        sortBy,
        sortOrder,
      };
      if (searchTerm) params.searchTerm = searchTerm;
      if (roleFilter && roleFilter !== 'ALL') params.role = roleFilter;
      if (statusFilter && statusFilter !== 'ALL') params.status = statusFilter;

      const res = await apiClient.get('/api/v1/users', { params });
      return res.data;
    },
    enabled: isAdmin,
  });

  const users: UserRow[] = usersData?.data ?? [];
  const meta = usersData?.meta ?? { page: 1, limit, total: 0 };
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));

  // ── Helpers ────────────────────────────────────────────────────────────────
  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const isFiltered = !!(searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL');

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setPage(1);
  };

  // ── Access guard ───────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center">
          <ShieldBan className="h-7 w-7 text-rose-500" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Only administrators can manage users. Contact your admin if you need access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground animate-in slide-in-from-top-4 duration-300">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage accounts, roles, and access across your workspace.
          </p>
        </div>
        <CreateUserDialog>
          <Button
            id="create-user-btn"
            className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs h-9 font-semibold flex items-center gap-2 w-full md:w-auto justify-center px-4"
          >
            <UserPlus className="h-4 w-4" /> Create User
          </Button>
        </CreateUserDialog>
      </div>

      {/* ── Toolbar ── */}
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
          'p-3.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm',
        )}
      >
        {/* Left: search + filters */}
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative group flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
            <Input
              id="user-search-input"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-9 text-xs border-border bg-background/60 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
            />
          </div>

          {/* Role filter */}
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v ?? 'ALL'); setPage(1); }}>
            <SelectTrigger
              id="role-filter"
              className={cn(
                'w-[155px] h-9 text-xs border-dashed transition-all',
                roleFilter !== 'ALL'
                  ? 'border-primary/50 bg-primary/10 text-primary font-semibold'
                  : 'border-border bg-card/60 text-foreground',
              )}
            >
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover text-popover-foreground">
              <SelectItem value="ALL" className="text-xs focus:bg-accent focus:text-accent-foreground">All Roles</SelectItem>
              <SelectItem value="ADMIN" className="text-xs focus:bg-accent focus:text-accent-foreground">Admin</SelectItem>
              <SelectItem value="PROJECT_MANAGER" className="text-xs focus:bg-accent focus:text-accent-foreground">Project Manager</SelectItem>
              <SelectItem value="TEAM_MEMBER" className="text-xs focus:bg-accent focus:text-accent-foreground">Team Member</SelectItem>
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v ?? 'ALL'); setPage(1); }}>
            <SelectTrigger
              id="status-filter"
              className={cn(
                'w-[140px] h-9 text-xs border-dashed transition-all',
                statusFilter !== 'ALL'
                  ? 'border-primary/50 bg-primary/10 text-primary font-semibold'
                  : 'border-border bg-card/60 text-foreground',
              )}
            >
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover text-popover-foreground">
              <SelectItem value="ALL" className="text-xs focus:bg-accent focus:text-accent-foreground">All Status</SelectItem>
              <SelectItem value="active" className="text-xs focus:bg-accent focus:text-accent-foreground">Active</SelectItem>
              <SelectItem value="inactive" className="text-xs focus:bg-accent focus:text-accent-foreground">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => { setSortBy(v ?? 'createdAt'); setPage(1); }}>
            <SelectTrigger
              id="sort-by-filter"
              className="w-[140px] h-9 text-xs border-border bg-card/60 text-foreground"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover text-popover-foreground">
              <SelectItem value="createdAt" className="text-xs focus:bg-accent focus:text-accent-foreground">Join Date</SelectItem>
              <SelectItem value="name" className="text-xs focus:bg-accent focus:text-accent-foreground">Name</SelectItem>
              <SelectItem value="email" className="text-xs focus:bg-accent focus:text-accent-foreground">Email</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); setPage(1); }}
            title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            className="h-9 w-9 border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-9 px-3 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
            >
              <XCircle className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>

        {/* Right: total count */}
        {!isLoading && (
          <span className="text-[11px] text-muted-foreground shrink-0 hidden sm:block">
            {meta.total} user{meta.total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        {/* Scroll wrapper */}
        <div className="relative w-full overflow-x-auto">
          <table className="w-full min-w-[640px] table-auto border-collapse text-sm">
            {/* Header */}
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="h-11 px-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap w-[260px]">
                  User
                </th>
                <th className="h-11 px-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Role
                </th>
                <th className="h-11 px-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="h-11 px-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Joined
                </th>
                <th className="h-11 px-4 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="h-14 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted/60" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-24 rounded bg-muted/60" />
                          <div className="h-2.5 w-36 rounded bg-muted/40" />
                        </div>
                      </div>
                    </td>
                    <td className="h-14 px-4"><div className="h-5 w-24 rounded-full bg-muted/60" /></td>
                    <td className="h-14 px-4"><div className="h-5 w-16 rounded-full bg-muted/60" /></td>
                    <td className="h-14 px-4"><div className="h-3 w-20 rounded bg-muted/40" /></td>
                    <td className="h-14 px-4 text-right"><div className="h-7 w-7 rounded bg-muted/40 ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="h-36 text-center text-sm text-muted-foreground">
                    Failed to load users. Please refresh.
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-36 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserCog className="h-8 w-8 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">
                        {isFiltered ? 'No users match your filters.' : 'No users found.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const initials = user.name.substring(0, 2).toUpperCase();
                  const RoleIcon = ROLE_ICONS[user.role] ?? Shield;
                  const isSelf = user.id === currentUser?.id;

                  return (
                    <tr
                      key={user.id}
                      className="group hover:bg-muted/20 transition-colors duration-150"
                    >
                      {/* Avatar + Name + Email */}
                      <td className="h-14 px-4 max-w-[260px]">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-border/60 shrink-0">
                            <AvatarImage
                              src={user.avatarUrl ?? undefined}
                              alt={user.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/users/${user.id}`}
                                className="text-xs font-semibold text-foreground hover:text-primary transition-colors truncate"
                              >
                                {user.name}
                              </Link>
                              {isSelf && (
                                <Badge className="text-[9px] px-1 py-0 bg-primary/10 text-primary border border-primary/20 font-medium">
                                  You
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground/70 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="h-14 px-4 whitespace-nowrap">
                        <Badge
                          className={cn(
                            'text-[10px] px-2 py-0.5 font-semibold flex items-center gap-1 w-fit',
                            ROLE_STYLES[user.role],
                          )}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {ROLE_LABELS[user.role] ?? user.role}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="h-14 px-4 whitespace-nowrap">
                        {user.isActive ? (
                          <Badge className="text-[10px] px-2 py-0.5 font-semibold flex items-center gap-1 w-fit bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="text-[10px] px-2 py-0.5 font-semibold flex items-center gap-1 w-fit bg-muted text-muted-foreground border border-border">
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </Badge>
                        )}
                      </td>

                      {/* Joined date */}
                      <td className="h-14 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                          <Calendar className="h-3 w-3 text-muted-foreground/50" />
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="h-14 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm",
                                  "text-indigo-500 bg-indigo-500/5 hover:bg-indigo-500 hover:text-white border border-indigo-500/10 hover:border-indigo-500"
                                )}
                                onClick={() => router.push(`/users/${user.id}`)}
                                id={`view-profile-${user.id}`}
                              >
                                <UserCog className="h-4 w-4" />
                                <span className="sr-only">View Profile</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Profile</TooltipContent>
                          </Tooltip>

                          {!isSelf && (
                            <>
                              {/* Change Role */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                      "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm",
                                      "text-amber-500 bg-amber-500/5 hover:bg-amber-500 hover:text-white border border-amber-500/10 hover:border-amber-500"
                                    )}
                                    onClick={() => setChangeRoleTarget(user)}
                                    id={`change-role-${user.id}`}
                                  >
                                    <Shield className="h-4 w-4" />
                                    <span className="sr-only">Change Role</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Change Role</TooltipContent>
                              </Tooltip>

                              {/* Toggle Status */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                      "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm",
                                      user.isActive
                                        ? "text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white border border-rose-500/10 hover:border-rose-500"
                                        : "text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white border border-emerald-500/10 hover:border-emerald-500"
                                    )}
                                    onClick={() => setToggleStatusTarget(user)}
                                    id={`toggle-status-${user.id}`}
                                  >
                                    {user.isActive ? (
                                      <UserX className="h-4 w-4" />
                                    ) : (
                                      <UserCheck className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                      {user.isActive ? 'Deactivate' : 'Activate'}
                                    </span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {user.isActive ? 'Deactivate User' : 'Activate User'}
                                </TooltipContent>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="text-[11px] text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/40 font-medium">
            {meta.total === 0 ? (
              'No results'
            ) : (
              <>
                Showing{' '}
                <span className="text-foreground font-semibold font-mono">
                  {(page - 1) * limit + 1}
                </span>{' '}
                –{' '}
                <span className="text-foreground font-semibold font-mono">
                  {Math.min(page * limit, meta.total)}
                </span>{' '}
                of{' '}
                <span className="text-foreground font-semibold font-mono">{meta.total}</span>{' '}
                users
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-muted/30 p-1 rounded-xl border border-border/40">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="h-7 w-7 rounded-lg hover:bg-primary hover:text-white disabled:opacity-30 transition-all"
              title="First page"
            >
              <ChevronLeft className="h-4 w-4 mr-[-4px]" />
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="h-7 w-7 rounded-lg hover:bg-primary hover:text-white disabled:opacity-30 transition-all"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center font-mono text-sm px-2 gap-1">
              <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-l-md border border-primary/20 text-xs">
                {page}
              </span>
              <span className="bg-muted px-2 py-0.5 rounded-r-md border border-l-0 border-border/40 text-muted-foreground font-medium text-xs">
                {totalPages}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="h-7 w-7 rounded-lg hover:bg-primary hover:text-white disabled:opacity-30 transition-all"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
              className="h-7 w-7 rounded-lg hover:bg-primary hover:text-white disabled:opacity-30 transition-all"
              title="Last page"
            >
              <ChevronRight className="h-4 w-4 ml-[-4px]" />
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Dialogs ── */}
      {changeRoleTarget && (
        <ChangeRoleDialog
          open={!!changeRoleTarget}
          onOpenChange={(open) => !open && setChangeRoleTarget(null)}
          userId={changeRoleTarget.id}
          userName={changeRoleTarget.name}
          currentRole={changeRoleTarget.role}
        />
      )}

      {toggleStatusTarget && (
        <ToggleStatusDialog
          open={!!toggleStatusTarget}
          onOpenChange={(open) => !open && setToggleStatusTarget(null)}
          userId={toggleStatusTarget.id}
          userName={toggleStatusTarget.name}
          currentStatus={toggleStatusTarget.isActive}
        />
      )}
    </div>
  );
}
