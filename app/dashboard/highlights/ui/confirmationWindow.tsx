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
import { deleteHighlight } from '@/hooks/data/highlights/delete';

export default function ConfirmationWindow({ slug }: { slug: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteSelectionMutation = useMutation({
    mutationFn: async () => {
      const { error } = await deleteHighlight(slug);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      queryClient.invalidateQueries({ queryKey: ['highlights', slug] });
      setIsDialogOpen(false);
      toast({
        title: 'Succès!',
        description: `La sélection spéciale a été supprimée avec succès.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur!',
        description: `Une erreur s'est produite lors de la suppression de la sélection spéciale : ${error.message}. Veuillez réessayer.`
      });
    }
  });

  const handleConfirm = () => {
    deleteSelectionMutation.mutate();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex cursor-pointer items-center justify-start gap-2 p-2"
        >
          <Trash className="h-4 w-4" />
          <div className="text-sm">Supprimer</div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Êtes-vous sûr de vouloir supprimer cette sélection spéciale ?
        </DialogTitle>

        <div className="flex w-full justify-between">
          <button
            onClick={handleConfirm}
            disabled={deleteSelectionMutation.isPending}
            className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50"
          >
            {deleteSelectionMutation.isPending
              ? 'Suppression en cours...'
              : 'Oui'}
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
