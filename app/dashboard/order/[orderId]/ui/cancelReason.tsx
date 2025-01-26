'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { updateOrder } from '@/hooks/data/orders/updateOrder/updateOrder';

export default function CancelReason() {
  const [cancel_reason, setCancel_reason] = useState<string>('');
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const cancelOrderMutation = useMutation({
    mutationFn: async () => {
      const { error } = await updateOrder({
        id: String(orderId),
        payload: {
          status: 'Cancelled',
          cancel_reason
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
        description: `La commande a été annulée avec succès.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur !',
        description: `Une erreur s'est produite lors de l'annulation de la commande : ${error.message}. Veuillez réessayer.`
      });
    }
  });
  return (
    <Dialog>
      <DialogTrigger>
        <button className="mt-5 w-fit rounded-md border bg-red-500 px-4 py-2 text-lg text-white shadow-md hover:opacity-50">
          Annuler la commande
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Êtes-vous sûr de vouloir annuler la commande ?
        </DialogTitle>
        <DialogDescription className="text-left">
          {"Veuillez indiquer la raison de l'annulation :"}
        </DialogDescription>
        <Textarea
          value={cancel_reason}
          onChange={(e) => setCancel_reason(e.target.value)}
          placeholder="Raison"
        />

        <div className="flex w-full justify-between">
          <button
            onClick={() => cancelOrderMutation.mutate()}
            disabled={cancelOrderMutation.isPending}
            className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50"
          >
            {cancelOrderMutation.isPending ? 'Annulation en cours...' : 'Oui'}
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
