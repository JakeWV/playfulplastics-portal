"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      const role = (session.user as any)?.role;
      if (role === "ADMIN" || role === "STAFF") {
        router.replace("/staff/dashboard");
      } else {
        router.replace("/consignor/dashboard");
      }
    } else {
      router.replace("/login");
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  );
}
