"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full py-3 px-4 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 active:scale-[0.99] text-red-600 font-semibold text-xs transition-all text-center"
    >
      Keluar dari Akun
    </button>
  );
}
