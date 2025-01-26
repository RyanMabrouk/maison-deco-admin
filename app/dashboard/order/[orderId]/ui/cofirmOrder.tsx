'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { updateOrder } from '@/hooks/data/orders/updateOrder/updateOrder';

export default function ConfirmOrder() {
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addOrderMutation = useMutation({
    mutationFn: async () => {
      const { error } = await updateOrder({
        id: String(orderId),
        payload: {
          status: 'Delivered'
        }
      });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      toast({
        title: 'Succès !',
        description: `La commande a été livrée avec succès.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur !',
        description: `Une erreur s'est produite lors de la livraison de la commande : ${error.message}. Veuillez réessayer.`
      });
    }
  });

  return (
    <Dialog>
      <DialogTrigger>
        <button className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50">
          Commande Livrée ?
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Êtes-vous sûr de vouloir marquer la commande comme livrée ?
        </DialogTitle>

        <div className="flex w-full justify-between">
          <button
            onClick={() => addOrderMutation.mutate()}
            disabled={addOrderMutation.isPending}
            className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50"
          >
            {addOrderMutation.isPending ? 'Livraison en cours...' : 'Oui'}
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
