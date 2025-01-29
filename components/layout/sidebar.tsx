'use client';
import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Image as ImageIcon,
  Users,
  LogOut,
  ClipboardList,
  ShoppingBasket,
  MessageCircleIcon,
  Gem,
  Receipt
} from 'lucide-react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import Image from 'next/image';
import Link from 'next/link';
import ConfirmationWindowLogout from '@/app/dashboard/ui/confirmationWindow';
import { usePathname } from 'next/navigation';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const path = usePathname();

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const groupedNavItems = {
    ['Produits']: {
      items: navItems.filter(
        (item) => item.label === 'products' || item.label === 'addProduct'
      ),
      icon: <ShoppingBasket />
    },
    ['Sélections spéciales']: {
      items: navItems.filter(
        (item) => item.label === 'highlights' || item.label === 'addHighlight'
      ),
      icon: <Gem />
    },
    Coupons: {
      items: navItems.filter((item) => item.label === 'coupons'),
      icon: <Receipt />
    },
    Carousels: {
      items: navItems.filter(
        (item) => item.label === 'carousels' || item.label === 'addCarousel'
      ),
      icon: <ImageIcon />
    }
  };

  const standaloneNavItems = [
    { href: '/dashboard', title: 'Tableau de bord', icon: <ClipboardList /> },
    { href: '/dashboard/users', title: 'Utilisateurs', icon: <Users /> },
    { href: '/dashboard/orders', title: 'Commandes', icon: <ClipboardList /> }
  ];

  return (
    <aside
      className={cn(
        `relative hidden flex-none border-r bg-color1 text-white transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <div className="ml-auto hidden p-5 pt-10 lg:block">
        <Image src="/logo.svg" width={150} height={150} alt="logo" />
      </div>
      <ChevronRight
        className={cn(
          'absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={toggle}
      />
      <div>
        {standaloneNavItems.map((item, index) => (
          <div
            key={index}
            className={`flex flex-row items-center px-2 py-2 text-xl font-medium  ${
              path == item.href ? '' : 'hover:opacity-70'
            }`}
          >
            <Link
              href={item.href}
              className={`flex w-full flex-row items-center gap-2 py-2 ${
                path == item.href
                  ? 'rounded-md bg-white text-color1 hover:opacity-100'
                  : ''
              }`}
            >
              <span className="ml-2">{item.icon}</span>
              {!isMinimized && <span className="mr-2">{item.title}</span>}
            </Link>
          </div>
        ))}
        {Object.entries(groupedNavItems).map(([group, { items, icon }]) => (
          <div key={group}>
            <button
              onClick={() => toggleGroup(group)}
              className={cn(
                'flex w-full flex-row items-center gap-2 px-4 py-4 text-lg font-medium',
                isMinimized && 'truncate'
              )}
            >
              <span>{icon}</span>
              <span className={`mr-2 ${isMinimized ? 'hidden' : ''}`}>
                {group}
              </span>
              <span className="mr-auto">
                {expandedGroups.includes(group) ? (
                  <ChevronDown className="text-xl" />
                ) : (
                  <ChevronRight className="text-xl" />
                )}
              </span>
            </button>
            {items.length > 0 && (
              <div
                className={cn(
                  'transition-max-h overflow-hidden pl-8',
                  expandedGroups.includes(group) ? 'max-h-screen' : 'max-h-0'
                )}
              >
                <DashboardNav items={items} isMobileNav={false} />
              </div>
            )}
          </div>
        ))}
        <div className="flex flex-row items-center px-2 py-2 text-xl font-medium ">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex w-full flex-row items-center gap-2 text-xl font-medium"
          >
            <span className="ml-2">
              <LogOut />
            </span>
            {!isMinimized && <span className="mr-2">{'Déconnexion'}</span>}
          </button>
        </div>
      </div>
      {isDialogOpen && (
        <ConfirmationWindowLogout
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}
    </aside>
  );
}
