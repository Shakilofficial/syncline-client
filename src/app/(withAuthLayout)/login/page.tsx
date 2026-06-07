import LoginForm from '@/components/modules/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In - Syncline',
  description: 'Log in to your Syncline workspace dashboard to track, collaborate, and manage your team projects and tasks.',
};

export default function LoginPage() {
  return <LoginForm />;
}
