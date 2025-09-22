'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

/**
 * A client component that redirects authenticated users to a specified path.
 * This is useful for pages that should only be accessed by unauthenticated users,
 * such as a landing page, login, or registration page.
 */
export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Wait for the auth state to be loaded
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // While loading auth state, or if the user is authenticated, show a loader.
  // This prevents a flash of the content before the redirect occurs.
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not loading and not authenticated, render the children (the actual page content).
  return <>{children}</>;
}
