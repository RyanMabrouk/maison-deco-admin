'use client';

import * as React from 'react';
import { Label, Pie, PieChart, Tooltip, Cell } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import useStatsParCategory from '@/hooks/data/stats/usePerCategory';
import Loading from '@/app/dashboard/loading';

// Palette of colors for the pie chart
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

interface CategoryStats {
  category_slug: string;
  sum: number;
  count: number;
}

export function PieGraph() {
  const { data, isLoading } = useStatsParCategory();
  const chartData = data?.currentQuarter;
  const previousChartData = data?.previousQuarter;
  // Calculate total earnings
  const totalEarnings = React.useMemo(() => {
    return chartData?.reduce((acc, curr) => acc + curr.sum, 0) ?? 0;
  }, [chartData]);

  // Prepare data for the pie chart
  const pieData = React.useMemo(() => {
    if (!chartData) return [];

    return chartData.map((category: CategoryStats) => ({
      name: category.category_slug,
      value: category.sum
    }));
  }, [chartData]);

  // Dynamic chart configuration based on categories
  const dynamicChartConfig = React.useMemo(() => {
    return pieData.map((entry, index) => ({
      name: entry.name,
      value: entry.value,
      fill: COLORS[index % COLORS.length]
    }));
  }, [pieData]);

  const formatDateRange = () => {
    const now = new Date();

    // Fonction pour déterminer le trimestre d'une date
    const getQuarter = (date: Date): number => {
      return Math.floor((date.getMonth() + 3) / 3);
    };

    const currentQuarter = getQuarter(now);
    let targetQuarter = currentQuarter;
    let targetYear = now.getFullYear();

    const startDate = new Date(targetYear, (targetQuarter - 1) * 3, 1);
    const endDate = new Date(targetYear, targetQuarter * 3, 1);

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };
    const startStr = startDate.toLocaleDateString('fr-FR', options);
    const endStr = endDate.toLocaleDateString('fr-FR', options);
    return `${startStr} - ${endStr}`;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!chartData) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Erreur du graphique</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Impossible de charger les données du graphique.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition des Revenus par Catégorie</CardTitle>
        <CardDescription>{formatDateRange()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[360px]"
          config={{}}
        >
          <PieChart>
            <Tooltip content={<ChartTooltipContent />} />
            <Pie
              data={dynamicChartConfig}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {dynamicChartConfig.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                position="center"
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground  text-lg font-bold"
                        >
                          {totalEarnings.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Revenus
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Affichage des revenus totaux pour les 3 derniers mois
        </div>
      </CardFooter>
    </Card>
  );
}
