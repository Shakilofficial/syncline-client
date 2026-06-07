import SignupForm from '@/components/modules/auth/SignupForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Syncline',
  description: 'Create a new account on Syncline to start collaborating, tracking tasks, and organizing projects with your team.',
};

export default function SignupPage() {
  return <SignupForm />;
}
