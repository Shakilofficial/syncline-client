import NotificationsContent from '@/components/modules/dashboard/notifications/NotificationsContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications - Syncline',
  description: 'Stay updated on your tasks, project invites, and team comments on your Syncline dashboard.',
};

export default function NotificationsPage() {
  return <NotificationsContent />;
}
