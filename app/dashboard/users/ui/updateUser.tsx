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
import { Edit } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Input from '@/components/input';
import useUser from '@/hooks/data/users/getUserById/useUserById';
import UserPic from './userPic';
import SelectGeneric from '@/components/selectGeneric';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from '@/api/uploadFile';
import { Enums } from '@/types/database.types';
import { createCsrClient } from '@/lib/client.supabase';
import {
  IUpdateUser,
  updateUser
} from '@/hooks/data/users/updateUser/updateUser';
import { DatePicker } from '@/components/date-picker';

export default function UpdateUser({ userId }: { userId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: user } = useUser(userId);
  const [userRole, setUserRole] = useState<string>(user?.data?.role ?? 'user');
  const [preview, setPreview] = useState<string>('/noAvatar.jpg');

  useEffect(() => {
    if (user?.data?.role) {
      setUserRole(user.data?.role);
      if (user.data?.avatar) {
        setPreview(user.data.avatar);
      } else {
        setPreview('/noAvatar.jpg');
      }
    }
  }, [user?.data?.role, user?.data?.avatar]);

  const Options: { label: string; value: Enums<'user_role'> }[] = [
    { label: 'Administrateur', value: 'admin' },
    { label: 'Utilisateur', value: 'user' }
  ];

  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const filepicture = formData.get('filepicture') as File;

      let avatar = user?.data?.avatar ?? '';
      if (filepicture && filepicture.size > 0) {
        avatar = await uploadFile({
          formData,
          name: 'filepicture',
          title: uuidv4()
        });
      }

      const payload: IUpdateUser = {
        full_name: String(formData.get('full_name')),
        phone: String(formData.get('phone')),
        role: userRole as Enums<'user_role'>,
        date_of_birth: String(formData.get('date_of_birth')) || null,
        avatar
      };

      const { error } = await updateUser({
        payload,
        user_id: userId
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Succès!',
        description: `Les données de l'utilisateur ont été mises à jour avec succès.`
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        description: `Une erreur s'est produite lors de la mise à jour des données de l'utilisateur : ${error.message}`
      });
    }
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex w-full items-center justify-start gap-1 "
        >
          <Edit className=" h-4 w-4" />
          <div className="text-sm">Changer</div>
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>{"Modifier les données de l'utilisateur"}</DialogTitle>
        <form
          className="flex flex-col gap-8 rounded-sm p-6"
          action={updateMutation.mutate}
        >
          <UserPic picture={preview} setPicture={setPreview} />
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                label="Nom complet"
                name="full_name"
                defaultValue={user?.data?.full_name || ''}
                placeholder="Entrez le nom complet"
              />
              <div>
                <label className="mb-2 block font-semibold">{'Role'}</label>
                <SelectGeneric
                  options={Options}
                  placeholder="Sélectionnez le rôle"
                  name="role"
                  selectedValue={userRole || ''}
                  setSelectedValue={setUserRole}
                />
              </div>
            </div>
            <Input
              label="Adresse e-mail"
              name="email"
              defaultValue={user?.data?.email || ''}
              placeholder="Entrez l'adresse e-mail"
              disabled={true}
            />
            <Input
              label="Téléphone"
              name="phone"
              defaultValue={user?.data?.phone || ''}
              placeholder="Entrez le numéro de téléphone"
            />
            <div>
              <label className="mb-2 block font-semibold">
                {'Date de naissance'}
              </label>
              <DatePicker
                name="date_of_birth"
                defaultValue={new Date(user?.data?.date_of_birth ?? Date.now())}
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <button
              disabled={updateMutation.isPending}
              className="mt-5 w-fit rounded-md bg-color2 p-2 text-white hover:opacity-50"
              type="submit"
            >
              {updateMutation.isPending
                ? 'Mise à jour en cours...'
                : "Modifier les données de l'utilisateur"}
            </button>
            <DialogClose asChild>
              <button className="mt-5 w-fit rounded-md border bg-white px-4 py-2 text-color2 shadow-md hover:opacity-50">
                Annuler
              </button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
