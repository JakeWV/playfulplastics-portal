import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/items - List items (staff: all, consignor: own)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any)?.role;
  const userId = (session.user as any)?.id;

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const consignorId = searchParams.get("consignorId");

  const where: any = {};
  if (status) where.status = status;
  if (consignorId) where.consignorId = consignorId;

  // Consignors only see their own items
  if (userRole === "CONSIGNOR") {
    where.consignorId = userId;
  }

  const items = await prisma.consignmentItem.findMany({
    where,
    include: {
      consignor: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

// POST /api/items - Create new item (staff only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any)?.role;
  if (userRole === "CONSIGNOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    consignorId,
    title,
    description,
    condition,
    defectNotes,
    photos,
    askingPrice,
    minimumPrice,
    holdDays,
  } = body;

  // Calculate hold deadline
  const holdDeadline = new Date();
  holdDeadline.setDate(holdDeadline.getDate() + (holdDays || 60));

  const item = await prisma.consignmentItem.create({
    data: {
      consignorId,
      title,
      description,
      condition,
      defectNotes,
      photos: photos || [],
      askingPrice,
      minimumPrice,
      holdDeadline,
    },
  });

  // Update consignor's active item count
  await prisma.consignor.update({
    where: { id: consignorId },
    data: { activeItemsCount: { increment: 1 } },
  });

  return NextResponse.json(item, { status: 201 });
}
