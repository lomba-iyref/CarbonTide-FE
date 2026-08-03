"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogOut, ChevronDown } from "lucide-react";
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

  const linkClass =
    "text-c-l font-medium text-text-primary hover:text-primary transition-colors";

  return (
    <div className="fixed top-0 left-0 z-50 flex w-full">
      <nav className="bg-white flex items-center justify-between w-full shadow-sm border-b border-border h-24 px-10">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.png"
            width={250}
            height={225}
            alt="Logo CarbonTide"
            className="h-9 w-auto"
          />
        </Link>

        {loading ? null : !user ? (
          <GuestMenu linkClass={linkClass} />
        ) : (
          <UserMenu user={user} linkClass={linkClass} onLogout={logout} />
        )}
      </nav>
    </div>
  );
}

// ─── Guest (belum login) ───────────────────────────────────────────────────

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

// ─── Sudah login ────────────────────────────────────────────────────────────

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