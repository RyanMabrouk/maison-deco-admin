'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { SearchIcon } from 'lucide-react';
import { Enums, Tables } from '@/types/database.types';
import { IValidationErrors } from '@/types';
import { Player } from '@lottiefiles/react-lottie-player';
import Image from 'next/image';
import useHighlightById from '@/hooks/data/highlights/getHighlightById/useHighlightById';
import useProducts from '@/hooks/data/products/getProducts/useProducts';
import { createHighlight } from '@/hooks/data/highlights/post';
import { updateHighlight } from '@/hooks/data/highlights/update';
import Input from '@/components/input';
import { languages } from '../../product/ui/form';

export default function Highlight() {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const { data: highlight, isLoading } = useHighlightById(String(slug));
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [errors, setErrors] = useState<
    IValidationErrors<any> | null | undefined
  >();

  const [newSlug, setNewSlug] = useState<string>(highlight?.data?.slug ?? '');
  const [selectedProducts, setSelectedProducts] = useState<
    Tables<'products'>[]
  >(highlight?.data?.highlight_products ?? []);

  useEffect(() => {
    if (highlight?.data?.highlight_products) {
      setSelectedProducts(highlight.data.highlight_products);
    }
  }, [highlight?.data.highlight_products, length]);
  useEffect(() => {
    if (highlight?.data?.slug) {
      setNewSlug(highlight.data.slug);
    }
  }, [highlight?.data.slug]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const { data: products } = useProducts({
    ilike: {
      slug: searchQuery
    },
    pagination: {
      page: 1,
      limit: 5
    }
  });

  const handleSelectProduct = (product: Tables<'products'>) => {
    if (!selectedProducts.some((selected) => selected.slug === product.slug)) {
      setSelectedProducts((prev) => [...prev, product]);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveProduct = (slug: string) => {
    setSelectedProducts((prev) => prev.filter((e) => e.slug !== slug));
  };

  const updateHighlightMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const translationData = languages.map(({ lang }) => {
        const title = formData.get(`title_${lang}`) as string;
        const payload = {
          title,
          lang
        };
        return payload;
      });

      if (slug) {
        const { error } = await updateHighlight({
          slug: String(slug),
          products_ids: selectedProducts.map((e) => e.slug),
          payload: translationData.map((t) => ({
            ...t,
            highlight_slug: String(slug)
          }))
        });
        if (error) throw new Error(error.message);
      } else {
        const { error } = await createHighlight({
          payload: {
            slug: newSlug
          },
          products_ids: selectedProducts.map((e) => e.slug),
          translations: translationData.map((t) => ({
            ...t,
            highlight_slug: newSlug
          }))
        });
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast({
        description: slug
          ? 'La sélection spéciale a été modifié avec succès.'
          : 'La sélection spéciale a été ajouté avec succès.'
      });
      if (!slug && formRef.current) {
        formRef.current.reset();
        setNewSlug('');
        setSelectedProducts([]);
      }
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
    },
    onError: (error: Error) => {
      toast({
        description: slug
          ? 'Une erreur est survenue lors de la modification du sélection spéciale.'
          : "Une erreur est survenue lors de l'ajout du sélection spéciale."
      });
      toast({
        description: error.message
      });
    }
  });

  if (isLoading)
    return (
      <div className="m-auto flex min-h-screen items-center justify-center">
        <Player
          autoplay
          loop
          src="/loading.json"
          style={{ height: '10rem', width: '10rem' }}
        />
      </div>
    );

  return (
    <form ref={formRef} action={updateHighlightMutation.mutate}>
      <div className="mb-4">
        <label htmlFor="highlightName" className="mb-2 block font-semibold">
          Nom du sélection spéciale
        </label>
        <input
          type="text"
          id="highlightName"
          value={newSlug}
          onChange={(e) => setNewSlug(e.target.value)}
          className="w-full rounded-sm border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-color2"
          disabled={slug !== null}
        />
        {errors?.name?.map((err, index) => (
          <p key={index} className="mt-2 text-red-500">
            {err}
          </p>
        ))}
      </div>
      <div>
        {languages.map((e, i) => (
          <AddTranslation
            {...e}
            key={i}
            title={
              highlight?.data.highlights_translations?.find(
                (t) => t.lang === e.lang
              )?.title
            }
          />
        ))}
      </div>
      <div className="relative mb-4">
        <label className="mb-2 block font-semibold">
          Recherche de produits
        </label>
        <div className="flex items-center gap-2 rounded border border-gray-300 p-2 shadow-sm">
          <input
            type="text"
            placeholder="Recherche ..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => setShowSuggestions(false)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full rounded-lg placeholder:text-sm focus:outline-none"
          />
          <button type="button" className="p-2">
            <SearchIcon size={15} />
          </button>
        </div>

        {showSuggestions && (products?.data?.length ?? 0) > 0 && (
          <div className="absolute w-full border bg-white shadow-md">
            {products?.data
              .filter(
                (e) =>
                  !selectedProducts.some((selected) => selected.slug === e.slug)
              )
              .map((e) => (
                <div
                  key={e.slug}
                  onMouseDown={() => handleSelectProduct(e)}
                  className="flex cursor-pointer items-center gap-2 p-2 hover:bg-gray-100"
                >
                  <Image
                    src={e.thumbnail ?? '/empty.png'}
                    width={50}
                    height={50}
                    alt=""
                  />
                  <span>{e.slug}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-semibold">
          Produits sélectionnés
        </label>
        {errors?.products_ids?.map((err, index) => (
          <p key={index} className="mt-2 text-red-500">
            {err}
          </p>
        ))}
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <div
              key={product.slug}
              className="flex items-center gap-2 rounded p-2"
            >
              <Image
                src={product.thumbnail ?? '/empty.png'}
                width={50}
                height={50}
                alt=""
              />
              <span>{product.slug}</span>

              <button
                type="button"
                onClick={() => handleRemoveProduct(product.slug)}
                className="text-2xl font-bold text-red-500"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="rounded bg-color2 px-4 py-3 text-lg text-white shadow-lg transition-opacity hover:opacity-80"
        disabled={updateHighlightMutation.isPending}
      >
        {updateHighlightMutation.isPending
          ? 'Traitement en cours...'
          : slug
          ? 'Modifier lq sélection spéciale'
          : 'Ajouter une sélection spéciale'}
      </button>
    </form>
  );
}

function AddTranslation({
  lang,
  label,
  title
}: {
  lang: Enums<'languages_enum'>;
  label: string;
  title?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-700">
        Traduction en {label}
      </h2>
      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Titre"
          name={`title_${lang}`}
          type="text"
          placeholder="Entrez le titre"
          defaultValue={title}
        />
      </div>
    </div>
  );
}
