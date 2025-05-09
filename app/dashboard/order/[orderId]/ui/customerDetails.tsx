'use client';
import useOrderById from '@/hooks/data/orders/getOrdersById/useById';
import useUser from '@/hooks/data/users/getUserById/useUserById';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';

type CustomerDetailsProps = {
  id: string;
};

export default function CustomerDetails({ id }: CustomerDetailsProps) {
  const { data: customer } = useUser(id);
  const { orderId } = useParams();
  const { data: order } = useOrderById(String(orderId));

  return (
    <div className=" flex  flex-col gap-6 rounded-lg bg-white p-6 shadow-lg">
      <div className="flex items-center gap-4">
        <Image
          src={customer?.data?.avatar ?? '/noAvatar.jpg'}
          width={80}
          height={80}
          alt="Avatar du Client"
          className="h-20 w-20 rounded-full border-2 border-color2 object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {customer?.data?.full_name}
          </h2>
          <p className="text-sm text-gray-500">
            ID client : {customer?.data?.id}
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-2 text-xl font-semibold text-gray-700">
          Informations de contact
        </h3>
        <div className="space-y-2">
          <div className="mt-2 flex items-center">
            <span className="mr-2 text-nowrap text-gray-600">Email :</span>
            <span className="text-gray-800">{customer?.data?.email}</span>
          </div>
          <div className="flex items-center">
            <span className=" mr-2 text-gray-600">Numéro de téléphone :</span>
            <span className="text-gray-800">{customer?.data?.phone}</span>
          </div>
        </div>
        <div className="mt-2">
          {order?.data?.bill_url ? (
            <a
              href={order.data.bill_url}
              download
              target="_blank"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Télécharger la facture
            </a>
          ) : (
            <span className="text-gray-400">Aucune facture disponible</span>
          )}
        </div>{' '}
      </div>
    </div>
  );
}
