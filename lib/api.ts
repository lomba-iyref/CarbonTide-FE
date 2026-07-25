export const API_BASE: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export interface TokenPair {
  access?: string | null;
  refresh?: string | null;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens({ access, refresh }: TokenPair): void {
  if (typeof window === "undefined") return;
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export interface ApiErrorOptions {
  status?: number;
  data?: unknown;
  url?: string;
}

export class ApiError extends Error {
  status?: number;
  data?: unknown;
  url?: string;

  constructor(message: string, { status, data, url }: ApiErrorOptions = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.url = url;
  }
}

const isDev = process.env.NODE_ENV !== "production";

function logRequest(method: string, url: string, options?: RequestInit): void {
  if (!isDev) return;
  console.groupCollapsed(`%c[API] ${method} ${url}`, "color:#08C7E1");
  if (options?.body) {
    try {
      console.log("body:", JSON.parse(options.body as string));
    } catch {
      console.log("body:", options.body);
    }
  }
  console.groupEnd();
}

function logResponse(
  method: string,
  url: string,
  status: number,
  data: unknown
): void {
  if (!isDev) return;
  const color = status >= 400 ? "#FF6B6B" : "#4ADE80";
  console.log(`%c[API] ${method} ${url} -> ${status}`, `color:${color}`, data);
}

function logError(method: string, url: string, err: unknown): void {
  console.error(`[API] ${method} ${url} failed:`, err);
}

type RefreshSubscriber = (token: string | null) => void;

let isRefreshing = false;
let refreshQueue: RefreshSubscriber[] = [];

function subscribeToRefresh(callback: RefreshSubscriber): void {
  refreshQueue.push(callback);
}

function onRefreshed(newAccessToken: string | null): void {
  refreshQueue.forEach((cb) => cb(newAccessToken));
  refreshQueue = [];
}

interface RefreshResponseData {
  access: string;
  refresh?: string;
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${API_BASE}/api/accounts/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    throw new ApiError("Sesi berakhir, silakan login kembali.", {
      status: res.status,
    });
  }

  const data: RefreshResponseData = await res.json();
  setTokens({ access: data.access, refresh: data.refresh });
  return data.access;
}

// Endpoint-endpoint auth yang TIDAK boleh memicu auto-refresh saat 401
// (kalau login/register sendiri gagal dengan 401, jangan coba refresh token).
const AUTH_ENDPOINTS_SKIP_REFRESH = [
  "/accounts/login",
  "/accounts/register",
  "/accounts/token/refresh",
];

function isAuthEndpoint(path: string): boolean {
  return AUTH_ENDPOINTS_SKIP_REFRESH.some((p) => path.includes(p));
}

export interface ApiRequestOptions extends Omit<RequestInit, "method" | "body" | "headers"> {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  credentials?: RequestCredentials;
}

interface FetchResult<T = unknown> {
  res: Response;
  data: T | null;
}

export async function apiRequest<T = unknown>(
  path: string,
  {
    method = "GET",
    body,
    headers = {},
    auth = true,
    credentials = "omit",
    ...rest
  }: ApiRequestOptions = {}
): Promise<T | null> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const buildHeaders = (): Record<string, string> => {
    const h: Record<string, string> = { "Content-Type": "application/json", ...headers };
    if (auth) {
      const token = getAccessToken();
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const doFetch = async (): Promise<FetchResult<T>> => {
    const options: RequestInit = {
      method,
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      credentials,
      ...rest,
    };

    logRequest(method, url, options);

    let res: Response;
    try {
      res = await fetch(url, options);
    } catch (networkErr) {
      logError(method, url, networkErr);
      throw new ApiError(
        "Tidak dapat terhubung ke server. Periksa koneksi atau server backend.",
        { status: 0, url }
      );
    }

    let data: T | null = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await res.json().catch(() => null);
    } else {
      data = (await res.text().catch(() => null)) as unknown as T | null;
    }

    logResponse(method, url, res.status, data);

    return { res, data };
  };

  let { res, data } = await doFetch();

  if (res.status === 401 && auth && !isAuthEndpoint(path)) {
    const hasRefreshToken = Boolean(getRefreshToken());

    if (!hasRefreshToken) {
      clearTokens();
      return null;
    } else if (isRefreshing) {
      const newToken = await new Promise<string | null>((resolve) =>
        subscribeToRefresh(resolve)
      );
      if (newToken) {
        ({ res, data } = await doFetch());
      }
    } else {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onRefreshed(newToken);
        if (newToken) {
          ({ res, data } = await doFetch());
        }
      } catch (refreshErr) {
        isRefreshing = false;
        onRefreshed(null);
        clearTokens();
        logError(method, url, refreshErr);
        throw new ApiError("Sesi berakhir, silakan login kembali.", {
          status: 401,
          url,
        });
      }
    }
  }

  if (!res.ok) {
    const errData = data as { detail?: string; message?: string; error?: string } | null;
    const message =
      (errData && (errData.detail || errData.message || errData.error)) ||
      `Request gagal dengan status ${res.status}`;
    throw new ApiError(message, { status: res.status, data, url });
  }

  return data;
}

export const api = {
  get: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  put: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PUT", body }),
  patch: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};