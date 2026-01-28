import { connectDB } from "@/lib/db";
import Paste from "@/lib/paste";
import { NextResponse } from "next/server";

const DEFAULT_TTL_SECONDS = 120;
const DEFAULT_MAX_VIEWS = 2;

export async function POST(req) {
  try {
    const { content, ttl_seconds, max_views } = await req.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    if (ttl_seconds !== undefined &&
        (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json({ error: "Invalid ttl_seconds" }, { status: 400 });
    }

    if (max_views !== undefined &&
        (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json({ error: "Invalid max_views" }, { status: 400 });
    }

    await connectDB();

    const expiresAt = ttl_seconds
      ? new Date(Date.now() + ttl_seconds * 1000)
      : new Date(Date.now() + DEFAULT_TTL_SECONDS * 1000);

    const paste = await Paste.create({
      content,
      expiresAt,
      maxViews: max_views ?? DEFAULT_MAX_VIEWS,
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || req.headers.get("origin");

    return NextResponse.json({
      id: paste._id.toString(),
      url: `${baseUrl}/p/${paste._id}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
