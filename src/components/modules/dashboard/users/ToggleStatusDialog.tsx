'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { apiClient } from '@/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

interface ToggleStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  currentStatus: boolean; // true = active
}

const ToggleStatusDialog = ({
  open,
  onOpenChange,
  userId,
  userName,
  currentStatus,
}: ToggleStatusDialogProps) => {
  const queryClient = useQueryClient();
  const willActivate = !currentStatus;

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.patch(`/api/v1/users/${userId}/status`, {
        isActive: willActivate,
      });
      return res.data?.data ?? res.data;
    },
    onSuccess: () => {
      toast.success(
        `${userName} has been ${willActivate ? 'activated' : 'deactivated'}.`
      );
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update status.';
      toast.error(msg);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="toggle-status-dialog"
        className="sm:max-w-sm border-border bg-card text-foreground"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            {willActivate ? (
              <UserCheck className="h-4 w-4 text-emerald-500" />
            ) : (
              <UserX className="h-4 w-4 text-rose-500" />
            )}
            {willActivate ? 'Activate User' : 'Deactivate User'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            {willActivate ? (
              <>
                Are you sure you want to <span className="font-semibold text-emerald-500">activate</span>{' '}
                <span className="font-semibold text-foreground">{userName}</span>?
                They will regain access to the platform.
              </>
            ) : (
              <>
                Are you sure you want to <span className="font-semibold text-rose-500">deactivate</span>{' '}
                <span className="font-semibold text-foreground">{userName}</span>?
                All active sessions will be revoked immediately.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

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
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className={`h-9 text-xs font-semibold min-w-[110px] ${
              willActivate
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                {willActivate ? 'Activating…' : 'Deactivating…'}
              </>
            ) : willActivate ? (
              <>
                <UserCheck className="h-3.5 w-3.5 mr-1.5" />
                Activate
              </>
            ) : (
              <>
                <UserX className="h-3.5 w-3.5 mr-1.5" />
                Deactivate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToggleStatusDialog;
