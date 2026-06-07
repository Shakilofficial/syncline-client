import ProjectDetailContent from '@/components/modules/dashboard/projects/ProjectDetailContent';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Project Board - Syncline`,
    description: `Manage tasks, track progress, invite team members, and check chronological activity logs for project ID ${id} on Syncline.`,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProjectDetailContent projectId={id} />;
}
