'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { apiClient } from '@/lib/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  Bell,
  Check,
  CheckCheck,
  ClipboardList,
  FolderKanban,
  Inbox,
  Link2,
  MessageSquare,
  Paperclip,
  RefreshCw,
  Search,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

// Helper to determine notification category visual config
const getNotificationConfig = (title: string) => {
  const t = title.toLowerCase();
  
  if (t.includes('comment')) {
    return {
      icon: MessageSquare,
      colorClass: 'text-blue-500 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/8 border-blue-500/20 dark:border-blue-500/15',
      badgeClass: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20',
      category: 'Comment',
    };
  }
  if (t.includes('assign')) {
    return {
      icon: ClipboardList,
      colorClass: 'text-[#6EEFC0] bg-[#6EEFC0]/10 dark:text-[#6EEFC0] dark:bg-[#6EEFC0]/8 border-[#6EEFC0]/20 dark:border-[#6EEFC0]/15',
      badgeClass: 'bg-[#6EEFC0]/10 text-[#6EEFC0] border-[#6EEFC0]/20',
      category: 'Task Assignment',
    };
  }
  if (t.includes('create') && t.includes('task')) {
    return {
      icon: ClipboardList,
      colorClass: 'text-emerald-500 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/8 border-emerald-500/20 dark:border-emerald-500/15',
      badgeClass: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20',
      category: 'Task Created',
    };
  }
  if (t.includes('update') || t.includes('status')) {
    return {
      icon: RefreshCw,
      colorClass: 'text-amber-500 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/8 border-amber-500/20 dark:border-amber-500/15',
      badgeClass: 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20',
      category: 'Update',
    };
  }
  if (t.includes('added to project') || t.includes('project member') || t.includes('joined')) {
    return {
      icon: FolderKanban,
      colorClass: 'text-indigo-500 bg-indigo-500/10 dark:text-indigo-400 dark:bg-indigo-500/8 border-indigo-500/20 dark:border-indigo-500/15',
      badgeClass: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20',
      category: 'Project',
    };
  }
  if (t.includes('remove') || t.includes('delete')) {
    return {
      icon: AlertCircle,
      colorClass: 'text-rose-500 bg-rose-500/10 dark:text-rose-400 dark:bg-rose-500/8 border-rose-500/20 dark:border-rose-500/15',
      badgeClass: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20',
      category: 'Action Required',
    };
  }
  if (t.includes('attachment') || t.includes('file')) {
    return {
      icon: Paperclip,
      colorClass: 'text-sky-500 bg-sky-500/10 dark:text-sky-400 dark:bg-sky-500/8 border-sky-500/20 dark:border-sky-500/15',
      badgeClass: 'bg-sky-500/10 text-sky-500 dark:text-sky-400 border-sky-500/20',
      category: 'Attachment',
    };
  }

  // Fallback
  return {
    icon: Bell,
    colorClass: 'text-primary bg-primary/10 border-primary/20 dark:border-primary/15',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    category: 'Notification',
  };
};

// Helper to format timestamps to relative readable duration strings
const formatRelativeTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay} days ago`;
    
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

export default function NotificationsContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>('unread'); // default to showing unread first
  const [page, setPage] = useState(1);

  // Fetch notifications
  const { data: notificationsData, isLoading, isError } = useQuery({
    queryKey: ['notifications', { searchTerm, status, page }],
    queryFn: async () => {
      const params: any = { page, limit: 10 };
      if (searchTerm) params.searchTerm = searchTerm;
      if (status && status !== 'all') params.status = status;

      const res = await apiClient.get('/api/v1/notifications', { params });
      return res.data;
    },
  });

  const notifications = notificationsData?.data || [];
  const meta = notificationsData?.meta || { page: 1, limit: 10, total: 0 };
  const totalPages = Math.ceil(meta.total / meta.limit);

  // 1. Mark as Read Mutation
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/api/v1/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification marked as read.');
    },
    onError: () => {
      toast.error('Failed to update notification.');
    },
  });

  // 2. Mark All Read Mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await apiClient.patch('/api/v1/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read.');
    },
    onError: () => {
      toast.error('Failed to mark all as read.');
    },
  });

  // 3. Delete Notification Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted.');
    },
    onError: () => {
      toast.error('Failed to delete notification.');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground animate-in fade-in slide-in-from-top-4 duration-300">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Stay updated on your tasks, project invites, and team comments.
          </p>
        </div>
        {status === 'unread' && notifications.length > 0 && (
          <Button 
            onClick={() => markAllReadMutation.mutate()} 
            disabled={markAllReadMutation.isPending}
            className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center gap-2 w-full md:w-auto justify-center shadow-sm transition-all duration-200"
          >
            <CheckCheck className="h-4 w-4" /> Mark All as Read
          </Button>
        )}
      </div>

      {/* Filters Control Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center p-3 rounded-xl bg-card/25 backdrop-blur-md border border-border/40 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-9 border-border bg-background/40 backdrop-blur-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
          />
        </div>

        {/* Read/Unread Filter */}
        <Select 
          value={status} 
          onValueChange={(val) => {
            setStatus(val ?? 'unread');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[140px] border-border bg-background/40 backdrop-blur-sm text-foreground">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover text-popover-foreground">
            <SelectItem value="unread" className="focus:bg-accent focus:text-accent-foreground">Unread</SelectItem>
            <SelectItem value="read" className="focus:bg-accent focus:text-accent-foreground">Read</SelectItem>
            <SelectItem value="all" className="focus:bg-accent focus:text-accent-foreground">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications Feed List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="h-24 border-border bg-card/20 backdrop-blur-md animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-muted-foreground border border-border rounded-xl bg-card/20">
          Failed to load notifications.
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border border-border rounded-xl bg-card/20 flex flex-col items-center gap-3">
          <Inbox className="h-10 w-10 text-muted-foreground/50 animate-bounce" />
          <p className="text-sm">No notifications found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif: any) => {
            const config = getNotificationConfig(notif.title);
            const IconComponent = config.icon;
            return (
              <Card 
                key={notif.id} 
                className={`group border-border/40 transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
                  notif.isRead 
                    ? 'bg-card/20 text-muted-foreground/70 opacity-80 hover:opacity-100 hover:bg-card/25 shadow-sm' 
                    : 'bg-card/45 text-foreground shadow-sm border-l-4 border-l-primary hover:shadow-md hover:bg-card/55 hover:translate-x-0.5'
                }`}
              >
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Icon container */}
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 transition-all duration-300 group-hover:scale-105 ${config.colorClass}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${config.badgeClass}`}>
                          {config.category}
                        </span>
                        <h3 className={`text-sm font-semibold leading-tight text-foreground ${notif.isRead ? 'opacity-75' : ''}`}>
                          {notif.title}
                        </h3>
                        {!notif.isRead && (
                          <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
                        )}
                      </div>
                      <p className={`text-xs text-muted-foreground leading-relaxed break-words ${notif.isRead ? 'opacity-80' : ''}`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
                        <span>{formatRelativeTime(notif.createdAt)}</span>
                        {formatRelativeTime(notif.createdAt) && <span>•</span>}
                        <span>{new Date(notif.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                    {notif.link && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.push(notif.link)}
                        className="h-8 w-8 text-primary hover:text-white hover:bg-primary bg-primary/5 border border-primary/10 rounded-lg transition-all duration-200"
                        title="View related details"
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                    )}
                    {!notif.isRead && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => markReadMutation.mutate(notif.id)}
                        disabled={markReadMutation.isPending}
                        className="h-8 w-8 text-emerald-500 hover:text-white hover:bg-emerald-500 bg-emerald-500/5 border border-emerald-500/10 rounded-lg transition-all duration-200"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteMutation.mutate(notif.id)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 text-rose-500 hover:text-white hover:bg-rose-500 bg-rose-500/5 border border-rose-500/10 rounded-lg transition-all duration-200"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-border bg-card/30 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-border bg-card/30 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
