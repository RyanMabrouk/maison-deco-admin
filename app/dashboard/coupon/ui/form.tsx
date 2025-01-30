'use client';
import React, { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/input';
import { Player } from '@lottiefiles/react-lottie-player';
import { Enums, TablesInsert } from '@/types/database.types';
import SelectGeneric from '@/components/selectGeneric';
import { z } from 'zod';
import useCouponsById from '@/hooks/data/coupons/getById/useById';
import { updateCoupon } from '@/hooks/data/coupons/update';
import { createCoupon } from '@/hooks/data/coupons/post';
import { Switch } from '@/components/ui/switch';

export default function Form() {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const couponId = searchParams.get('couponId');
  const { data: coupon, isLoading } = useCouponsById(String(couponId));

  const queryClient = useQueryClient();
  const router = useRouter();

  const { toast } = useToast();

  const couponMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const couponDataSchema = z.object({
        discount_type: z.enum(['percentage', 'amount']).optional(),
        discount: z.number().min(0, 'La réduction ne peut pas être négative'),
        code: z.string().min(1, 'Le code est requis'),
        active: z.boolean().optional(),
        max_uses: z
          .number()
          .min(0, "Le nombre d'utilisations ne peut pas être négatif")
      });
      const couponData: TablesInsert<'coupons'> = {
        discount_type: String(
          formData.get('discount_type')
        ) as Enums<'discount_type'>,
        discount: Number(formData.get('discount')),
        code: formData.get('code') as string,
        active: formData.get('active') === 'on',
        max_uses: Number(formData.get('max_uses'))
      };

      const parsedData = couponDataSchema.safeParse(couponData);
      if (!parsedData.success) {
        throw new Error('Validation échouée');
      }

      if (couponId) {
        const { error } = await updateCoupon({
          id: String(couponId),
          payload: {
            ...couponData
          }
        });
        if (error) {
          throw new Error(error.message);
        }
        return couponId;
      } else {
        const { error } = await createCoupon({
          payload: {
            ...couponData
          }
        });
        if (error) {
          throw new Error(error.message);
        }
        return 'new_coupon_id';
      }
    },
    onSuccess: async (id: string, variables: any, context: any) => {
      if (couponId) {
        toast({
          description: 'Coupon modifié avec succès.'
        });
      } else {
        toast({
          description: 'Coupon ajouté avec succès.'
        });
        if (formRef.current) {
          formRef.current.reset();
        }
      }
      await queryClient.invalidateQueries({ queryKey: ['coupons'] });
      await queryClient.invalidateQueries({
        queryKey: ['coupons', couponId]
      });
      router.refresh();
    },
    onError: (error: any) => {
      if (couponId) {
        toast({
          description: "Une erreur s'est produite lors de la modification."
        });
        toast({
          description: error.message
        });
      } else {
        toast({
          description: "Une erreur s'est produite lors de l'ajout."
        });
        toast({
          description: error.message
        });
      }
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
    <form
      className="flex flex-col gap-8 rounded-sm p-3"
      ref={formRef}
      action={couponMutation.mutate}
    >
      <div className="space-y-4">
        <div className="flex w-full flex-row gap-2">
          <Input
            label="Code"
            name="code"
            type="text"
            defaultValue={coupon?.data?.code}
            placeholder="Entrez le code"
          />
          <Input
            label="Nombre d'utilisations"
            name="max_uses"
            type="number"
            defaultValue={coupon?.data?.max_uses || 0}
            placeholder="Entrez le nombre d'utilisations"
          />
          <div className="ml-4 mr-8">
            <label className="mb-2 block font-semibold">{'Actif'}</label>
            <Switch
              className=" mt-3"
              name="active"
              defaultChecked={coupon?.data?.active || false}
            />
          </div>
        </div>
        <div className="flex w-full flex-row gap-2">
          <div>
            <label className="mb-2 block font-semibold">
              {'Type de réduction'}
            </label>
            <SelectGeneric
              placeholder="Type de réduction"
              name="discount_type"
              options={[
                { value: 'percentage', label: 'Pourcentage' },
                { value: 'amount', label: 'Montant' }
              ]}
              selectedValue={coupon?.data?.discount_type ?? undefined}
            />
          </div>
          <Input
            label="Réduction"
            name="discount"
            type="number"
            defaultValue={coupon?.data?.discount || 0}
            placeholder="Entrez le pourcentage de réduction"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-fit rounded-sm bg-color2 px-3 py-2 text-lg text-white shadow-lg transition-opacity hover:opacity-80"
        disabled={couponMutation.isPending}
      >
        {couponMutation.isPending
          ? 'Traitement en cours...'
          : couponId
          ? 'Modifier le coupon'
          : 'Ajouter un coupon'}
      </button>
    </form>
  );
}
