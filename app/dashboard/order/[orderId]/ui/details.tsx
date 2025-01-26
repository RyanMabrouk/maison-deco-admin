import React from 'react';
import OrderProducts from './orderProducts';
import CustomerDetails from './customerDetails';
import ShippingAddress from './shippingAddress';
import useOrderById from '@/hooks/data/orders/getOrdersById/useById';

export default function Details({ id }: { id: string }) {
  const { data: order } = useOrderById(id);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex w-full flex-col gap-5 md:flex-row-reverse">
        <div className="grid w-full grid-cols-1 gap-5 md:w-[70%]">
          <OrderProducts order={order?.data ?? null} />
        </div>
        <div className="flex w-full flex-col gap-5 md:w-[30%]">
          <CustomerDetails id={String(order?.data?.user_id)} />
          <ShippingAddress order={order?.data ?? null} />
        </div>
      </div>
    </div>
  );
}
