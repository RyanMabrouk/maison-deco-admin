import Image from 'next/image';
import Status from './status';
import { QueryReturnType } from '@/types';
import { orderByIdQuery } from '@/hooks/data/orders/getOrdersById/ByIdQuery';

export interface CartItem {
  quantity: number;
  translation: {
    title: string;
    description: string;
    lang: string;
  };
  slug: string;
  discount: number;
  discount_type: string;
  price_before_discount: number;
  price_after_discount: number;
  thumbnail?: string;
  variation?: {
    color: string;
    images: string[];
  };
  size?: string;
}

export default function OrderProducts({
  order
}: {
  order: QueryReturnType<typeof orderByIdQuery>['data'];
}) {
  if (!order) return null;
  const products = (order.items ?? []) as unknown as CartItem[];
  const isScrollable = products.length >= 3;

  return (
    <div className="max-w-full rounded-md bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between py-2">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">
          Produits de la commande
        </h2>
        <span className="-mt-6">
          {order && <Status status={order.status} />}
        </span>
      </div>
      <div
        className={`-mx-4 overflow-x-auto sm:mx-0 ${
          isScrollable ? 'max-h-80 overflow-y-auto' : ''
        }`}
      >
        <table className="w-full">
          <thead className="hidden sm:table-header-group">
            <tr className="border-b">
              <th className="min-w-[100px] px-2 py-2 text-center">Slug</th>
              <th className="min-w-[150px] px-2 py-2 text-center">Prix</th>
              <th className="min-w-[40px] px-2 py-2 text-center">Quantité</th>
              <th className="min-w-[100px] px-2 py-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b">
                <td className="px-2 py-4">
                  <div className="flex items-center ">
                    <Image
                      src={product.thumbnail ?? '/empty.png'}
                      alt={product.slug}
                      width={60}
                      height={60}
                      className="mr-4 h-auto min-w-[4rem] rounded-md"
                    />
                    <div className="leading-tight">
                      <div
                        className={`tooltip ${
                          index === 0 ? 'tooltip-bottom sm:tooltip-top' : ''
                        }`}
                        data-tip={product.slug}
                      >
                        <div className="line-clamp-1 font-semibold">
                          {product.slug}
                        </div>
                      </div>
                      {/* <div className="text-gray-500">{product.isbn}</div> */}
                      <div className="mt-2 space-y-1 sm:hidden">
                        <div className="flex gap-2">
                          <span className="text-gray-500">Prix :</span>
                          {product.price_before_discount !==
                          product.price_after_discount ? (
                            <div className="inline-flex flex-row items-center gap-1">
                              <del className="text-gray-500 line-through">
                                {product.price_before_discount} €
                              </del>
                              <span className="font-medium">
                                {product.price_after_discount} €
                              </span>
                            </div>
                          ) : (
                            <span>{product.price_after_discount} €</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-500">Quantité :</span>
                          <span>{product.quantity}</span>
                        </div>
                        <div className="flex gap-2 font-medium">
                          <span className="text-gray-500">Total :</span>
                          <span>
                            {product.quantity * product.price_after_discount} €
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-2 py-4 text-center sm:table-cell">
                  {product.price_before_discount !==
                  product.price_after_discount ? (
                    <div className="inline-flex flex-col items-end gap-1 md:flex-row md:items-center">
                      <span className="text-gray-500 line-through">
                        {product.price_before_discount} €
                      </span>
                      <span className="font-medium">
                        {product.price_after_discount} €
                      </span>
                    </div>
                  ) : (
                    <span>{product.price_after_discount} €</span>
                  )}
                </td>
                <td className="hidden px-2 py-4 text-center sm:table-cell">
                  {product.quantity}
                </td>
                <td className="hidden px-2 py-4 text-center sm:table-cell">
                  {product.quantity * product.price_after_discount} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between pt-4 text-lg font-semibold">
        <span>Total :</span>
        <span>
          {products.reduce(
            (sum, product) =>
              sum + product.quantity * product.price_after_discount,
            0
          )}{' '}
          €
        </span>
      </div>
    </div>
  );
}
