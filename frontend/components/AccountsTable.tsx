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
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Prop Firm Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Firm</TableHead>
              <TableHead className="font-semibold">Account</TableHead>
              <TableHead className="text-right font-semibold">Balance</TableHead>
              <TableHead className="text-right font-semibold">Equity</TableHead>
              <TableHead className="text-right font-semibold">Daily P&L</TableHead>
              <TableHead className="text-right font-semibold">Drawdown</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id} className="hover:bg-accent/50">
                <TableCell className="font-semibold">
                  {account.firmName}
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {account.accountNumber}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(account.balance)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(account.equity)}
                </TableCell>
                <TableCell
                  className={`text-right font-bold ${
                    account.dailyPnL >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {formatCurrency(account.dailyPnL)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPercentage(account.drawdown, account.maxDrawdown)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(account.status)} className="font-medium">
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
