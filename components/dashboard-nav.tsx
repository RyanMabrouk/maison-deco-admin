'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';
import { Icons } from './icons';
import { NavItem } from './dashboard-nav-mobile';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || 'arrowRight'];

        return (
          <div key={index}>
            <Link
              href={item.disabled ? '/' : item?.href || '/'}
              className={cn(
                'mr-4 flex items-center gap-2 overflow-hidden rounded-md px-2 py-2 text-base font-medium',
                item.disabled && 'cursor-not-allowed opacity-80',
                path === item.href && 'bg-white text-color1',
                path !== item.href ? 'hover:opacity-50' : ''
              )}
            >
              {Icon && <Icon className="h-5 w-5" />}
              {isMobileNav || (!isMinimized && !isMobileNav) ? (
                <span className="mr-2 truncate">{item.title}</span>
              ) : null}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
