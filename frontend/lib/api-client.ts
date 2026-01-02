import { PropFirmAccount, Trade, DashboardStats } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getAccounts(): Promise<PropFirmAccount[]> {
    return this.fetch<PropFirmAccount[]>('/accounts');
  }

  async getTrades(): Promise<Trade[]> {
    return this.fetch<Trade[]>('/trades');
  }

  async getStats(): Promise<DashboardStats> {
    return this.fetch<DashboardStats>('/stats');
  }
}

export const apiClient = new ApiClient();
