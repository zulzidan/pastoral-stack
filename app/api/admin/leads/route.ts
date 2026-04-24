import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { timingSafeEqual } from "crypto"

export const runtime = "nodejs"

function isAuthorised(req: NextRequest): boolean {
  const expected = process.env.ADMIN_SECRET
  if (!expected) {
    return false
  }

  const provided =
    req.headers.get("x-admin-secret") ??
    req.nextUrl.searchParams.get("secret") ??
    ""

  // Use timing-safe comparison to avoid timing attacks
  try {
    return (
      provided.length === expected.length &&
      timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
    )
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1))
  const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get("limit") ?? 50)))
  const offset = (page - 1) * limit

  const rows = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ page, limit, count: rows.length, leads: rows })
}
