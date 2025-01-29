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
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function DeleteWindow({
  deletedItemId,
  mutationFunction,
  invalidateQueryKey
}: {
  deletedItemId: string;
  mutationFunction: (id: string) => Promise<{ error: any }>;
  invalidateQueryKey: string;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await mutationFunction(deletedItemId);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [invalidateQueryKey]
      });
      toast({
        title: 'Succès!',
        description: 'La suppression a été effectuée avec succès.'
      });
      setIsDialogOpen(false);
      setIsPending(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur!',
        description:
          "Une erreur s'est produite lors de la suppression de l'élément. Veuillez réessayer."
      });
      setIsPending(false);
    }
  });

  const handleConfirm = () => {
    setIsPending(true);
    deleteMutation.mutate();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Icons.trash className="h-6 w-6 cursor-pointer font-bold text-red-500" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Êtes-vous sûr de vouloir supprimer ?</DialogTitle>
        <div className="flex w-full justify-between">
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50"
          >
            {isPending ? 'Suppression en cours...' : 'Oui'}
          </button>

          <DialogClose asChild>
            <button className="mt-5 w-fit rounded-md border bg-white px-4 py-2 text-lg text-color2 shadow-md">
              Annuler
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
