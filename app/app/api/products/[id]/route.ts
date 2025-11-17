// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // dùng singleton

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = 12;

  const where: any = { isActive: true };

  const category = searchParams.get("category");
  if (category && category !== "all") where.category = category;

  const search = searchParams.get("search");
  if (search) where.name = { contains: search, mode: "insensitive" };

  const [totalCount, data] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { offers: { take: 1, orderBy: { id: "asc" } } }, // kèm 1 offer
    }),
  ]);

  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  });
}
