'use client';
import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraph } from '@/components/charts/pie-graph';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from '@/components/recent-sales';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useOrdersStatsPerMonth from '@/hooks/data/stats/useStatsPerMonth';
import * as React from 'react';
import Loading from './loading';

export default function Page() {
  const { data, isLoading } = useOrdersStatsPerMonth();
  const {
    sumThisMonth,
    sumLastMonth,
    avgThisMonth,
    avgLastMonth,
    countUsersThisMonth,
    countUsersLastMonth,
    countOrdersThisMonth,
    countOrdersLastMonth
  } = data?.data ?? {
    sumThisMonth: 0,
    sumLastMonth: 0,
    avgThisMonth: 0,
    avgLastMonth: 0,
    countUsersThisMonth: 0,
    countUsersLastMonth: 0,
    countOrdersThisMonth: 0,
    countOrdersLastMonth: 0
  };

  const calculateGrowth = (current: number, previous: number): string => {
    if (previous === 0) return '100%';
    const growth = ((current - previous) / previous) * 100;
    return growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(2)}%`;
  };

  const statCards = [
    {
      title: 'Revenu Total',
      value: sumThisMonth.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }),
      growth: calculateGrowth(sumThisMonth, sumLastMonth),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    {
      title: 'Total Clients',
      value: countUsersThisMonth.toLocaleString('fr-FR'),
      growth: calculateGrowth(countUsersThisMonth, countUsersLastMonth),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      title: 'Total Commandes',
      value: countOrdersThisMonth.toLocaleString('fr-FR'),
      growth: calculateGrowth(countOrdersThisMonth, countOrdersLastMonth),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      )
    },
    {
      title: 'Revenu par Commande',
      value: avgThisMonth.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }),
      growth: calculateGrowth(avgThisMonth, avgLastMonth),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    }
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Bonjour, bienvenue de retour 👋
          </h2>
          {/* <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button className="bg-color1 text-white">Télécharger</Button>
          </div> */}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-bgcolor1">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytique
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {stat.growth} par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4 h-full">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Ventes Récentes</CardTitle>
                  <CardDescription>
                    Vous avez réalisé{' '}
                    {countOrdersThisMonth.toLocaleString('fr-FR')} ventes ce
                    mois-ci.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
