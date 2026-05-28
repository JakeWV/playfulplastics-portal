"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ConsignorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    const role = (session.user as any)?.role;
    if (role === "ADMIN" || role === "STAFF") {
      router.replace("/staff/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Playful Plastics Portal</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Consignment</h2>

        {/* Status summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatusCard label="Listed" count="-" />
          <StatusCard label="Pending Sale" count="-" />
          <StatusCard label="Sold" count="-" />
          <StatusCard label="Total Items" count="-" />
        </div>

        {/* Payment info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
          <p className="text-gray-500 text-sm">Payment info not yet configured.</p>
        </div>

        {/* Items list */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">My Items</h3>
          <p className="text-gray-500 text-sm">No items yet.</p>
        </div>
      </main>
    </div>
  );
}

function StatusCard({ label, count }: { label: string; count: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <p className="text-3xl font-bold text-gray-900">{count}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
