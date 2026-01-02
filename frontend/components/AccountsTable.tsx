import { PropFirmAccount } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prop Firm Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Firm</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Equity</TableHead>
              <TableHead className="text-right">Daily P&L</TableHead>
              <TableHead className="text-right">Drawdown</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  {account.firmName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {account.accountNumber}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(account.balance)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(account.equity)}
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    account.dailyPnL >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {formatCurrency(account.dailyPnL)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPercentage(account.drawdown, account.maxDrawdown)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(account.status)}>
                    {account.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
