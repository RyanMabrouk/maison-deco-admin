'use client';
import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

export function DatePicker({
  name,
  defaultValue
}: {
  name: string;
  defaultValue: Date;
}) {
  const [date, setDate] = React.useState<Date>(defaultValue);

  return (
    <Popover>
      <input
        type="hidden"
        value={date.toDateString()}
        name={name}
        defaultValue={date.toDateString()}
      />
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'h-11 w-[280px] justify-start bg-white text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Choisir une date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 [&>*]:z-[9999]"
        data-container="body"
      >
        <Calendar
          data-container="body"
          className="[&>*]:z-[9999]"
          mode="single"
          selected={date}
          onSelect={(date) => {
            if (date) {
              setDate(date);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
