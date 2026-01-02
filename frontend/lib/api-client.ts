import {
  PropFirmAccount,
  Trade,
  DashboardStats,
  LoginResponse,
  TwoFASetupResponse,
} from './types';
import { authStorage } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(token?: string) {
    const authToken = token || authStorage.getToken();
    return authToken
      ? {
          Authorization: `Bearer ${authToken}`,
        }
      : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T | null> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(token),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const error = new Error(`API Error: ${response.statusText}`) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }
    return response.json() as Promise<T>;
  }

  async getAccounts(): Promise<PropFirmAccount[]> {
    const res = await this.request<PropFirmAccount[]>('/accounts');
    return res ?? [];
  }

  async getTrades(): Promise<Trade[]> {
    const res = await this.request<Trade[]>('/trades');
    return res ?? [];
  }

  async getStats(): Promise<DashboardStats> {
    const res = await this.request<DashboardStats>('/stats');
    if (!res) {
      throw new Error('No stats available');
    }
    return res;
  }

  async register(email: string, password: string) {
    const res = await this.request<{ message: string }>('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!res) throw new Error('Registration failed');
    return res;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!res) throw new Error('Login failed');
    return res;
  }

  async enableTwoFA(): Promise<TwoFASetupResponse> {
    const res = await this.request<TwoFASetupResponse>('/2fa/enable', { method: 'POST' });
    if (!res) throw new Error('Failed to start 2FA');
    return res;
  }

  async verifyTwoFA(code: string, token?: string): Promise<{ token: string }> {
    const res = await this.request<{ token: string }>('/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }, token);
    if (!res) throw new Error('Verification failed');
    return res;
  }
}

export const apiClient = new ApiClient();
