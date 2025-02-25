'use client';
import React, { useState, useRef, useEffect } from 'react';
import PictureUploader from './picture_uploader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/input';
import Textarea from '@/components/textArea';
import { Player } from '@lottiefiles/react-lottie-player';
import { uploadFile } from '@/api/uploadFile';
import { IValidationErrors } from '@/types';
import useProductById from '@/hooks/data/products/getProductById/useProductById';
import { Enums, Json, TablesInsert } from '@/types/database.types';
import { updateProduct } from '@/hooks/data/products/updateProduct/updateProduct';
import { createProduct } from '@/hooks/data/products/createProduct/createProduct';
import SelectGeneric from '@/components/selectGeneric';
import useCategories from '@/hooks/data/categories/useGet';
import AddWindow from './addTools/addWindow';
import { deleteCategory } from '@/hooks/data/categories/delete';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/color-picker';
import { createCategory } from '@/hooks/data/categories/post';
import { z } from 'zod';

type ProductVariation = {
  id: string;
  images: string[];
  unsavedImages: File[];
  color: string;
};
type ProductSize = {
  size: string;
  price_before_discount: number;
};

export const languages: { lang: Enums<'languages_enum'>; label: string }[] = [
  {
    lang: 'fr',
    label: 'Français'
  },
  {
    lang: 'tr',
    label: 'Turc'
  }
];

export default function Form() {
  const [errors, setErrors] = useState<IValidationErrors<
    TablesInsert<'products'>
  > | null>(null);

  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const productId = searchParams.get('productId');
  const { data: product, isLoading } = useProductById(String(productId));
  const queryClient = useQueryClient();
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<File[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  useEffect(() => {
    if (product?.data?.products_categories) {
      setSelectedCategories(
        product?.data?.products_categories.map(
          (category) => category.category_slug
        )
      );
    }
  }, [product?.data?.products_categories.length]);

  const productVariations = product?.data?.variations as unknown as
    | Array<ProductVariation>
    | undefined;
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  useEffect(() => {
    if (productVariations) {
      setVariations(
        productVariations.map((variation) => ({
          id: uuidv4(),
          images: variation.images,
          unsavedImages: [],
          color: variation.color
        }))
      );
    }
  }, [productVariations?.length]);

  const { toast } = useToast();

  const productMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      let product_thumbnail = product?.data?.thumbnail;
      if (
        (thumbnail.length === 1 && product_thumbnail) ||
        thumbnail.length > 1 ||
        (thumbnail.length === 0 && !product_thumbnail)
      ) {
        throw new Error('Veuillez ajouter une seule image de couverture.');
      }
      if (thumbnail.length > 0 && thumbnail[0].size > 0) {
        const imgFormData = new FormData();
        imgFormData.append('thumbnail', thumbnail[0]);
        product_thumbnail = await uploadFile({
          formData: imgFormData,
          name: 'thumbnail',
          title: uuidv4()
        });
      }

      const slug = formData.get('slug') as string;

      const productDataSchema = z.object({
        slug: z.string().min(1, 'Le slug est requis'),
        size: z
          .array(
            z.object({
              size: z.string().min(1, 'Le nom de la taille est requis'),
              price_before_discount: z
                .number()
                .min(0, 'Le prix ne peut pas être négatif')
            })
          )
          .min(1, 'Au moins une taille est requise'),
        thumbnail: z.string().min(1, 'La miniature est requise'),
        stock: z.number().min(0, 'Le stock ne peut pas être négatif'),
        discount: z.number().min(0, 'La réduction ne peut pas être négative'),
        is_published: z.boolean(),
        status: z.string().min(1, 'Le statut est requis').optional(),
        discount_type: z.enum(['percentage', 'amount'])
      });

      const size_names = formData.getAll('size_name') as string[];
      const size_prices = formData.getAll(
        'size_price_before_discount'
      ) as string[];

      const productData = {
        slug: productId ? productId : slug,
        size: size_names.map((size, index) => ({
          size,
          price_before_discount: Number(size_prices[index])
        })),
        thumbnail: product_thumbnail ?? '',
        stock: Number(formData.get('stock')) || 0,
        discount: Number(formData.get('discount')) || 0,
        is_published: formData.get('is_published') === 'true',
        status: String(formData.get('status')) || undefined,
        discount_type:
          (formData.get('discount_type') as Enums<'discount_type'>) ||
          'percentage'
      };

      const parsedData = productDataSchema.safeParse(productData);
      if (!parsedData.success) {
        setErrors((prev: any) => ({ ...prev, ...parsedData.error.errors }));
        toast({
          description: parsedData.error.errors.reduce(
            (acc, error) => `${acc} ${error.message}`,
            ''
          )
        });
        throw new Error('Validation échouée');
      }

      const translationSchema = z.object({
        title: z.string().min(1, 'Le titre est requis'),
        description: z.string().optional().nullable(),
        lang: z.string().min(1, 'La langue est requise')
      });
      const translationData = languages.map(({ lang }) => {
        const title = formData.get(`title_${lang}`) as string;
        const description = formData.get(`description_${lang}`) as string;
        const payload = {
          title,
          description,
          lang
        };
        return payload;
      });

      const parsedTranslations = translationData.map((t) =>
        translationSchema.safeParse(t)
      );

      const invalidTranslations = parsedTranslations.filter((t) => !t.success);
      if (invalidTranslations.length > 0) {
        invalidTranslations.forEach((t) => {
          setErrors((prev: any) => ({ ...prev, ...t.error?.errors }));
          toast({
            description: t.error?.errors.reduce(
              (acc, error) => `${acc} ${error.message}`,
              ''
            )
          });
        });

        throw new Error('Validation échouée');
      }

      const variationsData = await Promise.all(
        variations.map(async (variation) => {
          const newImages = await Promise.all(
            variation.unsavedImages.map(async (image) => {
              if (image.size > 0) {
                const imgFormData = new FormData();
                imgFormData.append('image', image);
                return await uploadFile({
                  formData: imgFormData,
                  name: 'image',
                  title: uuidv4()
                });
              }
              return undefined;
            })
          );
          return {
            color: variation.color,
            images: [
              ...variation.images,
              ...newImages.filter((image) => image !== undefined)
            ]
          };
        })
      );

      if (productId) {
        const categories_to_add = selectedCategories.filter(
          (category_slug) =>
            !product?.data?.products_categories.find(
              (c) => c.category_slug === category_slug
            )
        );
        const categories_to_remove = product?.data?.products_categories.filter(
          (category) =>
            !selectedCategories.find(
              (category_slug) => category_slug === category.category_slug
            )
        );
        const { error } = await updateProduct({
          slug: String(productId),
          payload: {
            ...productData,
            variations: variationsData as Json,
            price_after_discount:
              productData.discount_type === 'percentage'
                ? productData.size[0].price_before_discount -
                  (productData.size[0].price_before_discount *
                    productData.discount) /
                    100
                : productData.size[0].price_before_discount -
                  productData.discount
          },
          translations: translationData.map((t) => ({
            ...t,
            product_slug: productId
          })),
          categories_to_add: categories_to_add.map((category_slug) => ({
            product_slug: productId,
            category_slug
          })),
          categories_to_remove: categories_to_remove ?? []
        });
        if (error) {
          throw new Error(error.message);
        }
        return productId;
      } else {
        const product_slug = slug.toLowerCase().replace(/\s+/g, '-');
        const new_data = {
          ...productData,
          slug: product_slug,
          variations: variationsData as Json,
          price_after_discount:
            productData.discount_type === 'percentage'
              ? Math.floor(
                  productData.size[0].price_before_discount -
                    (productData.size[0].price_before_discount *
                      productData.discount) /
                      100
                )
              : productData.size[0].price_before_discount - productData.discount
        };
        const { error } = await createProduct({
          payload: new_data,
          translations: translationData.map((t) => ({
            ...t,
            product_slug
          })),
          categories: selectedCategories.map((category_slug) => ({
            product_slug,
            category_slug
          }))
        });
        if (error) {
          throw new Error(error.message);
        }
        return product_slug;
      }
    },
    onSuccess: async (slug: string, variables: any, context: any) => {
      if (productId) {
        toast({
          description: 'Produit modifié avec succès.'
        });
        router.push(`/dashboard/product?productId=${slug}`);
      } else {
        toast({
          description: 'Produit ajouté avec succès.'
        });
        if (formRef.current) {
          formRef.current.reset();
          setThumbnail([]);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({
        queryKey: ['products', productId]
      });
      router.refresh();
    },
    onError: (error: any) => {
      if (productId) {
        toast({
          description: "Une erreur s'est produite lors de la modification."
        });
        toast({
          description: error.message.includes('duplicate key')
            ? 'Le slug existe déjà'
            : error.message
        });
      } else {
        toast({
          description: "Une erreur s'est produite lors de l'ajout."
        });
        toast({
          description: error.message.includes('duplicate key')
            ? 'Le slug existe déjà'
            : error.message
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
      action={productMutation.mutate}
    >
      <div className="space-y-4">
        <div className="flex w-full flex-row gap-2">
          <div>
            <label className="mb-2 block font-semibold">
              {'Image de couverture'}
            </label>
            <PictureUploader
              images={thumbnail}
              setImages={setThumbnail}
              savedImages={
                product?.data?.thumbnail ? [product?.data?.thumbnail] : []
              }
            />
          </div>
        </div>
        <div className="flex w-full flex-row gap-2">
          <Input
            label="Slug"
            name="slug"
            type="text"
            defaultValue={product?.data?.slug}
            placeholder="Entrez le slug"
            error={errors?.slug}
            disabled={productId ? true : false}
          />
          <div>
            <label className="mb-2 block font-semibold">{'Publié'}</label>
            <SelectGeneric
              placeholder="Publié"
              name="is_published"
              options={[
                { value: 'true', label: 'oui' },
                { value: 'false', label: 'non' }
              ]}
              selectedValue={product?.data?.is_published ? 'true' : 'false'}
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
              selectedValue={product?.data?.discount_type ?? undefined}
            />
          </div>
          <Input
            label="Réduction"
            name="discount"
            type="number"
            defaultValue={product?.data?.discount || 0}
            placeholder="Entrez le pourcentage de réduction"
            error={errors?.discount}
          />
        </div>
        <Input
          label="Stock"
          name="stock"
          type="number"
          defaultValue={product?.data?.stock || ''}
          placeholder="Entrez la quantité en stock"
          error={errors?.stock}
        />

        <Input
          label="Statut"
          name="status"
          type="text"
          defaultValue={product?.data?.status || ''}
          placeholder="Entrez le statut"
          error={errors?.status}
        />

        <CategoriesSelect
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          defaultValue={selectedCategories}
        />
      </div>
      <div>
        {languages.map((e, i) => (
          <AddTranslation
            {...e}
            key={i}
            title={
              product?.data?.products_translations.find(
                (t) => t.lang === e.lang
              )?.title
            }
            description={
              product?.data?.products_translations.find(
                (t) => t.lang === e.lang
              )?.description ?? undefined
            }
          />
        ))}
      </div>

      <AddSizes />

      <div className="">
        <h3 className="mb-6 text-2xl font-bold text-gray-800">Variations</h3>
        <div className="grid grid-cols-1 gap-6">
          {variations.map((variation, index) => (
            <div key={variation.id} className="mb-10">
              <AddVariation
                id={variation.id}
                savedImages={variation.images}
                color={variation.color}
                onChange={(newVariation) => {
                  setVariations((prevVariations) =>
                    prevVariations.map((v) => {
                      if (v.id === variation.id) {
                        return { ...v, ...newVariation };
                      }
                      return v;
                    })
                  );
                }}
              />
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4"
                  onClick={() => {
                    const newVariations = [...variations];
                    newVariations.splice(index, 1);
                    setVariations(newVariations);
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant={'secondary'}
          className="mt-8"
          onClick={() =>
            setVariations([
              ...variations,
              { images: [], color: '', unsavedImages: [], id: uuidv4() }
            ])
          }
        >
          Ajouter une variation
        </Button>
      </div>

      <button
        type="submit"
        className="mt-5 w-fit rounded-sm bg-color2 px-3 py-2 text-lg text-white shadow-lg transition-opacity hover:opacity-80"
        disabled={productMutation.isPending}
      >
        {productMutation.isPending
          ? 'Traitement en cours...'
          : productId
          ? 'Modifier le produit'
          : 'Ajouter un produit'}
      </button>
    </form>
  );
}

function AddSizes() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const { data: product } = useProductById(String(productId));
  const [sizes, setSizes] = useState<ProductSize[]>(
    (product?.data?.size as ProductSize[]) || []
  );
  const addSize = () => {
    setSizes((prev) => [
      ...prev,
      {
        size: '',
        price_before_discount: 0
      }
    ]);
  };
  const removeSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], size: value };
    setSizes(newSizes);
  };
  const handlePriceChange = (index: number, value: number) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], price_before_discount: value };
    setSizes(newSizes);
  };
  useEffect(() => {
    if (product?.data?.size?.length) {
      setSizes(product?.data?.size as ProductSize[]);
    }
  }, [product?.data?.size?.length]);
  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold text-gray-800">Tailles</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-full">
              <label className="block font-semibold ">
                {'Nom de la taille'}
              </label>
              <input
                type="text"
                name={`size_name`}
                value={size.size}
                onChange={(e) => handleSizeChange(index, e.target.value)}
                className="mt-2 h-11 w-full rounded-sm border border-gray-300 p-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-color2"
                placeholder="Entrez la taille"
              />
            </div>
            <div className="w-full">
              <label className="block font-semibold ">
                {'Prix avant réduction'}
              </label>
              <input
                type="number"
                name={`size_price_before_discount`}
                value={size.price_before_discount}
                onChange={(e) =>
                  handlePriceChange(index, Number(e.target.value))
                }
                className="mt-2 h-11 w-full rounded-sm border border-gray-300 p-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-color2"
                placeholder="Entrez le prix"
              />
            </div>
            <Input
              label="Prix après réduction"
              name="price_after_discount"
              type="number"
              value={
                product?.data?.discount_type === 'amount'
                  ? size.price_before_discount - product?.data?.discount
                  : size.price_before_discount -
                    (size.price_before_discount *
                      Number(product?.data?.discount ?? 0)) /
                      100
              }
              disabled
            />
            <button
              type="button"
              onClick={() => removeSize(index)}
              className="ml-2 mt-7 text-xl text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        onClick={addSize}
        // className="hover:bg-color2-dark mt-2 rounded bg-color2 px-3 py-1 text-white"
        variant={'secondary'}
        className="mt-8"
      >
        Ajouter une taille
      </Button>
    </div>
  );
}

function AddVariation({
  savedImages,
  color,
  onChange,
  id
}: {
  savedImages: string[];
  color: string;
  onChange: (variation: Omit<ProductVariation, 'images'>) => void;
  id: string;
}) {
  const [images, setImages] = useState<File[]>([]);
  const [colorValue, setColorValue] = useState(color);

  useEffect(() => {
    onChange({ unsavedImages: images, color: colorValue, id });
  }, [images.length]);

  useEffect(() => {
    setColorValue(color);
  }, [colorValue]);

  return (
    <div className="flex flex-row gap-8">
      <div className="flex w-full flex-row gap-2">
        <div>
          <label className="mb-2 block font-semibold">{'Couleur'}</label>
          <ColorPicker
            name={`color_${id}`}
            defaultValue={color}
            onChange={(value) => {
              setColorValue(value);
              onChange({ unsavedImages: images, color: value, id });
            }}
            value={colorValue}
          />
        </div>
        <PictureUploader
          images={images}
          setImages={setImages}
          savedImages={savedImages}
        />
      </div>
    </div>
  );
}

function AddTranslation({
  lang,
  label,
  title,
  description,
  with_description = true
}: {
  lang: Enums<'languages_enum'>;
  label: string;
  title?: string;
  description?: string;
  with_description?: boolean;
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
        {with_description && (
          <Textarea
            label="Description"
            name={`description_${lang}`}
            placeholder="Entrez la description"
            defaultValue={description}
          />
        )}
      </div>
    </div>
  );
}

function CategoriesSelect({
  defaultValue,
  selectedCategories,
  setSelectedCategories
}: {
  defaultValue: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const { data: categories } = useCategories({});
  const options = categories?.data?.map((category) => ({
    label: category.slug,
    value: category.slug
  }));
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteCategoryMutation = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await deleteCategory(slug);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        description: 'La catégorie a été supprimée avec succès.'
      });
    },
    onError: (error: any) => {
      toast({
        description: "Une erreur s'est produite lors de la suppression."
      });
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const categoryPayloadSchema = z.object({
        slug: z.string().min(1, 'Le slug est requis'),
        parent_slug: z.string().optional().nullable()
      });

      const categoryTranslationSchema = z.object({
        category_slug: z.string().min(1, 'Le slug de catégorie est requis'),
        title: z.string().min(1, 'Le titre est requis'),
        lang: z.string().min(1, 'La langue est requise')
      });

      const dataSchema = z.object({
        payload: categoryPayloadSchema,
        translations: z
          .array(categoryTranslationSchema)
          .min(1, 'Au moins une traduction est requise')
      });

      const slug = String(formData.get('slug'))
        .toLowerCase()
        .replace(/\s+/g, '-');
      const data: {
        payload: TablesInsert<'categories'>;
        translations: TablesInsert<'categories_translations'>[];
      } = {
        payload: {
          slug,
          parent_slug: (formData.get('parent_slug') as string) || null
        },
        translations: languages.map(({ lang }) => {
          const title = formData.get(`title_${lang}`) as string;
          const payload = {
            category_slug: slug,
            title,
            lang
          };
          return payload;
        })
      };

      const parsedData = dataSchema.safeParse(data);

      if (!parsedData.success) {
        throw new Error(
          parsedData.error.errors.reduce(
            (acc, error) => `${acc} ${error.message}`,
            ''
          )
        );
      }

      const { error } = await createCategory(data);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        description: 'La catégorie a été ajoutée avec succès.'
      });
    },
    onError: (error: any) => {
      toast({
        description: "Une erreur s'est produite lors de l'ajout."
      });
      toast({
        description: error.message
      });
    }
  });

  return (
    <div>
      <label className="mb-2 block font-semibold">Catégorie</label>
      <div className="flex items-center gap-2">
        <MultiSelect
          options={options ?? []}
          value={selectedCategories}
          onValueChange={setSelectedCategories}
          handleDeleteOption={(slug: string) => {
            deleteCategoryMutation.mutate(slug);
          }}
          defaultValue={defaultValue}
          placeholder="Sélectionner une catégorie"
          variant="inverted"
          animation={2}
          maxCount={3}
        />
        <AddWindow
          mutationFunction={createCategoryMutation}
          title="Ajouter une catégorie"
          form={
            <div className="flex flex-col gap-2">
              <Input
                label="Slug"
                name="slug"
                type="text"
                placeholder="Entrez le slug"
              />
              <SelectGeneric
                placeholder="Catégorie parent"
                name="parent_slug"
                options={options ?? []}
              />
              <span className="my-2"></span>

              {languages.map((e, i) => (
                <AddTranslation {...e} key={i} with_description={false} />
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
}
