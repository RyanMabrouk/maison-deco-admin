'use server';
import { createClient } from '@/lib/supabase';

interface Stat {
  date: string;
  avg_earnings: number;
  user_count: number;
}

export async function getOrdersStats() {
  const supabase = createClient();

  // Fetch orders and users in parallel
  const [ordersRes, usersRes] = await Promise.all([
    supabase.from('orders').select('created_at, total_price'),
    supabase.from('users').select('created_at')
  ]);

  if (ordersRes.error || usersRes.error) {
    return {
      data: null,
      error: ordersRes.error || usersRes.error
    };
  }

  const groupedOrders: { [key: string]: { sum: number; count: number } } = {};

  ordersRes.data.forEach((order) => {
    const date = new Date(order.created_at).toISOString().split('T')[0];

    if (!groupedOrders[date]) {
      groupedOrders[date] = { sum: 0, count: 0 };
    }

    groupedOrders[date].sum += order.total_price;
    groupedOrders[date].count += 1;
  });

  const groupedUsers: { [key: string]: number } = {};

  usersRes.data.forEach((user) => {
    const date = new Date(user.created_at).toISOString().split('T')[0];

    if (!groupedUsers[date]) {
      groupedUsers[date] = 0;
    }

    groupedUsers[date] += 1;
  });

  const allDates = Array.from(
    new Set([...Object.keys(groupedOrders), ...Object.keys(groupedUsers)])
  ).sort();

  const stats: Stat[] = allDates.map((date) => ({
    date,
    avg_earnings: groupedOrders[date]
      ? parseFloat(
          (groupedOrders[date].sum / groupedOrders[date].count).toFixed(2)
        )
      : 0,
    user_count: groupedUsers[date] || 0
  }));

  return {
    data: stats,
    error: null
  };
}
