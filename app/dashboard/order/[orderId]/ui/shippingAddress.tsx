'use client';
import { orderByIdQuery } from '@/hooks/data/orders/getOrdersById/ByIdQuery';
import { QueryReturnType } from '@/types';
import React from 'react';

export default function ShippingAddress({
  order
}: {
  order: QueryReturnType<typeof orderByIdQuery>['data'] | null;
}) {
  return (
    <div className=" flex flex-col gap-2 rounded-lg bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Adresse de Livraison
        </h2>
      </div>
      <div className="text-lg text-gray-700">
        {order?.shipping_address
          .split(',')
          .map((line, index) => <p key={index}>{line.trim()}</p>)}
      </div>
    </div>
  );
}
