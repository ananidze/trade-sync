import { DashboardStats } from '@/lib/types';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
}

function StatsCard({ title, value, change, positive }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
        {title}
      </h3>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {value}
        </p>
        {change && (
          <span
            className={`text-sm font-medium ${
              positive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
