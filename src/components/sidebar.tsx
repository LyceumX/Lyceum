'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    label: 'Book Summary',
    icon: BookOpen,
    href: '/book-summary',
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-[#12100E] text-white">
      {/* Logo area */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4 border-b border-white/10">
        <Link href="/" className="flex flex-col items-center gap-3 group">
          <Image
            src="/Lyceum_White_PNG.png"
            alt="Lyceum"
            width={80}
            height={80}
            className="opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </Link>
      </div>

      {/* Ornamental divider label */}
      <div className="px-5 pt-6 pb-2">
        <span className="section-label text-[#A67C52]/70 tracking-[0.2em] text-[0.6rem]">
          Navigation
        </span>
      </div>

      {/* Nav routes */}
      <nav className="flex-1 px-3 space-y-0.5">
        {routes.map((route) => {
          const active = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium tracking-wide transition-all duration-150',
                active
                  ? 'bg-[#A67C52]/20 text-[#C9A96E] border-l-2 border-[#A67C52]'
                  : 'text-stone-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent',
              )}
            >
              <route.icon className={cn('h-4 w-4 shrink-0', active ? 'text-[#C9A96E]' : 'text-stone-500')} />
              {route.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom ornament + settings */}
      <div className="px-3 pb-6 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-stone-500 hover:text-white hover:bg-white/5 cursor-pointer transition-all border-l-2 border-transparent">
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </div>
        {/* Column ornament at very bottom */}
        <div className="mt-4 flex justify-center opacity-20">
          <div className="w-16 h-px bg-[#A67C52]" />
        </div>
      </div>
    </div>
  );
};
