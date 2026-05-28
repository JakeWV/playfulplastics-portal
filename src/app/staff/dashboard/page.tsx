"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StaffDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    const role = (session.user as any)?.role;
    if (role === "CONSIGNOR") {
      router.replace("/consignor/dashboard");
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Staff: {session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Staff Dashboard</h2>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Active Items" value="--" />
          <StatCard label="Pending Listing" value="--" />
          <StatCard label="Total Consignors" value="--" />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ActionCard
            title="New Intake"
            description="Add new consignment items"
            href="/staff/intake"
          />
          <ActionCard
            title="All Consignors"
            description="Manage consignor accounts"
            href="/staff/consignors"
          />
          <ActionCard
            title="All Items"
            description="View and edit all items"
            href="/staff/items"
          />
          <ActionCard
            title="Payouts"
            description="Process consignor payouts"
            href="/staff/payouts"
          />
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg Font-medium text-gray-900 mb-4">Recent Activity</h3>
          <p className="text-gray-500 text-sm">No recent activity to show.</p>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  const router = useRouter();
  return (
    <div
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition cursor-pointer"
      onClick={() => router.push(href)}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
