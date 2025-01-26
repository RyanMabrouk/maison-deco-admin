'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';

export default function ConfirmationWindow({ eventId }: { eventId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteEventMutation = useMutation({
    mutationFn: async () => {
      const { error } = {
        error: 'Not implemented'
      };
      if (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      setIsDialogOpen(false);
      toast({
        title: 'نجاح!',
        description: `تم حذف الفعالية بنجاح.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ!',
        description: `حدث خطأ أثناء حذف الفعالية: ${error.message} حاول مرة أخرى.`
      });
    }
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild dir="rtl ">
        <button className="ml-auto mr-2 flex items-center justify-start gap-2 ">
          <Trash className="h-4 w-4" />
          <div>حذف</div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>هل أنت متأكد من حذف الفعالية ؟ </DialogTitle>

        <div className="flex w-full justify-between">
          <button
            onClick={() => deleteEventMutation.mutate()}
            disabled={deleteEventMutation.isPending}
            className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50"
          >
            {deleteEventMutation.isPending ? 'جاري الحذف...' : 'نعم'}
          </button>

          <DialogClose>
            <button className="mt-5 w-fit rounded-md border bg-white px-4 py-2 text-lg text-color2 shadow-md hover:opacity-50">
              إلغاء
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
