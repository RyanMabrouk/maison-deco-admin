'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GithubSignInButton from '../github-auth-button';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import login from '@/actions/(auth)/login';
import { PasswordInput } from '../passwordInput';
import Input from '@/components/input';

const formSchema = z.object({
  email: z.string().email({ message: 'Entrez une adresse e-mail valide' }),
  password: z
    .string()
    .min(8, { message: 'Le mot de passe doit comporter au moins 8 caractères' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ general?: string } | null>(null);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (formObject: FormData) => {
      const email = String(formObject.get('email'));
      const password = String(formObject.get('password'));
      const { error } = await login({ email, password });
      if (error) {
        setErrors({ general: error.message });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    }
  });

  return (
    <>
      <Form {...form}>
        <form dir="ltr" action={mutate} className="w-full space-y-2">
          <Input label="Email" name="email" placeholder="Entrez votre e-mail" />
          <PasswordInput
            label="Mot de passe"
            name="password"
            placeholder="Entrez votre mot de passe"
          />
          {errors?.general && (
            <FormItem>
              <FormMessage>{errors.general}</FormMessage>
            </FormItem>
          )}
          <button
            disabled={loading}
            className="ml-auto mt-10 w-full bg-color2 p-2 text-white hover:opacity-50"
            type="submit"
          >
            Confirmer la connexion
          </button>
        </form>
      </Form>
      {/*  <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            ou continuer avec
          </span>
        </div>
      </div>
      <GithubSignInButton />*/}
    </>
  );
}
