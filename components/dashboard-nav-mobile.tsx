'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';
import ConfirmationWindow from '@/app/dashboard/ui/confirmationWindow';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  group?: string;
}

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNavMobile({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2 ">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight'];

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                {item.label === 'logOut' ? (
                  <button
                    className={cn(
                      'flex items-center gap-2 overflow-hidden rounded-md px-2 py-2 text-lg font-medium hover:opacity-50'
                    )}
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Icon className="ml-3 size-5 flex-none" />
                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <span className="mr-2 truncate">{item.title}</span>
                    ) : (
                      ''
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.disabled ? '/' : item?.href || '/'}
                    className={cn(
                      'flex items-center gap-2 overflow-hidden rounded-md px-2 py-2 text-lg font-medium',
                      item.disabled && 'cursor-not-allowed opacity-80',
                      path === item.href && 'bg-white text-color1',
                      path !== item.href ? 'hover:opacity-50' : ''
                    )}
                  >
                    <Icon className="ml-3 size-5 flex-none" />
                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <span className="mr-2 truncate">{item.title}</span>
                    ) : (
                      ''
                    )}
                  </Link>
                )}
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}
                className={!isMinimized ? 'hidden' : 'inline-block'}
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>

      {isDialogOpen && (
        <ConfirmationWindow
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}
    </nav>
  );
}
