'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Library, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    color: 'text-sky-500',
  },
  {
    label: 'Book Summary',
    icon: BookOpen,
    href: '/book-summary',
    color: 'text-violet-500',
  },
  // Future apps can be added here
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
             {/* Logo placeholder */}
             <Library className="w-8 h-8 text-white"/>
          </div>
          <h1 className="text-2xl font-bold">Lyceum</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
         <div className="flex items-center p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400">
             <Settings className="h-5 w-5 mr-3" />
             Settings
         </div>
      </div>
    </div>
  );
};
