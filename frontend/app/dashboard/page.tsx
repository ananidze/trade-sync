'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { PropFirmAccount, DashboardStats } from '@/lib/types';
import { DashboardStatsCards } from '@/components/DashboardStats';
import { AccountsTable } from '@/components/AccountsTable';

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<PropFirmAccount[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [accountsData, statsData] = await Promise.all([
          apiClient.getAccounts(),
          apiClient.getStats(),
        ]);
        setAccounts(accountsData);
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg
              className="inline-block h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Trading Dashboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Monitor your prop firm accounts in one place
          </p>
        </div>

        {stats && (
          <div className="mb-8">
            <DashboardStatsCards stats={stats} />
          </div>
        )}

        {accounts.length > 0 && (
          <div>
            <AccountsTable accounts={accounts} />
          </div>
        )}
      </div>
    </div>
  );
}
