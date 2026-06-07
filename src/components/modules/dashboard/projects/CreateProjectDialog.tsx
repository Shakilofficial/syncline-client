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

const CreateProjectDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'COMPLETED' | 'ON_HOLD'>('ACTIVE');

  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string; deadline?: string; status?: string }) => {
      const res = await apiClient.post('/api/v1/projects', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Project created successfully!');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create project';
      toast.error(message);
    },
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setDeadline('');
    setStatus('ACTIVE');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || name.length < 2) {
      toast.error('Project name must be at least 2 characters.');
      return;
    }
    createProjectMutation.mutate({
      name,
      description: description || undefined,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-border bg-popover text-popover-foreground sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold brand-gradient-text">
            Create Project
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Fill in the details below to create a new workspace project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-foreground text-xs font-semibold">Project Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40 text-xs h-9"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-foreground text-xs font-semibold">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="e.g. Redesigning corporate portal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40 text-xs h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deadline" className="text-foreground text-xs font-semibold">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40 text-xs h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-foreground text-xs font-semibold">Status</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger className="border-border bg-background/50 text-foreground text-xs h-9">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                <SelectItem value="ACTIVE" className="focus:bg-accent focus:text-accent-foreground text-xs">Active</SelectItem>
                <SelectItem value="ON_HOLD" className="focus:bg-accent focus:text-accent-foreground text-xs">On Hold</SelectItem>
                <SelectItem value="COMPLETED" className="focus:bg-accent focus:text-accent-foreground text-xs">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-accent text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-4"
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
