'use client';

import { Sidebar } from "@/components/sidebar";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar />
      </div>

      <main className="md:pl-64">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-stone-200/60 bg-[#FAF9F6]/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="ornament-divider flex-1 mr-6">
            <span className="section-label whitespace-nowrap">The Lyceum Collection</span>
          </div>
          <UserButton />
        </div>
        <div className="px-2">
          {children}
        </div>
      </main>
    </div>
  );
}
