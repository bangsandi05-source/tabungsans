"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/targets", label: "Target", icon: "🎯" },
  { href: "/history", label: "Riwayat", icon: "📋" },
  { href: "/profile", label: "Profil", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <ul className="flex justify-around max-w-lg mx-auto">
        {nav.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center py-2 px-3 text-xs transition-colors ${
                  active
                    ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                <span className="text-lg mb-0.5">{icon}</span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
