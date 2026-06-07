'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from '@/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Member {
  user: {
    id: string;
    name: string;
  };
}

interface CreateTaskDialogProps {
  projectId: string;
  members: Member[];
  children: React.ReactNode;
}

const CreateTaskDialog = ({ projectId, members, children }: CreateTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'COMPLETED'>('TODO');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('NONE');

  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post(`/api/v1/projects/${projectId}/tasks`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Task created successfully!');
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setStatus('TODO');
    setDueDate('');
    setAssigneeId('NONE');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || title.length < 2) {
      toast.error('Task title must be at least 2 characters.');
      return;
    }

    const payload: any = {
      title,
      description: description || undefined,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      assigneeId: assigneeId !== 'NONE' ? assigneeId : undefined,
    };

    createTaskMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-border bg-popover text-popover-foreground sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold brand-gradient-text">
            Create Task
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Define task titles, details, assignments, and due dates.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-3">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-foreground text-xs font-semibold">Task Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Design Database Schema"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40 text-xs h-9"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-foreground text-xs font-semibold">Description</Label>
            <Input
              id="description"
              placeholder="Provide a detailed task brief"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40 text-xs h-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="priority" className="text-foreground text-xs font-semibold">Priority</Label>
              <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                <SelectTrigger className="border-border bg-background/50 text-foreground text-xs h-9">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover text-popover-foreground">
                  <SelectItem value="LOW" className="focus:bg-accent focus:text-accent-foreground text-xs">Low</SelectItem>
                  <SelectItem value="MEDIUM" className="focus:bg-accent focus:text-accent-foreground text-xs">Medium</SelectItem>
                  <SelectItem value="HIGH" className="focus:bg-accent focus:text-accent-foreground text-xs">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-foreground text-xs font-semibold">Initial Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="border-border bg-background/50 text-foreground text-xs h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover text-popover-foreground">
                  <SelectItem value="TODO" className="focus:bg-accent focus:text-accent-foreground text-xs">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS" className="focus:bg-accent focus:text-accent-foreground text-xs">In Progress</SelectItem>
                  <SelectItem value="COMPLETED" className="focus:bg-accent focus:text-accent-foreground text-xs">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dueDate" className="text-foreground text-xs font-semibold">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40 text-xs h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="assignee" className="text-foreground text-xs font-semibold">Assign To</Label>
            <Select value={assigneeId} onValueChange={(val) => setAssigneeId(val ?? 'NONE')}>
              <SelectTrigger className="border-border bg-background/50 text-foreground text-xs h-9">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                <SelectItem value="NONE" className="focus:bg-accent focus:text-accent-foreground text-xs">Unassigned</SelectItem>
                {members?.map((member) => (
                  <SelectItem 
                    key={member.user?.id} 
                    value={member.user?.id}
                    className="focus:bg-accent focus:text-accent-foreground text-xs"
                  >
                    {member.user?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-3 gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground hover:bg-accent text-xs h-9 px-4">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-4"
              disabled={createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
