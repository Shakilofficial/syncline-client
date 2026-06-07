'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function SignupForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (name.length < 2) {
      toast.error('Name must be at least 2 characters.');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/signup', { name, email, password });
      const { user, accessToken } = response.data.data;
      
      setAuth(user, accessToken);
      toast.success('Account created successfully! Welcome to Syncline.');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please check input formats.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/40 dark:border-border/60 bg-card/60 dark:bg-card/75 backdrop-blur-2xl text-foreground shadow-sm rounded-[2rem] border overflow-hidden p-2 sm:p-4 relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <CardHeader className="space-y-1.5 text-center pt-6 pb-4">
        <CardTitle className="text-3xl font-serif-display font-normal tracking-tight text-foreground">
          Create an <span className="brand-gradient-text font-semibold">account</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground/80">
          Enter details below to sign up for Syncline
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-foreground/85 pl-1">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border/60 bg-background/30 text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-primary/30 rounded-xl h-11 transition-all"
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground/85 pl-1">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border/60 bg-background/30 text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-primary/30 rounded-xl h-11 transition-all"
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-foreground/85 pl-1">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border/60 bg-background/30 pr-10 text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-primary/30 rounded-xl h-11 transition-all"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground/80 transition-colors"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-6">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold transition-all py-5 h-11 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.99]"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
          <div className="text-xs text-center text-muted-foreground pt-1.5">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary/95 font-semibold transition-colors">
              Log In
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
