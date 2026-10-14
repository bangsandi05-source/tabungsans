import { auth } from "@/lib/auth";
import SignOutButton from "./sign-out-button";


export default async function ProfilePage() {
  const session = await auth();

  return (
    <main className="max-w-md mx-auto w-full px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Profil</h1>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3 mb-6">
        <div>
          <p className="text-xs text-zinc-400">Nama</p>
          <p className="font-medium">{session!.user!.name}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400">Email</p>
          <p className="font-medium">{session!.user!.email}</p>
        </div>
      </div>

      <SignOutButton />
    </main>
  );
}
