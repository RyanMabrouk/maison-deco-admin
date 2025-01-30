'use client';

import { useToast } from '@/components/ui/use-toast';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Images from './images';

export default function PictureUploader({
  savedImages,
  images,
  setImages
}: {
  savedImages: string[];
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const { toast } = useToast();
  const [updatedImages, setUpdatedImages] =
    React.useState<string[]>(savedImages);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.filter(
        (file) =>
          !images.some(
            (existingFile) =>
              existingFile.name === file.name && existingFile.size === file.size
          )
      );
      if (newFiles.length > 0) {
        setImages((prevImages) => [...prevImages, ...newFiles]);
      } else {
        toast({
          title: 'Erreur',
          description: 'Cette image existe déjà.'
        });
      }
    },
    [images, setImages, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col gap-5 rounded-lg border-4 border-dashed p-8 text-center ${
          images.length > 0 ? 'pb-0' : ''
        } ${isDragActive ? 'border-green-500' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-green-500">Déposez les images ici...</p>
        ) : (
          <p className="text-gray-500">
            Faites glisser les images et déposez-les ici, ou cliquez pour
            sélectionner des images
          </p>
        )}
        <div className="mx-auto mt-4 grid w-full grid-cols-2 place-items-center gap-4 sm:grid-cols-3">
          <Images
            setImages={setImages}
            images={images}
            setUpdatedImages={setUpdatedImages}
            updatedImages={updatedImages}
          />
        </div>
      </div>
    </div>
  );
}
