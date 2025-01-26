'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose // Add this import
} from '@/components/ui/dialog';
import signOut from '@/actions/(auth)/signout';

export default function ConfirmationWindowLogout({
  isDialogOpen,
  setIsDialogOpen
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleLogout = async () => {
    setIsDialogOpen(false);
    await signOut();
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogTitle>Êtes-vous sûr de vouloir vous déconnecter ?</DialogTitle>
        <div className="flex w-full justify-between">
          <button
            className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-lg text-white shadow-md"
            onClick={handleLogout}
          >
            Oui
          </button>

          <DialogClose asChild>
            <button
              className="mt-5 w-fit rounded-md border bg-white px-4 py-2 text-lg text-color2 shadow-md"
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
