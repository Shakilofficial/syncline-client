'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FolderOpen,
  MessageSquare,
  Paperclip,
  Send,
  Trash2,
  Upload,
  User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Member {
  user: {
    id: string;
    name: string;
  };
}

interface TaskDetailsSheetProps {
  taskId: string | null;
  projectId: string;
  members: Member[];
  onClose: () => void;
}

const TaskDetailsSheet = ({ taskId, projectId, members, onClose }: TaskDetailsSheetProps) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'COMPLETED'>('TODO');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string>('NONE');
  const [dueDate, setDueDate] = useState('');

  // ── 1. Fetch Task ─────────────────────────────────────────────────────────
  const { data: task, isLoading: isTaskLoading } = useQuery({
    queryKey: ['tasks', 'detail', taskId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/tasks/${taskId}`);
      return res.data.data ?? res.data;
    },
    enabled: !!taskId,
  });

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'TODO');
      setPriority(task.priority || 'MEDIUM');
      setAssigneeId(task.assigneeId || 'NONE');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : '');
    }
  }, [task]);

  // ── 2. Fetch Comments ─────────────────────────────────────────────────────
  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/tasks/${taskId}/comments`);
      return res.data.data ?? res.data;
    },
    enabled: !!taskId,
  });

  // ── 3. Fetch Attachments ──────────────────────────────────────────────────
  const { data: attachments = [], refetch: refetchAttachments } = useQuery({
    queryKey: ['attachments', taskId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/tasks/${taskId}/attachments`);
      return res.data.data ?? res.data;
    },
    enabled: !!taskId,
  });

  // ── 4. Update Task ────────────────────────────────────────────────────────
  const updateTaskMutation = useMutation({
    mutationFn: async (updatedFields: any) => {
      const res = await apiClient.patch(`/api/v1/tasks/${taskId}`, updatedFields);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', taskId] });
      toast.success('Task updated.');
    },
    onError: () => toast.error('Failed to update task.'),
  });

  // ── 5. Delete Task ────────────────────────────────────────────────────────
  const deleteTaskMutation = useMutation({
    mutationFn: async () => { await apiClient.delete(`/api/v1/tasks/${taskId}`); },
    onSuccess: () => {
      toast.success('Task deleted.');
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      onClose();
    },
    onError: () => toast.error('Failed to delete task.'),
  });

  // ── 6. Comments ───────────────────────────────────────────────────────────
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiClient.post(`/api/v1/tasks/${taskId}/comments`, { content });
      return res.data;
    },
    onSuccess: () => { setCommentText(''); refetchComments(); },
    onError: () => toast.error('Failed to post comment.'),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => { await apiClient.delete(`/api/v1/comments/${commentId}`); },
    onSuccess: () => refetchComments(),
    onError: () => toast.error('Failed to delete comment.'),
  });

  // ── 7. Attachments ────────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { toast.error('File size exceeds 50 MB.'); return; }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await apiClient.post(`/api/v1/tasks/${taskId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      refetchAttachments();
      toast.success('Attachment uploaded!');
    } catch {
      toast.error('Failed to upload attachment.');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteAttachmentMutation = useMutation({
    mutationFn: async (attachmentId: string) => { await apiClient.delete(`/api/v1/attachments/${attachmentId}`); },
    onSuccess: () => refetchAttachments(),
    onError: () => toast.error('Failed to delete attachment.'),
  });

  const triggerAutoSave = (fields: any) => {
    const cleaned = { ...fields };
    if (cleaned.assigneeId === 'NONE') cleaned.assigneeId = null;
    updateTaskMutation.mutate(cleaned);
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'HIGH':   return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[9px] py-0 px-1.5 font-medium">High</Badge>;
      case 'MEDIUM': return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] py-0 px-1.5 font-medium">Medium</Badge>;
      case 'LOW':    return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] py-0 px-1.5 font-medium">Low</Badge>;
      default:       return <Badge variant="outline" className="text-[9px] py-0 px-1.5">{prio}</Badge>;
    }
  };

  const UserChip = ({ name, avatarUrl }: { name?: string; avatarUrl?: string }) => (
    <div className="flex items-center gap-1.5">
      <Avatar className="h-5 w-5 shrink-0">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
        <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-bold border border-primary/25">
          {name?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs text-foreground">{name ?? '—'}</span>
    </div>
  );

  return (
    <Sheet open={!!taskId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-[560px] border-border bg-card text-foreground flex flex-col p-0 overflow-hidden">
        {isTaskLoading ? (
          <div className="flex flex-1 items-center justify-center h-full">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : !task ? (
          <div className="flex flex-1 items-center justify-center h-full text-muted-foreground text-xs">
            Task not found.
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-y-auto">
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/60 sticky top-0 z-10 backdrop-blur-sm">
              <SheetHeader className="text-left">
                <SheetTitle className="text-base font-bold text-foreground">Task Details</SheetTitle>
              </SheetHeader>
              <div className="flex items-center gap-2">
                {getPriorityBadge(priority)}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTaskMutation.mutate()}
                  disabled={deleteTaskMutation.isPending}
                  className="h-8 w-8 text-rose-500 hover:text-rose-400 hover:bg-muted"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 px-6 py-5 space-y-5">
              {/* ── Meta: Project · Creator · Created At ── */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-background/50 border border-border px-3 py-2.5">
                {/* Project */}
                {task.project && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FolderOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{task.project.name}</span>
                  </div>
                )}
                {/* Creator */}
                {task.creator && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-muted-foreground/70">by</span>
                    <UserChip name={task.creator.name} avatarUrl={task.creator.avatarUrl} />
                  </div>
                )}
                {/* Created date */}
                {task.createdAt && (
                  <span className="text-[10px] text-muted-foreground/60 ml-auto">
                    Created {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>

              {/* ── Title ── */}
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => task && title !== task.title && triggerAutoSave({ title })}
                  className="border-border bg-background/50 text-foreground font-semibold text-sm focus-visible:ring-primary/40 h-9"
                />
              </div>

              {/* ── Description ── */}
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Description</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => task && description !== task.description && triggerAutoSave({ description })}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background/50 p-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                  placeholder="Add a description..."
                />
              </div>

              {/* ── Status + Priority ── */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</Label>
                  <Select value={status} onValueChange={(val: any) => { setStatus(val); triggerAutoSave({ status: val }); }}>
                    <SelectTrigger className="border-border bg-background/50 text-foreground text-sm focus:ring-primary/40 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-popover text-popover-foreground">
                      <SelectItem value="TODO" className="focus:bg-accent focus:text-accent-foreground">To Do</SelectItem>
                      <SelectItem value="IN_PROGRESS" className="focus:bg-accent focus:text-accent-foreground">In Progress</SelectItem>
                      <SelectItem value="COMPLETED" className="focus:bg-accent focus:text-accent-foreground">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Priority</Label>
                  <Select value={priority} onValueChange={(val: any) => { setPriority(val); triggerAutoSave({ priority: val }); }}>
                    <SelectTrigger className="border-border bg-background/50 text-foreground text-sm focus:ring-primary/40 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-popover text-popover-foreground">
                      <SelectItem value="LOW" className="focus:bg-accent focus:text-accent-foreground">Low</SelectItem>
                      <SelectItem value="MEDIUM" className="focus:bg-accent focus:text-accent-foreground">Medium</SelectItem>
                      <SelectItem value="HIGH" className="focus:bg-accent focus:text-accent-foreground">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ── Due Date + Assignee ── */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Due Date</Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      triggerAutoSave({ dueDate: e.target.value ? new Date(e.target.value).toISOString() : null });
                    }}
                    className="border-border bg-background/50 text-foreground text-sm focus-visible:ring-primary/40 h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Assignee</Label>
                  <Select value={assigneeId} onValueChange={(val) => { setAssigneeId(val ?? 'NONE'); triggerAutoSave({ assigneeId: val ?? 'NONE' }); }}>
                    <SelectTrigger className="border-border bg-background/50 text-foreground text-sm focus:ring-primary/40 h-9">
                      <SelectValue>
                        {assigneeId && assigneeId !== 'NONE' && task.assignee?.id === assigneeId ? (
                          <UserChip name={task.assignee.name} avatarUrl={task.assignee.avatarUrl} />
                        ) : (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="border-border bg-popover text-popover-foreground">
                      <SelectItem value="NONE" className="focus:bg-accent focus:text-accent-foreground">Unassigned</SelectItem>
                      {members?.map((m) => (
                        <SelectItem key={m.user?.id} value={m.user?.id} className="focus:bg-accent focus:text-accent-foreground">
                          {m.user?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ── Attachments ── */}
              <div className="border-t border-border/60 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip className="h-3.5 w-3.5 text-primary" /> Attachments ({Array.isArray(attachments) ? attachments.length : 0})
                  </h4>
                  <Label className="cursor-pointer bg-background hover:bg-muted px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all text-foreground border border-border">
                    <Upload className="h-3.5 w-3.5 text-primary" /> {isUploading ? 'Uploading…' : 'Upload'}
                    <input type="file" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                  </Label>
                </div>
                {!Array.isArray(attachments) || attachments.length === 0 ? (
                  <p className="text-xs text-muted-foreground/60">No attachments yet.</p>
                ) : (
                  <div className="space-y-2">
                    {attachments.map((file: any) => (
                       <div key={file.id} className="flex items-center justify-between p-2 rounded-lg bg-background border border-border text-xs">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <a href={file.url} target="_blank" rel="noreferrer" className="truncate hover:text-primary hover:underline text-foreground">
                            {file.originalName}
                          </a>
                          <span className="text-[10px] text-muted-foreground/60">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteAttachmentMutation.mutate(file.id)} className="h-6 w-6 text-rose-500 hover:bg-muted shrink-0">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Comments ── */}
              <div className="border-t border-border/60 pt-4 space-y-3">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" /> Discussion ({Array.isArray(comments) ? comments.length : 0})
                </h4>

                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                  {!Array.isArray(comments) || comments.length === 0 ? (
                    <p className="text-xs text-muted-foreground/60">No comments yet. Start the discussion!</p>
                  ) : (
                    comments.map((comment: any) => (
                      <div key={comment.id} className="flex items-start justify-between gap-2 text-xs">
                        <div className="flex items-start gap-2">
                          <Avatar className="h-7 w-7 shrink-0">
                            {comment.author?.avatarUrl && <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />}
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold border border-primary/25">
                              {comment.author?.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">{comment.author?.name}</span>
                              <span className="text-[9px] text-muted-foreground/60">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-foreground/90 leading-relaxed bg-background/50 px-2.5 py-1.5 rounded-lg border border-border">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                        {comment.author?.id === currentUser?.id && (
                          <Button variant="ghost" size="icon" onClick={() => deleteCommentMutation.mutate(comment.id)} className="h-6 w-6 text-rose-500 hover:bg-muted shrink-0">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Comment input */}
                <form
                  onSubmit={(e) => { e.preventDefault(); if (commentText.trim()) addCommentMutation.mutate(commentText); }}
                  className="flex items-center gap-2 pt-2"
                >
                  <Input
                    placeholder="Write a comment…"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground/50 text-xs focus-visible:ring-primary/40 h-9"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!commentText.trim() || addCommentMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 w-9 shrink-0 font-bold"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailsSheet;
