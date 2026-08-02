"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api, getAccessToken, getRefreshToken, clearTokens } from "@/lib/api";

interface CurrentUser {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "seller" | "buyer";
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    let mounted = true;
    api
      .get<CurrentUser>("/api/accounts/me/")
      .then((data) => {
        if (mounted) setUser(data);
      })
      .catch(() => {
        // apiRequest sudah handle auto-refresh; kalau tetap gagal berarti
        // sesi memang sudah tidak valid.
        clearTokens();
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
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
  };

  const linkClass = "hover:underline transition-colors";

  return (
    <div className="absolute z-1 flex w-full">
      <nav className="bg-white grid grid-cols-[20%_80%] items-center w-full shadow-lg h-25">
        <Link href="/" className="ml-10">
          <Image
            src="/images/logo.png"
            width={250}
            height={225}
            alt="Logo CarbonTide"
            className="h-auto transition-all"
          />
        </Link>

        <div className="flex flex-row justify-end items-center gap-20 mr-10">
          {loading ? null : !user ? (
            <>
              <Link href="/login" className={linkClass}>
                Login
              </Link>
              <Link href="/register" className={linkClass}>
                Register
              </Link>
            </>
          ) : user.role === "seller" ? (
            <>
              <Link href="/dashboard-penjual" className={linkClass}>
                Dashboard Penjual
              </Link>
              <Link href="/create-project" className={linkClass}>
                Buat Proyek (MRV)
              </Link>
              <button onClick={handleLogout} className={linkClass}>
                Logout
              </button>
            </>
          ) : user.role === "buyer" ? (
            <>
              <Link href="/marketplace" className={linkClass}>
                marketplace
              </Link>
              <Link href="/portofolio" className={linkClass}>
                Portofolio
              </Link>
              <button onClick={handleLogout} className={linkClass}>
                Logout
              </button>
            </>
          ) : (
            // fallback untuk role admin / role lain
            <button onClick={handleLogout} className={linkClass}>
              Logout
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}