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
import { Trash } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOrder } from '@/hooks/data/orders/deleteOrder/deleteOrder';

export default function DeleteOrder({
  id,
  setSelectedId
}: {
  id?: string;
  setSelectedId?: (selectedId: string) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("L'id de la commande est manquant");
      const { error } = await deleteOrder(id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Succès!',
        description: `La commande a été supprimée avec succès.`
      });
      setSelectedId && setSelectedId('');
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur!',
        description: `Une erreur s'est produite lors de la suppression de la commande: ${error.message}`
      });
    }
  });

  const handleConfirm = () => {
    deleteMutation.mutate();
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
          Êtes-vous sûr de vouloir supprimer cette commande ?
        </DialogTitle>
        <div className="flex w-full justify-between">
          <button
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50"
          >
            {deleteMutation.isPending ? 'Suppression en cours...' : 'Oui'}
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
