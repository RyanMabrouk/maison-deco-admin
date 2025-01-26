'use client';
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog';
import { z } from 'zod';
import ConfirmationWindow from './confirmationWindow';
import Input from '@/components/input';
import { PasswordInput } from '@/components/passwordInput';

const schema = z.object({
  full_name: z.string({
    required_error: 'Le nom complet est requis'
  }),
  email: z.string().email({ message: "L'adresse e-mail est invalide" }),
  password: z
    .string()
    .min(7, { message: 'Le mot de passe doit contenir au moins 7 caractères' })
});

export default function AddAdmin() {
  const [errors, setErrors] = useState<string[]>([]);
  const [payload, setPayload] = useState<{
    full_name: string;
    email: string;
    password: string;
  }>({ full_name: '', email: '', password: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    const full_name = String(formData.get('full_name'));
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    try {
      schema.parse({ full_name, email, password });
      setPayload({ full_name, email, password });
      setIsDialogOpen2(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages: string[] = [];
        error.errors.forEach((err) => {
          errorMessages.push(err.message);
        });
        setErrors(errorMessages);
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <button className="w-fit rounded-md bg-color2 px-4 py-2 text-white hover:opacity-50">
          Ajouter un nouvel administrateur
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-screen">
        <form
          className="flex flex-col gap-8 rounded-sm px-3 pt-3"
          action={handleSubmit}
          ref={formRef} // Attacher formRef au formulaire
        >
          <h2 className="text-color5 mb-4 text-2xl font-bold">
            {"Informations de l'administrateur"}
          </h2>
          <div className="space-y-4">
            <Input
              label="Nom complet"
              name="full_name"
              placeholder="Entrez votre Nom complet"
            />
            <Input
              label="Adresse e-mail"
              name="email"
              type="email"
              placeholder="Entrez votre adresse e-mail"
            />
            <PasswordInput
              label="Mot de passe"
              name="password"
              placeholder="Entrez le mot de passe"
            />
            {errors.map((error, index) => (
              <div key={index} className="mb-2 text-sm text-red-500">
                {error}
              </div>
            ))}
          </div>
          <div className="flex w-full justify-between">
            <button
              className="mt-5 w-fit rounded-md border bg-color2 px-4 py-2 text-white shadow-md hover:opacity-50"
              type="submit"
            >
              Enregistrer
            </button>
            <DialogClose asChild>
              <button className="mt-5 w-fit rounded-md border bg-white px-4 py-2 text-color2 shadow-md">
                Annuler
              </button>
            </DialogClose>
          </div>
          <ConfirmationWindow
            payload={{ ...payload, role: 'admin' }}
            formRef={formRef}
            isDialogOpen2={isDialogOpen2}
            setIsDialogOpen2={setIsDialogOpen2}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
