import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import BottomNav from "./bottom-nav";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as unknown as { role?: string })?.role;
  if (role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="flex-1 flex flex-col justify-between max-w-lg mx-auto w-full min-h-[calc(100vh-41px)] bg-slate-50 relative pb-20">
      <div className="flex-1 w-full">{children}</div>
      <BottomNav />
    </div>
  );
}
