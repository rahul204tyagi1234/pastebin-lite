// Import database connection helper
import { connectDB } from "@/lib/db";
// Import Paste MongoDB model
import Paste from "@/lib/paste";
// Import Next.js response utility for returning JSON responses
import { NextResponse } from "next/server";
// Handle GET request for /api/pastes/:id
export async function GET(req, { params }) {
  // Extract paste id from URL parameters
  const { id } = params;
  // Ensure database connection is established
  await connectDB();
  // Paste must match the given id
  // Paste must have unlimited views OR current views must be less than maxViews
  const paste = await Paste.findOneAndUpdate(
    {
      _id: id,
      $or: [
        // Case 1: Unlimited views
        { maxViews: null },
        // Case 2: Views are still available (views < maxViews)
        { $expr: { $lt: ["$views", "$maxViews"] } }
      ]
    },
    // Increment the views count by 1
    { $inc: { views: 1 } },
    // Return the updated document after increment
    { new: true }
  );
  // return 404 (paste unavailable)
  if (!paste) {
    return NextResponse.json({}, { status: 404 });
  }
  // Return paste data in JSON format
  return NextResponse.json({
    // Actual paste content
    content: paste.content,
    // Remaining views (null if unlimited)
    remaining_views:
      paste.maxViews !== null
        ? paste.maxViews - paste.views
        : null,
    // Expiry timestamp (null if no TTL)
    expires_at: paste.expiresAt,
  });
}


