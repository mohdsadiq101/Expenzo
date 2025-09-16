// src/components/BottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2 } from 'lucide-react';
import { AddTransactionModal } from '@/components/AddTransactionModal';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Home },
    { href: '/analytics', icon: BarChart2 },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 rounded-2xl bg-white border-t border-gray-400 flex justify-around items-center max-w-md mx-auto">
        {links.map(({ href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}>
              <Icon className={`h-7 w-7 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
            </Link>
          );
        })}
      </nav>

      {/* Floating Add Button (independent of nav) */}
      <div className="fixed bottom-20 right-6">
        <AddTransactionModal />
      </div>
    </>
  );
}
