import UsersContent from '@/components/modules/dashboard/users/UsersContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users - Syncline',
  description: 'Manage accounts, role configuration, permissions, and status details of members across your Syncline workspace.',
};

export default function UsersPage() {
  return <UsersContent />;
}
