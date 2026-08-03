"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, getAccessToken, getRefreshToken, clearTokens } from "@/lib/api";

export interface CurrentUser {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "seller" | "buyer";
}

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  /** Panggil ini langsung setelah loginUser()/registerUser() sukses. */
  login: (user: CurrentUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Batas waktu tunggu request "/me/" — supaya kalau backend baru start /
// lambat / connection nyangkut, navbar tidak "menggantung" selamanya dan
// tetap jatuh ke tampilan "belum login".
const ME_TIMEOUT_MS = 8000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ME_TIMEOUT_MS)
    );

    try {
      const data = await Promise.race([
        api.get<CurrentUser>("/api/accounts/me/"),
        timeout,
      ]);
      setUser(data);
    } catch {
      // Token invalid, refresh gagal, atau request timeout/hang →
      // anggap saja belum login, jangan biarkan navbar nyangkut di loading.
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback((newUser: CurrentUser) => {
    // Dipanggil dari halaman login/register setelah request sukses.
    // Update state di sini langsung, tanpa fetch ulang / tanpa refresh halaman.
    setUser(newUser);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      const refresh = getRefreshToken();
      if (refresh) {
        await api.post("/api/accounts/logout/", { refresh });
      }
    } catch {
      // tetap lanjut clear token walau request logout gagal
    } finally {
      clearTokens();
      setUser(null);
      window.location.href = "/";
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}