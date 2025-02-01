'use server';
import { CartItem } from '@/app/dashboard/order/[orderId]/ui/orderProducts';
import { createClient } from '@/lib/supabase';

interface CategoryStats {
  category_slug: string;
  sum: number;
  count: number;
}

async function fetchStatsForPeriod(
  supabase: ReturnType<typeof createClient>,
  startDate: string,
  endDate: string
): Promise<CategoryStats[] | null> {
  // Récupérer toutes les commandes pour la période spécifiée avec leurs items
  const { error, data } = await supabase
    .from('orders')
    .select('total_price, items')
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  if (error) {
    return null;
  }

  const allProductsPurchased = (data?.map((order) => order.items).flat() ??
    []) as unknown as CartItem[];

  const productSlugs = [
    ...new Set(allProductsPurchased.map((item) => item.slug))
  ];

  const { error: error2, data: data2 } = await supabase
    .from('products_categories')
    .select('product_slug, category_slug')
    .in('product_slug', productSlugs);

  if (error2) {
    return null;
  }

  const categoryMap: { [key: string]: string } = {};
  data2?.forEach((category) => {
    categoryMap[category.product_slug] = category.category_slug;
  });

  const groupedData: { [key: string]: { sum: number; count: number } } = {};

  allProductsPurchased.forEach((item) => {
    const categorySlug = categoryMap[item.slug] || 'non catégorisé';
    if (!groupedData[categorySlug]) {
      groupedData[categorySlug] = { sum: 0, count: 0 };
    }
    groupedData[categorySlug].sum += item.price_after_discount;
    groupedData[categorySlug].count += 1;
  });

  const stats: CategoryStats[] = Object.keys(groupedData)
    .sort()
    .map((category_slug) => ({
      category_slug,
      sum: parseFloat(groupedData[category_slug].sum.toFixed(2)),
      count: groupedData[category_slug].count
    }));

  return stats;
}

export async function getOrdersStatsPerCategory() {
  const supabase = createClient();

  const now = new Date();

  // Fonction pour déterminer le trimestre d'une date
  const getQuarter = (date: Date): number => {
    return Math.floor((date.getMonth() + 3) / 3);
  };

  // Définir la période du trimestre en cours
  const currentQuarter = getQuarter(now);
  const startOfCurrentQuarter = new Date(
    now.getFullYear(),
    (currentQuarter - 1) * 3,
    1
  );
  const endOfCurrentQuarter = new Date(
    now.getFullYear(),
    currentQuarter * 3,
    1
  );

  // Définir la période du trimestre précédent
  let previousQuarter = currentQuarter - 1;
  let yearOfPreviousQuarter = now.getFullYear();
  if (previousQuarter === 0) {
    previousQuarter = 4;
    yearOfPreviousQuarter -= 1;
  }
  const startOfPreviousQuarter = new Date(
    yearOfPreviousQuarter,
    (previousQuarter - 1) * 3,
    1
  );
  const endOfPreviousQuarter = new Date(
    yearOfPreviousQuarter,
    previousQuarter * 3,
    1
  );

  // Formater les dates en ISO string
  const periods = [
    {
      key: 'currentQuarter',
      start: startOfCurrentQuarter.toISOString(),
      end: endOfCurrentQuarter.toISOString()
    },
    {
      key: 'previousQuarter',
      start: startOfPreviousQuarter.toISOString(),
      end: endOfPreviousQuarter.toISOString()
    }
  ];

  // Utiliser Promise.all pour exécuter les requêtes en parallèle
  const [currentQuarterStats, previousQuarterStats] = await Promise.all([
    fetchStatsForPeriod(supabase, periods[0].start, periods[0].end),
    fetchStatsForPeriod(supabase, periods[1].start, periods[1].end)
  ]);

  // Vérifier les erreurs
  if (!currentQuarterStats && !previousQuarterStats) {
    return {
      currentQuarter: null,
      previousQuarter: null,
      error: 'Erreur lors de la récupération des données'
    };
  }

  return {
    currentQuarter: currentQuarterStats,
    previousQuarter: previousQuarterStats,
    error: null
  };
}
