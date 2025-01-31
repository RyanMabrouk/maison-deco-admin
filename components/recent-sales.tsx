'use client';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import useOrders from '@/hooks/data/orders/getOrders/useGet';

export function RecentSales() {
  const { data: recentSalesData } = useOrders({
    pagination: {
      page: 1,
      limit: 5
    },
    order: {
      column: 'created_at',
      direction: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      {recentSalesData?.data.map((sale, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={sale.users.avatar ?? '/noAvatar.jpg'}
              alt={`${sale.users.full_name} Avatar`}
            />
            {/* <AvatarFallback>{sale.}</AvatarFallback> */}
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {sale.users.full_name}
            </p>
            <p className="text-sm text-muted-foreground">{sale.users.email}</p>
            <p className="text-xs text-muted-foreground">
              Créé le :{' '}
              {new Date(sale.created_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric'
              })}
            </p>
          </div>
          <div className="ml-auto font-medium">+{sale.total_price}€</div>
        </div>
      ))}
    </div>
  );
}
