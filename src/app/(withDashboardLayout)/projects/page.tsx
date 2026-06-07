import ProjectsContent from '@/components/modules/dashboard/projects/ProjectsContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects - Syncline',
  description: 'Manage, search, sort, and collaborate on your active projects on Syncline.',
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
