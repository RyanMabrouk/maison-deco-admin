'use client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { navItems } from '@/constants/data';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { DashboardNavMobile } from '../dashboard-nav-mobile';
import Image from 'next/image';

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="right" className="!px-0">
          <div className="space-y-4 py-4 ">
            <div className="px-3 py-2">
              <div className="ml-auto hidden p-5 pt-10 lg:block">
                <Image src="/logo.svg" width={150} height={150} alt="logo" />
              </div>
              <div className="space-y-1">
                <DashboardNavMobile
                  items={navItems}
                  isMobileNav={true}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
