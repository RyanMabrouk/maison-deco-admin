'use server';

import { createClient } from '@/lib/supabase';

export async function getOrdersStatsPerMonth() {
  const supabase = createClient();

  const now = new Date();

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfThisMonthISO = startOfThisMonth.toISOString();

  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfLastMonthISO = startOfLastMonth.toISOString();

  const endOfLastMonthISO = startOfThisMonth.toISOString();

  const [
    resOrdersThisMonth,
    resOrdersLastMonth,
    resUsersThisMonth,
    resUsersLastMonth
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('total_price.sum(), total_price.avg()', {
        count: 'exact',
        head: false
      })
      .gte('created_at', startOfThisMonthISO),
    supabase
      .from('orders')
      .select('total_price.sum(), total_price.avg()', {
        count: 'exact',
        head: false
      })
      .gte('created_at', startOfLastMonthISO)
      .lt('created_at', endOfLastMonthISO),
    supabase
      .from('users')
      .select(undefined, { count: 'exact', head: false })
      .gte('created_at', startOfThisMonthISO),
    supabase
      .from('users')
      .select(undefined, { count: 'exact', head: false })
      .gte('created_at', startOfLastMonthISO)
      .lt('created_at', endOfLastMonthISO)
  ]);

  const { data: dataLastMonth, error: errorLastMonth } = resOrdersLastMonth;
  const { data: dataThisMonth, error: errorThisMonth } = resOrdersThisMonth;
  const { error: errorUsersThisMonth } = resUsersThisMonth;
  const { error: errorUsersLastMonth } = resUsersLastMonth;

  if (
    errorThisMonth ||
    errorLastMonth ||
    errorUsersThisMonth ||
    errorUsersLastMonth
  ) {
    return {
      data: null,
      error:
        errorThisMonth ??
        errorLastMonth ??
        errorUsersThisMonth ??
        errorUsersLastMonth
    };
  }

  const sumThisMonth: number = dataThisMonth?.[0]?.sum ?? 0;
  const sumLastMonth: number = dataLastMonth?.[0]?.sum ?? 0;
  const avgThisMonth: number = dataThisMonth?.[0]?.avg ?? 0;
  const avgLastMonth: number = dataLastMonth?.[0]?.avg ?? 0;
  const countUsersThisMonth: number = resUsersThisMonth.count ?? 0;
  const countUsersLastMonth: number = resUsersLastMonth.count ?? 0;
  const countOrdersThisMonth: number = resOrdersThisMonth.count ?? 0;
  const countOrdersLastMonth: number = resOrdersLastMonth.count ?? 0;

  return {
    error: null,
    data: {
      sumThisMonth,
      sumLastMonth,
      avgThisMonth,
      avgLastMonth,
      countUsersThisMonth,
      countUsersLastMonth,
      countOrdersThisMonth,
      countOrdersLastMonth
    }
  };
}
