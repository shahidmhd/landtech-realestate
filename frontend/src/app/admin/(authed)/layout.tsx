'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, ready } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (ready && !isAuthenticated) router.replace('/admin/login');
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
