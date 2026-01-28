// Import the MongoDB connection function
import { connectDB } from "@/lib/db";
// Import Next.js response helper to send JSON responses
import { NextResponse } from "next/server";
// Handle GET request for /api/healthz
export async function GET() {
  try {
    // Try to connect to the database
    await connectDB();
    // If DB connection is successful, return HTTP 200 with JSON
    return NextResponse.json({ ok: true });
  } catch {
    // If any error occurs (DB down, connection failed, etc.) return HTTP 500 with a failure response
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}


