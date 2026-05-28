import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/consignors - List all consignors (staff/admin only)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any)?.role;
  if (userRole === "CONSIGNOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search");

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const consignors = await prisma.consignor.findMany({
    where,
    include: {
      _count: { select: { items: true } },
      items: {
        select: { status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Enrich with item counts by status
  const enriched = consignors.map((c) => {
    const items = c.items || [];
    return {
      ...c,
      items: undefined,
      itemCount: items.length,
      activeItemCount: items.filter((i: any) => ["intake", "listed", "pending_sale"].includes(i.status)).length,
      soldItemCount: items.filter((i: any) => ["sold", "paid_out"].includes(i.status)).length,
    };
  });

  return NextResponse.json(enriched);
}

// POST /api/consignors - Create new consignor (staff/admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any)?.role;
  if (userRole === "CONSIGNOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    name,
    email,
    phone,
    address,
    paymentMethod,
    paymentHandle,
    defaultCommissionPct,
    holdDays,
    notes,
  } = body;

  // Create consignor
  const consignor = await prisma.consignor.create({
    data: {
      name,
      email,
      phone,
      address,
      paymentMethod: paymentMethod || "VENMO",
      paymentHandle,
      defaultCommissionPct: defaultCommissionPct || 60,
      holdDays: holdDays || 60,
      notes,
    },
  });

  return NextResponse.json(consignor, { status: 201 });
}
