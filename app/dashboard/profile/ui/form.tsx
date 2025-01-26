'use client';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Input from '@/components/input';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from '@/api/uploadFile';
import { useEffect, useState } from 'react';
import useCurrentUser from '@/hooks/data/users/getCurrentUser/useCurrentUser';
import UserPic from './userPic';
import { Player } from '@lottiefiles/react-lottie-player';
import ChangePassword from './changePassword';
import { createCsrClient } from '@/lib/client.supabase';

export default function Form() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useCurrentUser();
  const [preview, setPreview] = useState<string>('/noAvatar.jpg');

  useEffect(() => {
    if (user) {
      if (user.data?.avatar) {
        setPreview(user.data.avatar);
      } else {
        setPreview('/noAvatar.jpg');
      }
    }
  }, [user]);
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const full_name = String(formData.get('full_name'));
      const filepicture = formData.get('filepicture') as File;
      let avatar = user?.data?.avatar ?? '';

      if (filepicture && filepicture.size > 0) {
        avatar = await uploadFile({
          formData,
          name: 'filepicture',
          title: uuidv4()
        });
      }

      const payload = {
        full_name,
        avatar
      };

      const supabase = createCsrClient();
      const { error } = await supabase.from('users').update(payload);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });

      toast({
        title: 'Succès!',
        description: `Les données de l'utilisateur ont été modifiées avec succès.`
      });
    },
    onError: (error) => {
      toast({
        description: `Une erreur s'est produite lors de la modification des données de l'utilisateur : ${error.message}`
      });
    }
  });

  if (isLoading) {
    return (
      <div className="m-auto flex min-h-screen items-center justify-center">
        <Player
          className="m-auto"
          autoplay
          loop
          src="/loading.json"
          style={{ height: '10rem', width: '10rem' }}
        />
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="mx-auto flex w-full max-w-lg flex-col justify-center gap-8">
        <form
          className="flex flex-col justify-center gap-8 rounded-sm"
          action={updateMutation.mutate}
        >
          <UserPic picture={preview} setPicture={setPreview} />
          <div className="flex flex-col justify-center gap-4">
            <div className="flex w-full justify-between">
              <Input
                label="Prénom"
                name="first_name"
                defaultValue={user?.data?.full_name || ''}
                placeholder="Entrez le prénom"
              />
            </div>
            <Input
              label="Adresse e-mail"
              name="email"
              defaultValue={user?.data?.email || ''}
              placeholder="Entrez l'adresse e-mail"
              disabled={true}
            />
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="ml-auto mt-5 w-full rounded-sm bg-color2 p-2 text-xl font-semibold text-white hover:opacity-50"
            >
              {updateMutation.isPending
                ? 'Modification en cours...'
                : "Modifier les données de l'utilisateur"}
            </button>
          </div>
        </form>
        <div className="w-full">
          <ChangePassword email={user?.data?.email ?? ''} />
        </div>
      </div>
    </div>
  );
}
