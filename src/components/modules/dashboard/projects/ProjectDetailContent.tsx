'use client';

import KanbanBoard from '@/components/modules/dashboard/tasks/KanbanBoard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Search,
  Trash2,
  UserPlus,
  Users,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface ProjectDetailContentProps {
  projectId: string;
}

export default function ProjectDetailContent({ projectId }: ProjectDetailContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  // ── Invite Member state ─────────────────────────────────────────────────
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [logsPage, setLogsPage] = useState(1);

  // ── 1. Project data ──────────────────────────────────────────────────────
  const { data: project, isLoading: isProjectLoading, isError: isProjectError } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/projects/${projectId}`);
      return res.data.data ?? res.data;
    },
  });

  // ── 2. Activity logs ────────────────────────────────────────────────────
  const { data: logsData } = useQuery({
    queryKey: ['projects', projectId, 'activity-logs', logsPage],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/projects/${projectId}/activity-logs`, {
        params: { page: logsPage, limit: 10 },
      });
      return res.data;
    },
  });

  // ── 3. User search (for invite) ─────────────────────────────────────────
  const { data: searchData, isFetching: isSearching } = useQuery({
    queryKey: ['users', 'search', searchTerm],
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/users', {
        params: { searchTerm, limit: 8 },
      });
      return res.data.data ?? res.data;
    },
    enabled: searchTerm.length >= 2,
    staleTime: 0,
  });

  const searchResults: any[] = Array.isArray(searchData)
    ? searchData
    : searchData?.data ?? [];

  // Filter out already-members from search results
  const existingMemberIds = new Set(project?.members?.map((m: any) => m.user?.id) || []);
  const filteredResults = searchResults.filter((u) => !existingMemberIds.has(u.id));

  // ── 4. Invite Member mutation ───────────────────────────────────────────
  const inviteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiClient.post(`/api/v1/projects/${projectId}/members`, { userId });
      return res.data;
    },
    onSuccess: () => {
      toast.success(`${selectedUser?.name} added to the project!`);
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
      setIsInviteOpen(false);
      setSearchTerm('');
      setSelectedUser(null);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add member';
      toast.error(message);
    },
  });

  // ── 5. Remove Member mutation ───────────────────────────────────────────
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(`/api/v1/projects/${projectId}/members/${userId}`);
    },
    onSuccess: () => {
      toast.success('Member removed.');
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to remove member';
      toast.error(message);
    },
  });

  const handleInviteClose = useCallback(() => {
    setIsInviteOpen(false);
    setSearchTerm('');
    setSelectedUser(null);
  }, []);

  if (isProjectLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isProjectError || !project) {
    return (
      <div className="text-center py-12 text-muted-foreground border border-border rounded-xl bg-card/25">
        <p className="mb-4 text-xs">Project not found or access denied.</p>
        <Button onClick={() => router.push('/projects')} className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold h-9 px-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  const logs = logsData?.data || [];
  const logsMeta = logsData?.meta || { page: 1, limit: 10, total: 0 };
  const totalLogsPages = Math.ceil(logsMeta.total / logsMeta.limit);
  const isManager = currentUser?.role === 'ADMIN' || currentUser?.role === 'PROJECT_MANAGER';

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-rose-500/10 text-rose-450 border-rose-500/20',
    PROJECT_MANAGER: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    TEAM_MEMBER: 'bg-primary/10 text-primary border-primary/20',
  };

  const statusLabels: Record<string, string> = {
    TODO: 'Todo',
    IN_PROGRESS: 'In Progress',
    REVIEW: 'Review',
    DONE: 'Done',
  };

  const statusColors: Record<string, string> = {
    TODO: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    IN_PROGRESS: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    REVIEW: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    DONE: 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20',
  };

  const getLogContent = (log: any) => {
    const metadata = log.metadata || {};

    switch (log.action) {
      case 'TASK_CREATED':
        return {
          title: 'created a task',
          task: metadata.taskTitle,
        };

      case 'TASK_UPDATED':
        return {
          title: 'updated a task',
          task: metadata.taskTitle,
        };

      case 'TASK_DELETED':
        return {
          title: 'deleted a task',
          task: metadata.taskTitle,
        };

      case 'TASK_STATUS_CHANGED':
        return {
          title: 'changed task status',
          task: metadata.taskTitle,
          oldStatus: metadata.oldStatus,
          newStatus: metadata.newStatus,
        };

      case 'TASK_ASSIGNED':
        return {
          title: 'assigned a task',
          task: metadata.taskTitle,
          assignee: metadata.assigneeName,
        };

      case 'TASK_UNASSIGNED':
        return {
          title: 'unassigned a task',
          task: metadata.taskTitle,
        };

      case 'MEMBER_ADDED':
        return {
          title: 'added a member',
          member: metadata.memberName,
        };

      case 'MEMBER_REMOVED':
        return {
          title: 'removed a member',
          member: metadata.memberName,
        };

      case 'PROJECT_CREATED':
        return {
          title: 'created the project',
        };

      case 'PROJECT_UPDATED':
        return {
          title: 'updated project details',
        };

      default:
        return {
          title: log.action
            ?.replaceAll('_', ' ')
            ?.toLowerCase(),
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        onClick={() => router.push('/projects')}
        className="text-muted-foreground hover:text-foreground hover:bg-accent gap-1.5 px-3 py-1.5"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Button>

      {/* Project Banner */}
      <div className="border border-border bg-card/30 rounded-xl p-4 sm:p-6 flex flex-col justify-between gap-4 md:flex-row md:items-center animate-in fade-in duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{project.name}</h1>
            <Badge className="bg-primary/10 text-primary border border-primary/25">
              {project.status}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">{project.description || 'No description provided.'}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground/80 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'None'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {project.members?.length || 0} member{project.members?.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {isManager && (
          <Dialog open={isInviteOpen} onOpenChange={(o) => { if (!o) handleInviteClose(); else setIsInviteOpen(true); }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold gap-2 shrink-0">
                <UserPlus className="h-4 w-4" /> Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-popover text-popover-foreground sm:max-w-[440px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold brand-gradient-text">Invite Team Member</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Search by name or email to add a member to this project.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    placeholder="Search by name or email…"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setSelectedUser(null); }}
                    className="pl-9 h-9 text-xs border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 animate-spin" />
                  )}
                </div>

                {/* Selected user chip */}
                {selectedUser && (
                  <div className="flex items-center justify-between bg-primary/10 border border-primary/25 rounded-lg px-3 py-1.5 min-w-0 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{selectedUser.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{selectedUser.email}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-foreground shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Search results */}
                {searchTerm.length >= 2 && !selectedUser && (
                  <div className="rounded-lg border border-border bg-background/50 overflow-hidden max-h-[200px] overflow-y-auto">
                    {filteredResults.length === 0 && !isSearching ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        {searchTerm.length < 2 ? 'Type at least 2 characters…' : 'No users found.'}
                      </p>
                    ) : (
                      filteredResults.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => setSelectedUser({ id: u.id, name: u.name, email: u.email, role: u.role })}
                          className="w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 hover:bg-accent transition-colors text-left min-w-0"
                        >
                          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] sm:text-xs font-bold">
                              {u.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{u.name}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{u.email}</p>
                          </div>
                          <Badge className={`text-[9px] sm:text-[10px] border shrink-0 py-0.5 px-1.5 ${roleColors[u.role] || 'bg-muted text-muted-foreground'}`}>
                            {u.role?.replace('_', ' ')}
                          </Badge>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {searchTerm.length > 0 && searchTerm.length < 2 && (
                  <p className="text-xs text-muted-foreground/75 text-center">Type at least 2 characters to search…</p>
                )}
              </div>

              <DialogFooter>
                <Button variant="ghost" onClick={handleInviteClose} className="text-muted-foreground hover:text-foreground hover:bg-accent">
                  Cancel
                </Button>
                <Button
                  onClick={() => selectedUser && inviteMutation.mutate(selectedUser.id)}
                  disabled={!selectedUser || inviteMutation.isPending}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold min-w-[100px]"
                >
                  {inviteMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Adding…</> : 'Add Member'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="bg-card border border-border text-muted-foreground p-1 w-full grid grid-cols-3 md:flex md:w-auto justify-start mb-5 gap-1">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold text-xs py-1.5 md:py-1">
            Tasks
          </TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold text-xs py-1.5 md:py-1">
            Members ({project.members?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold text-xs py-1.5 md:py-1">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <KanbanBoard projectId={projectId} members={project.members} />
        </TabsContent>

        {/* Members */}
        <TabsContent value="members" className="space-y-4">
          <Card className="border-border bg-card/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-foreground font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Team Members
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Users with access to this project workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/60">
                {project.members?.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage
                          src={member.user?.avatarUrl}
                          alt={member.user?.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                          {member.user?.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{member.user?.name}</div>
                        <div className="text-xs text-muted-foreground">{member.user?.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`text-xs border ${roleColors[member.user?.role] || 'bg-muted text-muted-foreground'}`}>
                        {member.user?.role?.replace('_', ' ')}
                      </Badge>
                      {isManager && member.user?.id !== currentUser?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMemberMutation.mutate(member.user?.id)}
                          disabled={removeMemberMutation.isPending}
                          className="h-8 w-8 text-rose-500 hover:text-rose-455 hover:bg-accent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Logs */}
        <TabsContent value="logs" className="space-y-4">
          <Card className="border-border bg-card/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-foreground font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Activity Log
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Chronological record of all actions in this project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Activity className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No activity recorded yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-4">
                      {logs.map((log: any) => {
                        const activity = getLogContent(log);
                        return (
                          <div key={log.id} className="relative flex gap-4">
                            {/* Avatar */}
                            <div className="relative z-10 shrink-0">
                              <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                <AvatarImage
                                  src={log.user?.avatarUrl}
                                  alt={log.user?.name}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                  {log.user?.name
                                    ?.split(' ')
                                    .map((n: string) => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            {/* Content */}
                            <div className="flex-1 rounded-xl border border-border bg-card p-4 hover:bg-accent/20 transition-colors">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                <div className="space-y-2">
                                  <div>
                                    <span className="font-semibold text-foreground">
                                      {log.user?.name}
                                    </span>{' '}
                                    <span className="text-muted-foreground">
                                      {activity.title}
                                    </span>
                                  </div>

                                  {activity.task && (
                                    <div className="font-medium text-sm text-foreground">
                                      {activity.task}
                                    </div>
                                  )}

                                  {activity.member && (
                                    <div className="font-medium text-sm text-foreground">
                                      {activity.member}
                                    </div>
                                  )}

                                  {activity.assignee && (
                                    <Badge variant="outline" className="w-fit">
                                      Assigned to {activity.assignee}
                                    </Badge>
                                  )}

                                  {activity.oldStatus && activity.newStatus && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge variant="outline" className={statusColors[activity.oldStatus]}>
                                        {statusLabels[activity.oldStatus]}
                                      </Badge>
                                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                                      <Badge variant="outline" className={statusColors[activity.newStatus]}>
                                        {statusLabels[activity.newStatus]}
                                      </Badge>
                                    </div>
                                  )}
                                </div>

                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {totalLogsPages > 1 && (
                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Page {logsPage} of {totalLogsPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                          disabled={logsPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLogsPage((p) => Math.min(totalLogsPages, p + 1))}
                          disabled={logsPage === totalLogsPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
