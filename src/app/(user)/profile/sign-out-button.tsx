"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full rounded-lg border border-red-300 text-red-600 py-2.5 text-sm font-medium hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
    >
      Keluar
    </button>
  );
}
