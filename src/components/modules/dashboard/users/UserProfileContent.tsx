'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  PROJECT_MANAGER: 'Project Manager',
  TEAM_MEMBER: 'Team Member',
};

interface UserProfileContentProps {
  profileId: string;
}

export default function UserProfileContent({ profileId }: UserProfileContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser, updateUser } = useAuthStore();

  const isOwnProfile = !!currentUser?.id && currentUser.id === profileId;

  const [name, setName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Change Password state ─────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Fetch profile ──────────────────────────────────────────────────────────
  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ['users', profileId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/users/${profileId}`);
      // Support both { data: { ... } } and { id: ... } response shapes
      return res.data?.data ?? res.data;
    },
    enabled: !!profileId,
    retry: 1,
  });

  useEffect(() => {
    if (profileData?.name) {
      setName(profileData.name);
    }
  }, [profileData]);

  // ── Update profile ─────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (name && name.trim() !== profileData?.name) {
        formData.append('name', name.trim());
      }
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await apiClient.patch(
        `/api/v1/users/${profileId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return res.data?.data ?? res.data;
    },
    onSuccess: (updated) => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['users', profileId] });

      // Patch the auth store if updating own profile
      if (isOwnProfile) {
        updateUser({
          name: updated.name,
          avatarUrl: updated.avatarUrl,
        });
      }

      setAvatarFile(null);
      setAvatarPreview(null);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
    },
  });

  // ── Change Password mutation ──────────────────────────────────────────────
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await apiClient.post('/api/v1/auth/change-password', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to change password.';
      toast.error(msg);
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Avatar must be under 10 MB.');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      toast.error('Name must be at least 2 characters.');
      return;
    }
    // Nothing changed
    if (trimmedName === profileData?.name && !avatarFile) {
      toast.info('No changes to save.');
      return;
    }
    updateMutation.mutate();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      toast.error('New password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      toast.error('New password must contain at least one number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      toast.error('New password must be different from the current password.');
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6EEFC0] border-t-transparent" />
      </div>
    );
  }

  // ── Error / not found ──────────────────────────────────────────────────────
  if (isError || !profileData) {
    return (
      <div className="text-center py-16 border border-border rounded-xl bg-card/20">
        <p className="text-muted-foreground mb-4 text-sm">User not found or you don't have access.</p>
        <Button
          onClick={() => router.back()}
          className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const displayAvatar = avatarPreview || profileData.avatarUrl || undefined;
  const initials = (profileData.name || 'U').trim().substring(0, 2).toUpperCase();
  const hasChanges = name.trim() !== profileData.name || !!avatarFile;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10 animate-in fade-in duration-300">
      {/* Back nav */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-muted-foreground hover:text-foreground hover:bg-accent gap-1.5 px-3 py-1.5"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      {/* ── Hero banner ── */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card/30">
        {/* Mint gradient decorative strip */}
        <div className="h-28 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        </div>

        <div className="px-4 sm:px-6 pb-6 -mt-14 relative">
          {/* Avatar with camera overlay */}
          <div className="relative inline-block group">
            <Avatar className="h-24 w-24 border-4 border-background shadow-2xl">
              <AvatarImage src={displayAvatar} alt={profileData.name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold border border-primary/25">
                {initials}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors ring-2 ring-background"
                title="Change avatar"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Hidden file input — always rendered so ref is valid */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpg,image/jpeg,image/png,image/gif"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{profileData.name}</h1>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
                  {ROLE_LABELS[profileData.role] ?? profileData.role}
                </Badge>
                {profileData.isActive !== false ? (
                  <Badge className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-xs flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </Badge>
                ) : (
                  <Badge className="bg-muted text-muted-foreground text-xs">Inactive</Badge>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0">
              <Calendar className="h-3.5 w-3.5" />
              Joined {new Date(profileData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue={isOwnProfile ? 'edit' : 'info'}>
        <TabsList className="bg-card border border-border p-1 gap-1 w-full sm:w-auto flex overflow-x-auto whitespace-nowrap scrollbar-none">
          {isOwnProfile && (
            <TabsTrigger
              value="edit"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold text-muted-foreground"
            >
              Edit Profile
            </TabsTrigger>
          )}
          {isOwnProfile && (
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold text-muted-foreground"
            >
              Change Password
            </TabsTrigger>
          )}
          <TabsTrigger
            value="info"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold text-muted-foreground"
          >
            Account Info
          </TabsTrigger>
        </TabsList>

        {/* ── Edit tab (own profile only) ── */}
        {isOwnProfile && (
          <TabsContent value="edit" className="mt-4">
            <Card className="border-border bg-card/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground text-base font-bold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Update Profile
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Update your display name and profile picture.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                  {/* Avatar preview banner */}
                  {avatarPreview && (
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 border border-primary/20 animate-in fade-in duration-200">
                      <Avatar className="h-14 w-14 border-2 border-primary/30">
                        <AvatarImage src={avatarPreview || undefined} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-primary">New avatar selected</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{avatarFile?.name}</p>
                        <button
                          type="button"
                          onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                          className="text-xs text-rose-500 hover:text-rose-455 mt-0.5 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="profile-name" className="text-foreground/90 font-medium">
                      Display Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="pl-9 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
                      />
                    </div>
                  </div>

                  {/* Email — read-only */}
                  <div className="space-y-2">
                    <Label className="text-foreground/90 font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
                      <Input
                        value={profileData.email}
                        disabled
                        className="pl-9 border-border bg-muted/20 text-muted-foreground/60 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground/60">Email address cannot be changed.</p>
                  </div>

                  {/* Role — read-only */}
                  <div className="space-y-2">
                    <Label className="text-foreground/90 font-medium">Role</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
                      <Input
                        value={ROLE_LABELS[profileData.role] ?? profileData.role}
                        disabled
                        className="pl-9 border-border bg-muted/20 text-muted-foreground/60 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground/60">Role is managed by an administrator.</p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending || !hasChanges}
                      className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold min-w-[130px]"
                    >
                      {updateMutation.isPending ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving…</>
                      ) : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* ── Security / Change Password tab (own profile only) ── */}
        {isOwnProfile && (
          <TabsContent value="security" className="mt-4">
            <Card className="border-border bg-card/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground text-base font-bold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" /> Change Password
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-5">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-foreground/90 font-medium">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="pl-9 pr-10 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-foreground/90 font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="pl-9 pr-10 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground/60">
                      Minimum 8 characters, at least one uppercase letter and one number.
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-foreground/90 font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="pl-9 pr-10 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-rose-500">Passwords do not match.</p>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={
                        changePasswordMutation.isPending ||
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword ||
                        newPassword !== confirmPassword
                      }
                      className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold min-w-[160px]"
                    >
                      {changePasswordMutation.isPending ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Updating…</>
                      ) : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* ── Info tab ── */}
        <TabsContent value="info" className="mt-4">
          <Card className="border-border bg-card/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Account Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-border/40">
                {[
                  { label: 'Full Name',     value: profileData.name,  Icon: User },
                  { label: 'Email',         value: profileData.email, Icon: Mail },
                  { label: 'Role',          value: ROLE_LABELS[profileData.role] ?? profileData.role, Icon: Shield },
                  { label: 'Member Since',  value: new Date(profileData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), Icon: Calendar },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="flex items-center gap-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="text-sm font-semibold text-foreground">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
