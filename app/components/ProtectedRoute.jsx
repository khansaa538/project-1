'use client';

import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return <div className="text-center mt-10">Memuat...</div>;

  return children;
}
