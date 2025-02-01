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
import { PackageSearch } from 'lucide-react';

export default function ProcessOrder({
  dropMenu,
  id
}: {
  dropMenu?: boolean;
  id?: string;
}) {
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addOrderMutation = useMutation({
    mutationFn: async () => {
      const item_id = dropMenu ? id : String(orderId);
      const { error } = await updateOrder({
        id: item_id as string,
        payload: {
          status: 'Processing'
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
        description: `La commande est en cours de traitement avec succès.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur !',
        description: `Une erreur s'est produite lors du traitement de la commande : ${error.message}. Veuillez réessayer.`
      });
    }
  });

  return (
    <Dialog>
      <DialogTrigger>
        {dropMenu ? (
          <div className="flex cursor-pointer items-center justify-start gap-2 p-2">
            <PackageSearch className="h-4 w-4" />
            <span className="line-clamp-1 text-nowrap text-sm">
              Traitement{' '}
            </span>
          </div>
        ) : (
          <button className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50">
            Mettre en traitement
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Êtes-vous sûr de vouloir mettre la commande en traitement ?
        </DialogTitle>

        <div className="flex w-full justify-between">
          <button
            onClick={() => addOrderMutation.mutate()}
            disabled={addOrderMutation.isPending}
            className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50"
          >
            {addOrderMutation.isPending ? 'Traitement en cours...' : 'Oui'}
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
