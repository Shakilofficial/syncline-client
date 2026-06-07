'use client';

import { Button } from '@/components/ui/button';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const ROLE_OPTIONS = [
  { value: 'TEAM_MEMBER', label: 'Team Member' },
  { value: 'PROJECT_MANAGER', label: 'Project Manager' },
  { value: 'ADMIN', label: 'Admin' },
];

interface CreateUserDialogProps {
  children?: React.ReactNode;
}

const CreateUserDialog = ({ children }: CreateUserDialogProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TEAM_MEMBER');
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('TEAM_MEMBER');
    setShowPassword(false);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/api/v1/auth/create-user', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      return res.data?.data ?? res.data;
    },
    onSuccess: (data) => {
      toast.success(`User "${data.name}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || 'Failed to create user.';
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error('Name must be at least 2 characters.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (password.length < 8 || password.length > 72) {
      toast.error('Password must be between 8 and 72 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      toast.error('Password must contain at least one number.');
      return;
    }

    mutation.mutate();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {children ?? (
          <Button
            id="create-user-btn"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 font-semibold flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" /> Create User
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        id="create-user-dialog"
        className="sm:max-w-md border-border bg-card text-foreground"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <UserPlus className="h-4 w-4 text-primary" /> Create New User
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Create an account with any role. The user can change their password later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-name" className="text-xs font-semibold text-foreground/80">
              Full Name
            </Label>
            <Input
              id="cu-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Smith"
              className="h-9 text-sm border-border bg-background/60 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
              autoComplete="off"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-email" className="text-xs font-semibold text-foreground/80">
              Email Address
            </Label>
            <Input
              id="cu-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="h-9 text-sm border-border bg-background/60 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
              autoComplete="off"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-password" className="text-xs font-semibold text-foreground/80">
              Password
            </Label>
            <div className="relative">
              <Input
                id="cu-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                className="h-9 pr-10 text-sm border-border bg-background/60 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-role" className="text-xs font-semibold text-foreground/80">
              Role
            </Label>
            <Select value={role} onValueChange={(val) => setRole(val ?? 'TEAM_MEMBER')}>
              <SelectTrigger
                id="cu-role"
                className="h-9 text-sm border-border bg-background/60 text-foreground focus:ring-primary/40"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-sm focus:bg-accent focus:text-accent-foreground"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2 gap-2 flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setOpen(false); resetForm(); }}
              className="border-border text-muted-foreground hover:text-foreground h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-xs font-semibold min-w-[120px]"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Creating…
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
