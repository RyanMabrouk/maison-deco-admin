'use server';
import { createClient } from '@/lib/supabase';

interface MonthlyStatusStat {
  month: string;
  pending: number;
  processing: number;
  delivered: number;
  cancelled: number;
}

export async function getOrdersStatsByStatus() {
  const supabase = createClient();

  // Fetch orders with their status
  const { data: orders, error } = await supabase
    .from('orders')
    .select('created_at, status')
    .order('created_at', { ascending: true });

  if (error) {
    return {
      data: null,
      error
    };
  }

  const groupedOrders: { [key: string]: { [status: string]: number } } = {};

  orders.forEach((order) => {
    const month = new Date(order.created_at).toLocaleString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });

    if (!groupedOrders[month]) {
      groupedOrders[month] = {
        pending: 0,
        processing: 0,
        delivered: 0,
        cancelled: 0
      };
    }

    const status = order.status.toLowerCase(); // Ensure status is in lowercase
    if (status in groupedOrders[month]) {
      groupedOrders[month][status] += 1;
    }
  });

  const stats: MonthlyStatusStat[] = Object.keys(groupedOrders)
    .sort()
    .map((month) => ({
      month,
      pending: groupedOrders[month].pending,
      processing: groupedOrders[month].processing,
      delivered: groupedOrders[month].delivered,
      cancelled: groupedOrders[month].cancelled
    }));

  return {
    data: stats,
    error: null
  };
}
