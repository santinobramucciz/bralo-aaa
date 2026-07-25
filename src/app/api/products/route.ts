import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "active";
  const featured = searchParams.get("featured") || "";
  const sort = searchParams.get("sort") || "createdAt";

  const where: any = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (featured === "true") where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { tags: { contains: search } },
    ];
  }

  const orderBy: any = {};
  if (sort === "price_asc") orderBy.priceEUR = "asc";
  else if (sort === "price_desc") orderBy.priceEUR = "desc";
  else if (sort === "popular") orderBy.salesCount = "desc";
  else if (sort === "rating") orderBy.rating = "desc";
  else orderBy.createdAt = "desc";

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = slugify(body.name);
    const product = await prisma.product.create({
      data: {
        ...body,
        slug,
        images: JSON.stringify(body.images || []),
        tags: JSON.stringify(body.tags || []),
        variants: JSON.stringify(body.variants || []),
        metadata: JSON.stringify(body.metadata || {}),
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error creando producto" }, { status: 500 });
  }
}
