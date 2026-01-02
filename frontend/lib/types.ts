export interface PropFirmAccount {
  id: string;
  firmName: string;
  accountNumber: string;
  balance: number;
  equity: number;
  dailyPnL: number;
  totalPnL: number;
  drawdown: number;
  maxDrawdown: number;
  status: 'active' | 'inactive' | 'suspended';
  lastUpdated: string;
}

export interface Trade {
  id: string;
  accountId: string;
  symbol: string;
  type: 'buy' | 'sell';
  openTime: string;
  closeTime?: string;
  openPrice: number;
  closePrice?: number;
  lotSize: number;
  pnl?: number;
  status: 'open' | 'closed';
}

export interface DashboardStats {
  totalBalance: number;
  totalEquity: number;
  totalPnL: number;
  dailyPnL: number;
  activeAccounts: number;
  openTrades: number;
}
