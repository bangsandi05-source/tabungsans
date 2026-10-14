import { auth } from "@/lib/auth";
import SignOutButton from "./sign-out-button";
import ChangePasswordForm from "./change-password-form";

export default async function ProfilePage() {
  const session = await auth();

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "P";

  return (
    <main className="px-5 pt-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Profil Akun
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Informasi rekening penabung Anda
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 text-xl font-bold flex items-center justify-center border border-emerald-200 shadow-sm">
            {userInitial}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {session?.user?.name}
            </h2>
            <p className="text-xs text-slate-400">{session?.user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Penabung Terdaftar
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Status Akun</span>
            <span className="font-semibold text-emerald-600">Aktif (Simulasi)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Pendaftaran</span>
            <span className="font-medium text-slate-700">Diverifikasi Admin</span>
          </div>
        </div>
      </div>

      {/* Bagian Keamanan Kata Sandi */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <ChangePasswordForm />
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <SignOutButton />
      </div>
    </main>
  );
}
