'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();


  if (status === 'loading' || !session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <h1 className="text-4xl font-bold text-black">Dashboard</h1>
    </div>
  );
}
