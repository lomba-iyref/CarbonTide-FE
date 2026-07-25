"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { loginUser, ROLE_HOME } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

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
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      {/* Card */}
      <div className="w-full max-w-3xl flex rounded-3xl overflow-hidden shadow-xl">
        {/* ── Left panel ── */}
        <LeftPanel
          title="Masa Depan Karbon Biru Dimulai Dari Sini."
          body="Masuk kembali ke dasbor Anda untuk melacak dampak ESG atau mengelola inventaris kredit karbon Anda."
        />

        {/* ── Right panel ── */}
        <div className="flex-1 bg-white px-10 py-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-8">
            <Logo />
          </div>

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

          <p className="mt-8 text-center text-c-l text-text-secondary">
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
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <Image
        src="/images/logo.png"
        width={130}
        height={117}
        alt="CarbonTide logo"
        className="h-auto"
      />
    </Link>
  );
}

function LeftPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="hidden md:flex w-72 shrink-0 flex-col justify-between bg-tertiary p-10 text-white">
      {/* Top logo mark */}
      <div className="flex size-10 items-center justify-center rounded-full border-2 border-white/30">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" />
          <path d="M6 14 C6 9, 10 6, 14 8" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 16 C9 12, 14 10, 16 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

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