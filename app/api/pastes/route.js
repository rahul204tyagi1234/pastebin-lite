// Import database connection helper
import { connectDB } from "@/lib/db";
// Import Paste MongoDB model
import Paste from "@/lib/paste";
// Import Next.js response utility to send JSON responses
import { NextResponse } from "next/server";
// Default time-to-live (TTL) for a paste = 2 minutes (120 seconds)
const DEFAULT_TTL_SECONDS = 120;
// Default maximum number of views if not provided by user
const DEFAULT_MAX_VIEWS = 2;
// Handle POST request for /api/pastes
export async function POST(req) {
  try {
    // Parse JSON body from the incoming request
    const body = await req.json();
    // Extract content, ttl, and max views from request body
    const { content, ttl_seconds, max_views } = body;
    // Check if content exists, is a string, and is not empty
    if (!content || typeof content !== "string" || content.trim() === "") {
      // Return HTTP 400 if content is invalid
      return NextResponse.json(
        { error: "Invalid content" },
        { status: 400 }
      );
    }
    // Set default expiration time (current time + default TTL)
    let expiresAt = new Date(
      Date.now() + DEFAULT_TTL_SECONDS * 1000
    );
    // If ttl_seconds is provided in request
    if (ttl_seconds !== undefined) {
      // Validate ttl_seconds (must be integer >= 1)
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return NextResponse.json(
          { error: "Invalid ttl_seconds" },
          { status: 400 }
        );
      }
      // Override expiration time using provided TTL
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }
    // If max_views is provided
    if (max_views !== undefined) {
      // Validate max_views (must be integer >= 1)
      if (!Number.isInteger(max_views) || max_views < 1) {
        return NextResponse.json(
          { error: "Invalid max_views" },
          { status: 400 }
        );
      }
    }
    // Connect to MongoDB
    await connectDB();
    // Create a new paste document in the database
    const paste = await Paste.create({
      // Store paste content
      content,
      // Store expiration timestamp
      expiresAt,
      // Store max views (use default if not provided)
      maxViews: max_views ?? DEFAULT_MAX_VIEWS,
    });
    // Get host name from request headers
    const host = req.headers.get("host");
    // Determine protocol based on environment
    const protocol =
      process.env.NODE_ENV === "production" ? "https" : "http";
    // Return successful response with paste ID and shareable URL
    return NextResponse.json({
      id: paste._id.toString(),
      url: `${protocol}://${host}/p/${paste._id}`,
    });
  } catch (error) {
    // Catch any unexpected server or database errors
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

