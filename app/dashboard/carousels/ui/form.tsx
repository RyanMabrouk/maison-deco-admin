'use client';
import React, { useState, useRef, useEffect } from 'react';
import PictureUploader from './picture_uploader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { Player } from '@lottiefiles/react-lottie-player';
import { uploadFile } from '@/api/uploadFile';
import useCarousels from '@/hooks/data/carousels/get/useGet';
import { updateCarousel } from '@/hooks/data/carousels/update';
import { createCarousel } from '@/hooks/data/carousels/post';
import { Enums } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { languages } from '../../product/ui/form';
import { deleteCarousel } from '@/hooks/data/carousels/delete';
import Input from '@/components/input';

export default function Form() {
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: carousels, isLoading } = useCarousels({});

  const [unsavedCarousels, setUnsavedCarousels] = useState<
    {
      id: string | null;
      redirect_url: string;
      translations: {
        lang: Enums<'languages_enum'>;
        savedImage: string | null;
        unsavedImage: File | null;
      }[];
    }[]
  >([]);

  useEffect(() => {
    if (carousels?.data) {
      setUnsavedCarousels(
        carousels.data.map((carousel) => ({
          id: carousel.id,
          redirect_url: carousel.redirect_url ?? '',
          translations: carousel.carousels_translations.map((t) => ({
            lang: t.lang,
            savedImage: t.image_url ?? '',
            unsavedImage: null
          }))
        }))
      );
    }
  }, [carousels?.data?.length]);

  const { toast } = useToast();

  const carouselMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const new_carousels = await Promise.all(
        unsavedCarousels.map(async (carousel, index) => {
          const newImages = await Promise.all(
            carousel.translations.map(async (t) => {
              let uploadedImage = undefined;
              if (t.unsavedImage && t.unsavedImage.size > 0) {
                const imgFormData = new FormData();
                imgFormData.append('image', t.unsavedImage);
                uploadedImage = await uploadFile({
                  formData: imgFormData,
                  name: 'image',
                  title: uuidv4()
                });
              }
              return uploadedImage;
            })
          );

          return {
            id: carousel.id,
            redirect_url:
              String(formData.get(`redirect_url_${index}`)) ||
              carousel.redirect_url,
            translations: carousel.translations.map((t, i) => {
              const image_url = newImages[i] || t.savedImage;
              if (!image_url) {
                throw new Error('Une image est requise.');
              }
              return { lang: t.lang, image_url };
            })
          };
        })
      );

      const errors = await Promise.all(
        new_carousels.map(async (carousel, index) => {
          if (carousel.id) {
            return await updateCarousel({
              id: carousel.id,
              payload: {
                redirect_url: carousel.redirect_url
              },
              translations: carousel.translations.map((t) => ({
                lang: t.lang,
                image_url: t.image_url,
                carousel_item_id: carousel.id as string
              }))
            });
          } else {
            return await createCarousel({
              payload: {
                redirect_url: carousel.redirect_url
              },
              translations: carousel.translations
            });
          }
        })
      );

      errors.forEach((e) => {
        if (e.error) {
          throw new Error(e.error?.message);
        }
      });

      const deletedCarousels = carousels?.data?.filter(
        (c) => !new_carousels.some((nc) => nc.id === c.id)
      );

      const errors2 = await Promise.all(
        deletedCarousels?.map(async (carousel) => {
          return await deleteCarousel(carousel.id);
        }) || []
      );

      errors2.forEach((e) => {
        if (e.error) {
          throw new Error(e.error?.message);
        }
      });

      return 'success';
    },
    onSuccess: async () => {
      toast({
        description: 'Carrousel modifié avec succès.'
      });
      if (formRef.current) {
        formRef.current.reset();
      }
      await queryClient.invalidateQueries({ queryKey: ['carousels'] });
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        description: "Une erreur s'est produite lors de la modification."
      });
      toast({
        description: error.message
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
    <form
      className="flex flex-col gap-8 rounded-sm p-3"
      ref={formRef}
      action={carouselMutation.mutate}
    >
      <div>
        <div className="flex flex-col gap-4">
          {unsavedCarousels.map((carousel, index) => (
            <div key={index} className="mb-10 flex flex-col gap-6">
              <header className="flex flex-row items-center gap-6">
                <h4 className="text-xl font-semibold text-gray-800">
                  Carousel {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="secondary"
                  className=""
                  onClick={() => {
                    setUnsavedCarousels(
                      unsavedCarousels.filter((_, i) => i !== index)
                    );
                  }}
                >
                  Supprimer
                </Button>
              </header>
              <Input
                label="URL de redirection"
                name={`redirect_url_${index}`}
                type="url"
                defaultValue={carousel.redirect_url}
                placeholder="Entrez l'URL de redirection"
              />
              {carousel.translations.map((t, i) => (
                <AddCarousel
                  key={t.lang}
                  savedImage={t.savedImage as string}
                  lang={t.lang}
                  onChange={(variation) => {
                    setUnsavedCarousels((prev) => {
                      const newVariations = [...prev];
                      newVariations[index].translations[i] = {
                        lang: variation.lang,
                        savedImage: t.savedImage,
                        unsavedImage: variation.unsavedImage
                      };
                      return newVariations;
                    });
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant={'secondary'}
          className="mt-8"
          onClick={() =>
            setUnsavedCarousels([
              ...unsavedCarousels,
              {
                id: null,
                redirect_url: '',
                translations: languages.map((lang) => ({
                  lang: lang.lang,
                  savedImage: null,
                  unsavedImage: null
                }))
              }
            ])
          }
        >
          Ajouter une carousel
        </Button>
      </div>

      <button
        type="submit"
        className="mt-5 w-fit rounded-sm bg-color2 px-3 py-2 text-lg text-white shadow-lg transition-opacity hover:opacity-80"
        disabled={carouselMutation.isPending}
      >
        {carouselMutation.isPending
          ? 'Traitement en cours...'
          : 'Enregistrer les modifications'}
      </button>
    </form>
  );
}

function AddCarousel({
  savedImage,
  lang,
  onChange
}: {
  savedImage: string | null;
  lang: Enums<'languages_enum'>;
  onChange: (variation: {
    unsavedImage: File;
    lang: Enums<'languages_enum'>;
  }) => void;
}) {
  const [images, setImages] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (images.length === 1) {
      onChange({ unsavedImage: images[0], lang });
    }
    if (images.length > 1) {
      setImages([images[0]]);
      toast({
        description: 'Une seule image est autorisée.'
      });
    }
  }, [images.length]);

  return (
    <div className="flex flex-row gap-8 ">
      <div className="flex w-full flex-row gap-2">
        <div key={lang}>
          <label className="mb-2 block font-semibold">
            {languages.find((l) => l.lang === lang)?.label}
          </label>
          <PictureUploader
            images={images}
            setImages={setImages}
            savedImages={savedImage ? [savedImage] : []}
          />
        </div>
      </div>
    </div>
  );
}
