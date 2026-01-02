import { DashboardStats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
}

function StatsCard({ title, value, change, positive }: StatsCardProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-3">
          <p className="text-3xl font-bold tracking-tight">
            {value}
          </p>
          {change && (
            <span
              className={`text-base font-semibold flex items-center ${
                positive
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {positive ? '↑' : '↓'} {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        title="Total Balance"
        value={formatCurrency(stats.totalBalance)}
      />
      <StatsCard
        title="Total Equity"
        value={formatCurrency(stats.totalEquity)}
      />
      <StatsCard
        title="Total P&L"
        value={formatCurrency(stats.totalPnL)}
        change={stats.totalPnL >= 0 ? '+' : ''}
        positive={stats.totalPnL >= 0}
      />
      <StatsCard
        title="Daily P&L"
        value={formatCurrency(stats.dailyPnL)}
        change={stats.dailyPnL >= 0 ? '+' : ''}
        positive={stats.dailyPnL >= 0}
      />
      <StatsCard
        title="Active Accounts"
        value={stats.activeAccounts.toString()}
      />
      <StatsCard title="Open Trades" value={stats.openTrades.toString()} />
    </div>
  );
}
