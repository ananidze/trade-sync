import { PropFirmAccount } from '@/lib/types';

interface AccountsTableProps {
  accounts: PropFirmAccount[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-zinc-100 text-zinc-800';
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Prop Firm Accounts
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Firm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Account
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Equity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Daily P&L
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Drawdown
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {account.firmName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                  {account.accountNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-zinc-900 dark:text-zinc-50">
                  {formatCurrency(account.balance)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-zinc-900 dark:text-zinc-50">
                  {formatCurrency(account.equity)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                    account.dailyPnL >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {formatCurrency(account.dailyPnL)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-zinc-900 dark:text-zinc-50">
                  {formatPercentage(account.drawdown, account.maxDrawdown)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      account.status
                    )}`}
                  >
                    {account.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
