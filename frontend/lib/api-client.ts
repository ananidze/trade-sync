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
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(token),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    if (response.status === 204) {
      // @ts-expect-error allow void responses
      return null;
    }
    return response.json() as Promise<T>;
  }

  async getAccounts(): Promise<PropFirmAccount[]> {
    return this.request<PropFirmAccount[]>('/accounts');
  }

  async getTrades(): Promise<Trade[]> {
    return this.request<Trade[]>('/trades');
  }

  async getStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/stats');
  }

  async register(email: string, password: string) {
    return this.request<{ message: string }>('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async enableTwoFA(): Promise<TwoFASetupResponse> {
    return this.request<TwoFASetupResponse>('/2fa/enable', { method: 'POST' });
  }

  async verifyTwoFA(code: string, token?: string): Promise<{ token: string }> {
    return this.request<{ token: string }>('/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }, token);
  }
}

export const apiClient = new ApiClient();
