'use client';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import Table from './table';
// import useEvents from '@/hooks/data/events/useEvents';
import Link from 'next/link';

export default function Events() {
  // const { data: events, isLoading } = useEvents();

  return (
    <>
      <div className="flex items-start justify-between">
        {/* <Heading
          title={`الفعاليات (${isLoading ? 0 : events?.data?.length ?? 0})`}
          description="قائمة بجميع الفعاليات"
        /> */}
        <Link href="/dashboard/event">
          <button className="w-fit rounded-md bg-color2 px-4 py-2 text-lg text-white hover:opacity-50">
            إضافة فعالية
          </button>
        </Link>
      </div>
      <Separator />

      <Table />
    </>
  );
}
