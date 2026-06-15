import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const cookieStore = await cookies();
  // const userRaw = cookieStore.get("user")?.value;
  // const user = userRaw ? JSON.parse(decodeURIComponent(userRaw)) : null;

  // if (!user || user.role !== "delivery") redirect("/login");

  return <>{children}</>;
}
