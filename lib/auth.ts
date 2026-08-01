import { api, setTokens, clearTokens, getRefreshToken, ApiError } from "@/lib/api";

export type UserRole = "buyer" | "seller";

/**
 * ASUMSI bentuk data user dari UserSerializer.
 * Field selain `id` & `email` dibuat optional supaya tidak crash kalau
 * nama field aslinya sedikit berbeda — tapi tetap cek serializer asli
 * untuk memastikan `role` benar-benar dikirim backend.
 */
export interface AuthUser {
  id: number | string;
  email: string;
  username?: string;
  role?: UserRole;
  [key: string]: unknown;
}

interface TokenResponse {
  message?: string;
  access: string;
  refresh: string;
  user?: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/** Tujuan redirect setelah login/register berhasil, berdasarkan role. */
export const ROLE_HOME: Record<UserRole, string> = {
  buyer: "/dashboard-pembeli",
  seller: "/dashboard-penjual",
};

/**
 * ASUMSI field body untuk RegisterSerializer.
 * DRF ModelSerializer mengabaikan key yang tidak dikenali, jadi mengirim
 * beberapa kandidat nama field (mis. `full_name` & `name`) di sini aman —
 * tapi tetap sebaiknya disesuaikan 1:1 dengan serializer asli agar rapi.
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthUser> {
  const body = {
    full_name: payload.name,
    email: payload.email,
    password: payload.password,
    confirm_password: payload.password, // sesuaikan kalau form register punya field confirm password sendiri
    role: payload.role,
  };

  const data = await api.post<TokenResponse>("/api/accounts/register/", body, {
    auth: false,
  });

  if (!data?.access || !data?.refresh) {
    throw new ApiError("Registrasi gagal, respon server tidak lengkap.");
  }

  setTokens({ access: data.access, refresh: data.refresh });
  return data.user ?? { id: "", email: payload.email, role: payload.role };
}

/**
 * ASUMSI field body untuk CustomTokenObtainPairSerializer.
 * Kalau login sebenarnya butuh `username` bukan `email`, sesuaikan di sini.
 */
export async function loginUser(payload: LoginPayload): Promise<AuthUser | null> {
  const body = {
    email: payload.email,
    username: payload.email,
    password: payload.password,
  };

  const data = await api.post<TokenResponse>("/api/accounts/login/", body, {
    auth: false,
  });

  if (!data?.access || !data?.refresh) {
    throw new ApiError("Login gagal, respon server tidak lengkap.");
  }

  setTokens({ access: data.access, refresh: data.refresh });

  if (data.user) return data.user;

  // Fallback: response login tidak menyertakan data user, ambil dari /accounts/me/
  return fetchMe();
}

export async function fetchMe(): Promise<AuthUser | null> {
  return api.get<AuthUser>("/api/accounts/me/");
}

export async function logoutUser(): Promise<void> {
  const refresh = getRefreshToken();
  try {
    if (refresh) {
      await api.post("/api/accounts/logout/", { refresh });
    }
  } finally {
    clearTokens();
  }
}