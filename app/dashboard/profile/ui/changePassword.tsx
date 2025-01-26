'use client';

import { useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import updatePassword from '@/actions/(auth)/updatePassword';
import { PasswordInput } from '@/components/passwordInput';

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
    confirmPassword: z.string().nonempty('Veuillez confirmer le mot de passe')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Le mot de passe et sa confirmation doivent correspondre'
  });

export default function ChangePassword({ email }: { email: string }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null); // Form reference

  const updatePasswordMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const currentPassword = String(formData.get('currentPassword'));
      const newPassword = String(formData.get('newPassword'));
      const confirmPassword = String(formData.get('confirmPassword'));

      const input = { newPassword, confirmPassword };
      const result = passwordSchema.safeParse(input);

      if (!result.success) {
        result.error.errors.forEach((error) => {
          toast({
            title: 'Erreur de saisie',
            description: error.message
          });
        });
        throw new Error('Validation error');
      }

      const updateResult = await updatePassword({
        currentPassword,
        newPassword,
        email
      });

      if (updateResult?.error) {
        throw new Error(updateResult.error.message);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Succès!',
        description: 'Le mot de passe a été changé avec succès'
      });
      formRef.current?.reset(); // Reset form on success
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description:
          error.message ||
          "Une erreur s'est produite lors du changement de mot de passe"
      });
    }
  });

  return (
    <form
      ref={formRef} // Attach the form reference
      action={updatePasswordMutation.mutate}
      className="mx-auto mt-5 flex flex-col justify-center gap-4"
    >
      <h1 className="text-2xl font-bold">Changer le mot de passe</h1>
      <PasswordInput
        label="Mot de passe actuel"
        name="currentPassword"
        placeholder="Entrez le mot de passe actuel"
      />

      <PasswordInput
        label="Nouveau mot de passe"
        name="newPassword"
        placeholder="Entrez le nouveau mot de passe"
      />

      <PasswordInput
        label="Confirmez le mot de passe"
        name="confirmPassword"
        placeholder="Confirmez le mot de passe"
      />

      <button
        type="submit"
        disabled={updatePasswordMutation.isPending}
        className="ml-auto mt-5 w-full rounded-sm bg-color2 p-2 text-xl font-semibold text-white hover:opacity-50"
      >
        {updatePasswordMutation.isPending
          ? 'Changement de mot de passe en cours...'
          : 'Changer le mot de passe'}
      </button>
    </form>
  );
}
