import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import BottomNav from "./bottom-nav";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">{children}</div>
      <BottomNav />
    </div>
  );
}
