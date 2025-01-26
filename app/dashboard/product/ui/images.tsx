'use client';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import React from 'react';

export default function Images({
  images,
  setImages,
  setUpdatedImages,
  updatedImages
}: {
  images: File[];
  updatedImages: string[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  setUpdatedImages: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const deleteSavedImageMutation = useMutation({
    mutationFn: async () => {
      // Votre logique de suppression d'image ici
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: productByIdQuery(productId).queryKey
      // });
      toast.toast({ description: 'L’image a été supprimée avec succès' }); // Optionnel
    },
    onError: (error: any) => {
      toast.toast({
        description: 'Une erreur est survenue lors de la suppression'
      }); // Optionnel
    }
  });

  const removeImage = (fileName: string) => {
    setImages((prevImages) =>
      prevImages.filter((file) => file.name !== fileName)
    );
  };

  const deleteSavedImage = (imageUrl: string) => {
    const updatedImageList = updatedImages.filter((img) => img !== imageUrl);
    setUpdatedImages(updatedImageList);
    deleteSavedImageMutation.mutate();
  };

  return (
    <>
      {[...images, ...updatedImages].map((file, index) => (
        <div
          key={index}
          className="group relative m-2 h-32 w-32 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={file instanceof File ? URL.createObjectURL(file) : file}
            alt={
              file instanceof File ? file.name : `Image sauvegardée ${index}`
            }
            className="h-full w-full rounded-md object-cover"
            width={450}
            height={450}
            draggable={false}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (file instanceof File) {
                removeImage(file.name);
              } else {
                deleteSavedImage(file);
              }
            }}
            className="absolute right-0 top-0 hidden cursor-pointer rounded-full bg-red-500 px-2 py-1 text-sm text-white group-hover:block"
          >
            Supprimer
          </div>
        </div>
      ))}
    </>
  );
}
