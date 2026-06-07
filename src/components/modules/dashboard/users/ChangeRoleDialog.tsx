'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Shield } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ROLE_OPTIONS = [
  { value: 'TEAM_MEMBER', label: 'Team Member' },
  { value: 'PROJECT_MANAGER', label: 'Project Manager' },
  { value: 'ADMIN', label: 'Admin' },
];

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
  PROJECT_MANAGER: 'bg-violet-500/10 text-violet-500 border border-violet-500/20',
  TEAM_MEMBER: 'bg-primary/10 text-primary border border-primary/20',
};

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  currentRole: string;
}

const ChangeRoleDialog = ({
  open,
  onOpenChange,
  userId,
  userName,
  currentRole,
}: ChangeRoleDialogProps) => {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.patch(`/api/v1/users/${userId}/role`, {
        role: selectedRole,
      });
      return res.data?.data ?? res.data;
    },
    onSuccess: () => {
      toast.success(`Role updated for ${userName}`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update role.';
      toast.error(msg);
    },
  });

  const hasChanged = selectedRole !== currentRole;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="change-role-dialog"
        className="sm:max-w-sm border-border bg-card text-foreground"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Shield className="h-4 w-4 text-primary" /> Change Role
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Update the role for{' '}
            <span className="font-semibold text-foreground">{userName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          {/* Current role */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
            <span className="text-xs text-muted-foreground font-medium">Current Role</span>
            <Badge className={`text-xs ${ROLE_COLORS[currentRole] ?? ''}`}>
              {ROLE_OPTIONS.find((r) => r.value === currentRole)?.label ?? currentRole}
            </Badge>
          </div>

          {/* New role select */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-foreground/80">New Role</span>
            <Select
              value={selectedRole}
              onValueChange={(val) => setSelectedRole(val ?? currentRole)}
            >
              <SelectTrigger
                id="change-role-select"
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
        </div>

        <DialogFooter className="pt-2 gap-2 flex-row justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border text-muted-foreground hover:text-foreground h-9 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={mutation.isPending || !hasChanged}
            onClick={() => mutation.mutate()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-xs font-semibold min-w-[110px]"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Saving…
              </>
            ) : (
              'Save Role'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRoleDialog;
