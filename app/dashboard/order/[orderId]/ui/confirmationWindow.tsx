'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { deleteOrder } from '@/hooks/data/orders/deleteOrder/deleteOrder';

export default function ConfirmationWindow({ orderId }: { orderId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const deleteOrderMutation = useMutation({
    mutationFn: async () => {
      const { error } = await deleteOrder(orderId);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      toast({
        title: 'Succès !',
        description: `La commande a été supprimée avec succès.`
      });
      setIsSuccess(true);
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur !',
        description: `Une erreur s'est produite lors de la suppression de la commande : ${error.message}. Veuillez réessayer.`
      });
    }
  });

  useEffect(() => {
    if (isSuccess) {
      redirect('/dashboard/orders');
    }
  }, [isSuccess]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <button className="w-fit rounded-md bg-red-500 px-4 py-2 text-lg text-white hover:opacity-50">
          Supprimer la commande
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Êtes-vous sûr de vouloir supprimer la commande ?
        </DialogTitle>

        <div className="flex w-full justify-between">
          <button
            onClick={() => deleteOrderMutation.mutate()}
            disabled={deleteOrderMutation.isPending}
            className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50"
          >
            {deleteOrderMutation.isPending ? 'Suppression en cours...' : 'Oui'}
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
