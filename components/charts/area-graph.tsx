'use client';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import useOrdersStatsByStatus from '@/hooks/data/stats/useBySatus';
import Loading from '@/app/dashboard/loading';

// const chartData = [
//   {
//     month: 'Janvier',
//     pending: 186,
//     processing: 80,
//     delivered: 150,
//     cancelled: 10
//   },
//   {
//     month: 'Février',
//     pending: 305,
//     processing: 200,
//     delivered: 250,
//     cancelled: 20
//   },
//   {
//     month: 'Mars',
//     pending: 237,
//     processing: 120,
//     delivered: 180,
//     cancelled: 15
//   },
//   {
//     month: 'Avril',
//     pending: 73,
//     processing: 190,
//     delivered: 220,
//     cancelled: 5
//   },
//   { month: 'Mai', pending: 209, processing: 130, delivered: 210, cancelled: 8 },
//   {
//     month: 'Juin',
//     pending: 214,
//     processing: 140,
//     delivered: 230,
//     cancelled: 12
//   }
// ];

const chartConfig = {
  pending: {
    label: 'En attente',
    color: 'hsl(var(--chart-4))'
  },
  processing: {
    label: 'En traitement',
    color: 'hsl(var(--chart-3))'
  },
  delivered: {
    label: 'Livré',
    color: 'hsl(var(--chart-2))'
  },
  cancelled: {
    label: 'Annulé',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  const { data: chartData, isLoading } = useOrdersStatsByStatus();

  if (isLoading || !chartData?.data) return <Loading />;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statut des Commandes au Fil du Temps</CardTitle>
        <CardDescription>
          Affichage du nombre de commandes par statut pour les derniers mois
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData?.data ?? []}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="pending"
              type="natural"
              fill={chartConfig.pending.color}
              fillOpacity={0.4}
              stroke={chartConfig.pending.color}
              stackId="a"
            />
            <Area
              dataKey="processing"
              type="natural"
              fill={chartConfig.processing.color}
              fillOpacity={0.4}
              stroke={chartConfig.processing.color}
              stackId="a"
            />
            <Area
              dataKey="delivered"
              type="natural"
              fill={chartConfig.delivered.color}
              fillOpacity={0.4}
              stroke={chartConfig.delivered.color}
              stackId="a"
            />
            <Area
              dataKey="cancelled"
              type="natural"
              fill={chartConfig.cancelled.color}
              fillOpacity={0.4}
              stroke={chartConfig.cancelled.color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {/* <div className="flex items-center gap-2 font-medium leading-none">
              En hausse de 5,2% ce mois-ci <TrendingUp className="h-4 w-4" />
            </div> */}
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {chartData?.data?.[0].month} -{' '}
              {chartData?.data?.[chartData.data.length - 1].month}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
