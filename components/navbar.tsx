"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useAuth, type CurrentUser } from "@/context/AuthContext";

// NOTE: label role di bawah ini cuma dikonfirmasi dari gambar untuk role
// "buyer" ("PERUSAHAAN ESG"). Untuk "seller" & "admin" saya ASUMSIKAN
// labelnya — sesuaikan teksnya kalau berbeda.
const ROLE_LABEL: Record<CurrentUser["role"], string> = {
  buyer: "PERUSAHAAN ESG",
  seller: "PERUSAHAAN PENJUAL",
  admin: "ADMINISTRATOR",
};

const NAV_LINKS: Record<CurrentUser["role"], { href: string; label: string }[]> = {
  buyer: [
    { href: "/marketplace", label: "Beli Kredit" },
    { href: "/portofolio", label: "Portofolio (ESG)" },
  ],
  seller: [
    { href: "/dashboard-penjual", label: "Dashboard Penjual" },
    { href: "/create-project", label: "Buat Proyek (MRV)" },
  ],
  admin: [],
};

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass =
    "text-c-l font-medium text-text-primary hover:text-primary transition-colors";

  // Tutup mobile menu tiap kali route/user berubah (mis. setelah login/logout)
  useEffect(() => {
    setMobileOpen(false);
  }, [user]);

  // Kunci scroll body saat mobile menu terbuka
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="fixed top-0 left-0 z-50 flex w-full">
      <nav className="bg-white flex items-center justify-between w-full shadow-sm border-b border-border h-20 lg:h-24 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
          <Image
            src="/images/logo.png"
            width={250}
            height={225}
            alt="Logo CarbonTide"
            className="h-7 sm:h-8 lg:h-9 w-auto"
          />
        </Link>

        {/* ── Desktop / tablet-lebar (lg ke atas) ─────────────────────── */}
        <div className="hidden lg:flex items-center">
          {loading ? null : !user ? (
            <GuestMenu linkClass={linkClass} />
          ) : (
            <UserMenu user={user} linkClass={linkClass} onLogout={logout} />
          )}
        </div>

        {/* ── Tombol hamburger (di bawah lg) ──────────────────────────── */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden flex items-center justify-center size-10 rounded-full text-text-primary hover:bg-gray-100 transition"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* ── Overlay ──────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 top-20 bg-black/30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Panel menu mobile / tablet ───────────────────────────────── */}
      <div
        className={`lg:hidden fixed left-0 top-20 z-50 w-full bg-white border-b border-border shadow-lg overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          mobileOpen ? "max-h-[calc(100vh-5rem)]" : "max-h-0"
        }`}
      >
        <div className="px-5 py-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {loading ? null : !user ? (
            <GuestMenuMobile onNavigate={() => setMobileOpen(false)} />
          ) : (
            <UserMenuMobile
              user={user}
              onNavigate={() => setMobileOpen(false)}
              onLogout={() => {
                setMobileOpen(false);
                logout();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Guest (belum login) — Desktop ─────────────────────────────────────────

function GuestMenu({ linkClass }: { linkClass: string }) {
  return (
    <div className="flex items-center gap-8">
      <Link href="/marketplace" className={linkClass}>
        Jelajahi Proyek
      </Link>

      <div className="h-6 w-px bg-border" />

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-full bg-gray-100 px-6 py-2.5 text-c-l font-bold text-text-primary hover:bg-gray-200 transition"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-primary px-6 py-2.5 text-c-l font-bold text-white shadow-md hover:opacity-90 transition"
        >
          Daftar
        </Link>
      </div>
    </div>
  );
}

// ─── Guest (belum login) — Mobile / Tablet ─────────────────────────────────

function GuestMenuMobile({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/marketplace"
        onClick={onNavigate}
        className="text-c-l font-medium text-text-primary py-2"
      >
        Jelajahi Proyek
      </Link>

      <div className="h-px w-full bg-border" />

      <div className="flex flex-col gap-3 pt-1">
        <Link
          href="/login"
          onClick={onNavigate}
          className="rounded-full bg-gray-100 px-6 py-3 text-center text-c-l font-bold text-text-primary hover:bg-gray-200 transition"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          onClick={onNavigate}
          className="rounded-full bg-primary px-6 py-3 text-center text-c-l font-bold text-white shadow-md hover:opacity-90 transition"
        >
          Daftar
        </Link>
      </div>
    </div>
  );
}

// ─── Sudah login — Desktop ──────────────────────────────────────────────────

function UserMenu({
  user,
  linkClass,
  onLogout,
}: {
  user: CurrentUser;
  linkClass: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const links = NAV_LINKS[user.role] ?? [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-8">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={linkClass}>
          {link.label}
        </Link>
      ))}

      <div className="h-6 w-px bg-border" />

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3"
        >
          <div className="text-right leading-tight">
            <p className="text-c-l font-bold text-text-primary">
              {user.full_name}
            </p>
            <p className="text-c-r font-semibold text-primary/70 tracking-wide">
              {ROLE_LABEL[user.role]}
            </p>
          </div>

          <div className="flex items-center justify-center size-11 shrink-0 rounded-full bg-blue-50 border-2 border-blue-200 text-primary font-bold text-lg">
            {user.full_name?.[0]?.toUpperCase() ?? "?"}
          </div>

          <ChevronDown
            className={`size-4 text-text-secondary transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-border bg-white shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-c-l font-semibold text-text-primary truncate">
                {user.full_name}
              </p>
              <p className="text-c-r text-text-secondary truncate">
                {user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-3 text-c-l font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sudah login — Mobile / Tablet ──────────────────────────────────────────

function UserMenuMobile({
  user,
  onNavigate,
  onLogout,
}: {
  user: CurrentUser;
  onNavigate: () => void;
  onLogout: () => void;
}) {
  const links = NAV_LINKS[user.role] ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Info user */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="flex items-center justify-center size-11 shrink-0 rounded-full bg-blue-50 border-2 border-blue-200 text-primary font-bold text-lg">
          {user.full_name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-c-l font-bold text-text-primary truncate">
            {user.full_name}
          </p>
          <p className="text-c-r font-semibold text-primary/70 tracking-wide">
            {ROLE_LABEL[user.role]}
          </p>
          <p className="text-c-r text-text-secondary truncate">{user.email}</p>
        </div>
      </div>

      {/* Navigasi role */}
      {links.length > 0 && (
        <div className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="text-c-l font-medium text-text-primary py-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <div className="h-px w-full bg-border" />

      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center gap-2 py-2 text-c-l font-medium text-red-600"
      >
        <LogOut className="size-4" />
        Logout
      </button>
    </div>
  );
}