"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { loginUser, ROLE_HOME } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  // ✅ Hook dipanggil di top-level komponen, BUKAN di dalam handleSubmit/try.
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await loginUser({ email, password });

      // ⚠️ Sementara: memetakan AuthUser (response loginUser) ke bentuk
      // CurrentUser yang dipakai AuthContext/Navbar. AuthUser sepertinya
      // tidak punya `full_name`, jadi saya fallback ke field lain yang
      // mungkin ada. Kirim isi lib/auth.ts (interface AuthUser) supaya
      // saya bisa ganti ini dengan mapping yang benar & type-safe.
      //
      // `role` di AuthUser bertipe opsional (UserRole | undefined), sedangkan
      // CurrentUser.role wajib ada — jadi login() cuma dipanggil kalau role
      // benar-benar ada. Kalau tidak, biarkan saja (jangan paksa isi nilai
      // asal); redirect di bawah tetap jalan lewat fallback "/".
      if (user && user.role) {
        login({
          id: String(user.id),
          email: user.email,
          role: user.role,
          full_name:
            (user as { name?: string; full_name?: string }).name ??
            (user as { name?: string; full_name?: string }).full_name ??
            user.email,
        });
      }

      const destination = user?.role ? ROLE_HOME[user.role] : "/";
      router.push(destination);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Login gagal. Periksa email dan kata sandi Anda.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ── Top navbar ── */}
      <SiteHeader />

      {/* ── Card ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-xl">
          {/* ── Left panel ── */}
          <LeftPanel
            title="Masa Depan Karbon Biru Dimulai Dari Sini."
            body="Masuk kembali ke dasbor Anda untuk melacak dampak ESG atau mengelola inventaris kredit karbon Anda."
          />

          {/* ── Right panel ── */}
          <div className="flex-1 bg-white px-10 py-12 flex flex-col justify-center">
            <h1 className="text-h3 font-bold text-text-primary mb-1">
              Selamat Datang Kembali
            </h1>
            <p className="text-c-l text-text-secondary mb-8">
              Silakan masuk ke akun Anda untuk melanjutkan.
            </p>

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-c-l text-red-700">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <FormField label="Email">
                <InputIcon icon={<Mail className="size-4 text-text-secondary" />}>
                  <input
                    type="email"
                    placeholder="email@perusahaan.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputCls}
                  />
                </InputIcon>
              </FormField>

              {/* Password */}
              <FormField label="Kata Sandi">
                <InputIcon icon={<Lock className="size-4 text-text-secondary" />}>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={inputCls}
                  />
                </InputIcon>
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-primary py-3.5 text-c-l font-bold text-white shadow-md hover:opacity-90 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>Masuk →</>
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-border pt-6 text-center">
              <p className="text-c-l text-text-secondary">
                Belum memiliki akun?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-primary hover:underline"
                >
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SiteHeader() {
  return (
    <header className="w-full bg-white border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Logo />
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt="CarbonTide logo"
        className="h-9 w-auto"
      />
    </Link>
  );
}

function LeftPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="hidden md:flex flex-1 shrink-0 flex-col justify-between bg-tertiary p-10 text-white">
      {/* Top icon mark */}
      <DropIcon />

      {/* Middle text */}
      <div className="flex flex-col gap-4">
        <h2 className="text-h3 font-bold leading-snug">{title}</h2>
        <p className="text-c-l text-white/60 leading-relaxed">{body}</p>
      </div>

      {/* Bottom badge */}
      <div className="flex items-center gap-2 text-c-r text-white/50">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Transparan. Tervalidasi. Aman.
      </div>
    </div>
  );
}

function DropIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 20 20" fill="none">
      <path d="M6 14 C6 9, 10 6, 14 8" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 16 C9 12, 14 10, 16 13" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-c-r font-semibold text-text-secondary uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}

function InputIcon({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 focus-within:border-primary transition">
      {icon}
      {children}
    </div>
  );
}

const inputCls =
  "flex-1 bg-transparent text-c-l text-text-primary outline-none placeholder:text-text-secondary";