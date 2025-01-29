'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Icons } from '@/components/icons';
import { UseMutationResult } from '@tanstack/react-query';

interface AddWindowProps {
  title: string;
  form: React.ReactNode;
  mutationFunction: UseMutationResult<void, any, FormData, unknown>;
}

export default function AddWindow({
  title,
  form,
  mutationFunction
}: AddWindowProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirm = (args: FormData) => {
    mutationFunction.mutate(args);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Icons.add className="h-6 w-6 cursor-pointer font-bold text-color2" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <form className="flex w-full flex-col gap-4" action={handleConfirm}>
          {form}
          <div className="flex w-full flex-row gap-4">
            <button
              disabled={mutationFunction.isPending}
              className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50"
            >
              {mutationFunction.isPending ? 'En cours...' : 'Ajouter'}
            </button>
            <DialogClose asChild>
              <button className="mt-5 w-fit rounded-md border bg-white px-4 py-2 text-lg text-color2 shadow-md hover:opacity-50">
                Annuler
              </button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
