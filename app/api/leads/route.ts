import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"

export const runtime = "nodejs"

function isConnectionError(err: unknown) {
  if (!(err instanceof Error)) {
    return false
  }

  const causeMessage =
    err.cause && typeof err.cause === "object" && "message" in err.cause
      ? String((err.cause as { message?: unknown }).message ?? "")
      : ""

  const text = `${err.message} ${causeMessage}`
  return /fetch failed|error connecting to database|enotfound|econnrefused|timeout/i.test(text)
}

function getErrorDetails(err: unknown) {
  if (!(err instanceof Error)) {
    return "Unknown error"
  }

  const causeMessage =
    err.cause && typeof err.cause === "object" && "message" in err.cause
      ? String((err.cause as { message?: unknown }).message ?? "")
      : ""

  return [err.message, causeMessage].filter(Boolean).join(" | ") || err.name
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { name, email, organisation, state, message } = body as Record<string, string>

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 422 })
  }

  // Basic email format check (server-side boundary validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 422 })
  }

  try {
    const [lead] = await db
      .insert(leads)
      .values({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        organisation: organisation?.trim() || null,
        state: state?.trim() || null,
        message: message?.trim() || null,
      })
      .returning({ id: leads.id })

    return NextResponse.json({ id: lead.id }, { status: 201 })
  } catch (err) {
    const cause = err instanceof Error && err.cause instanceof Error ? err.cause : null
    console.error("[leads] insert error", err instanceof Error ? err.message : err)
    if (cause) console.error("[leads] insert cause", cause.message, (cause as NodeJS.ErrnoException).code)

    if (isConnectionError(err)) {
      return NextResponse.json(
        { error: "Database temporarily unavailable. Please try again in a moment." },
        { status: 503 }
      )
    }

    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { error: "Something went wrong", details: getErrorDetails(err) },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
