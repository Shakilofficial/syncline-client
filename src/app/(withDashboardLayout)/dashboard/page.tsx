import DashboardContent from '@/components/modules/dashboard/DashboardContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Syncline',
  description: 'Manage, organize, and analyze task workloads and collaborative project trends on Syncline.',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
