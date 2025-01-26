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
import { useQueryClient } from '@tanstack/react-query';

export default function ConfirmationWindow({
  mutationFunction,
  invalidateQueryKey,
  name
}: {
  mutationFunction: (id: string) => Promise<{ error: any }>;
  invalidateQueryKey: string;
  name: string;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = () => {
    setIsPending(true);
    mutationFunction(name)
      .then(({ error }) => {
        if (error) {
          throw new Error(error.message);
        }
        queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] });
        toast({
          title: 'Succès!',
          description: 'L’ajout a été effectué avec succès.'
        });
        setIsDialogOpen(false);
        setIsPending(false);
      })
      .catch(() => {
        toast({
          title: 'Erreur!',
          description:
            "Une erreur s'est produite lors de l'ajout. Veuillez réessayer."
        });
        setIsPending(false);
      });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <button className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50">
          Ajouter
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Êtes-vous sûr de vouloir ajouter {name}?</DialogTitle>

        <div className="flex w-full justify-between">
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50"
          >
            {isPending ? 'Ajout en cours...' : 'Oui'}
          </button>

          <DialogClose asChild>
            <button className="mt-5 w-fit rounded-md border bg-white px-4 py-2 text-lg text-color2 shadow-md hover:opacity-50">
              Annuler
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
