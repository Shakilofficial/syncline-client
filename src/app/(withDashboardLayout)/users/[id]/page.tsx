import UserProfileContent from '@/components/modules/dashboard/users/UserProfileContent';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `User Profile - Syncline`,
    description: `View profile details, security preferences, and dashboard workspace permissions for member ID ${id} on Syncline.`,
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  return <UserProfileContent profileId={id} />;
}
