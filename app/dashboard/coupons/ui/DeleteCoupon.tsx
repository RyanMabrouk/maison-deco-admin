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
import { deleteCoupon } from '@/hooks/data/coupons/delete';

export default function DeleteCoupon({
  id,
  setSelectedSlug
}: {
  id?: string;
  setSelectedSlug?: (selectedSlug: string) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Id is required');
      const { error } = await deleteCoupon(id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast({
        title: 'Succès!',
        description: `Les coupons ont été supprimés avec succès.`
      });
      setSelectedSlug && setSelectedSlug('');
      setIsDialogOpen(false);
      setIsPending(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur!',
        description: `Une erreur s'est produite lors de la suppression des éléments: ${error.message}`
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
          Êtes-vous sûr de vouloir supprimer ce coupon ?
        </DialogTitle>
        <div className="flex w-full justify-between">
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md hover:opacity-50"
          >
            {isPending ? 'Suppression en cours...' : 'Oui'}
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
