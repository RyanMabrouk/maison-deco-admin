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
import signUp from '@/actions/(auth)/signup';
import { Enums } from '@/types/database.types';

interface ConfirmationWindowProps {
  payload: {
    full_name: string;
    email: string;
    password: string;
    role: Enums<'user_role'>;
  };
  formRef: React.RefObject<HTMLFormElement>; // Added formRef prop
  isDialogOpen2: boolean;
  setIsDialogOpen2: (isOpen: boolean) => void;
}

export default function ConfirmationWindow({
  payload,
  formRef,
  isDialogOpen2,
  setIsDialogOpen2
}: ConfirmationWindowProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const AddMutation = useMutation({
    mutationFn: async () => {
      const { error } = await signUp({
        email: payload.email,
        password: payload.password,
        full_name: payload.full_name,
        role: 'admin'
      });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Succès!',
        description: `L'utilisateur ${payload.full_name} a été ajouté avec succès.`
      });

      if (formRef.current) {
        formRef.current.reset();
      }

      setIsDialogOpen2(false);
      setIsPending(false);
    },
    onError: (error: any) => {
      toast({
        title: "Une erreur s'est produite lors de l'ajout de l'utilisateur",
        description: ` ${error.message}` // Display the error message
      });
      setIsPending(false);
    }
  });

  const handleConfirm = () => {
    setIsPending(true); // Set the pending state
    AddMutation.mutate(); // Trigger the mutation
  };

  return (
    <Dialog open={isDialogOpen2} onOpenChange={setIsDialogOpen2}>
      <DialogTrigger></DialogTrigger>
      <DialogContent>
        <DialogTitle>
          {payload?.full_name
            ? `Êtes-vous sûr de vouloir ajouter ${payload.full_name} ?`
            : "Êtes-vous sûr de vouloir ajouter l'utilisateur ?"}
        </DialogTitle>
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
