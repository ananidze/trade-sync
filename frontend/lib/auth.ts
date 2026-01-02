const TOKEN_KEY = "trade-sync-token";
const PENDING_TOKEN_KEY = "trade-sync-pending-token";

export const authStorage = {
  getToken: () =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },
  getPendingToken: () =>
    typeof window === "undefined"
      ? null
      : localStorage.getItem(PENDING_TOKEN_KEY),
  setPendingToken: (token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(PENDING_TOKEN_KEY, token);
  },
  clearPending: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(PENDING_TOKEN_KEY);
  },
  clearAll: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PENDING_TOKEN_KEY);
  },
};

