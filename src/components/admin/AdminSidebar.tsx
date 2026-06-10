"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Images,
  Users,
  Inbox,
  Star,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/art/new", label: "Add Art", icon: Plus, exact: true },
  { href: "/admin/art", label: "Listings", icon: Images, exact: false },
  { href: "/admin/buyers", label: "Buyers", icon: Users, exact: true },
  { href: "/admin/requests", label: "Requests", icon: Inbox, exact: true },
  { href: "/admin/reviews", label: "Reviews", icon: Star, exact: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return (
      pathname === href ||
      (pathname.startsWith(`${href}/`) && pathname !== "/admin/art/new")
    );
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const navList = (
    <nav className="flex-1 space-y-1 p-4">
      {links.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.href, link.exact);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-accent/10 font-medium text-accent-hover"
                : "text-muted hover:bg-background hover:text-foreground"
            }`}
          >
            <Icon size={17} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const logoutBtn = (
    <div className="border-t border-border p-4">
      <button
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-background hover:text-error"
      >
        <LogOut size={17} />
        Sign out
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <Image src="/images/logo.svg" alt="The Nerdy Arts" width={150} height={26} className="h-5 w-auto" />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-2 text-foreground hover:bg-background"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-foreground/40"
          />
          <div className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Image src="/images/logo.svg" alt="The Nerdy Arts" width={150} height={26} className="h-5 w-auto" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1.5 text-muted hover:bg-background hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
            {navList}
            {logoutBtn}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="border-b border-border px-6 py-5">
          <Image src="/images/logo.svg" alt="The Nerdy Arts" width={180} height={30} className="h-6 w-auto" />
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-accent">Admin</p>
        </div>
        {navList}
        {logoutBtn}
      </aside>
    </>
  );
}
