// Import database connection helper
import { connectDB } from "@/lib/db";
// Import Paste MongoDB model
import Paste from "@/lib/paste";
// Import Next.js helper to trigger a 404 page
import { notFound } from "next/navigation";
// Disable static rendering and caching for this page
export const dynamic = "force-dynamic";
// Page component for /p/:id route
export default async function Page({ params }) {
  // Extract paste id from route parameters
  const { id } = await params;
  // Ensure MongoDB connection is established
  await connectDB();
  // Find the paste and increment the view count atomically
  // current views must be less than maxViews
  const paste = await Paste.findOneAndUpdate(
    {
      _id: id,
      $or: [
        // Unlimited views allowed
        { maxViews: null },
        // Views still remaining (views < maxViews)
        { $expr: { $lt: ["$views", "$maxViews"] } }
      ]
    },
    // Increment views by 1 for each successful page visit
    { $inc: { views: 1 } },
    // Return the updated document after increment
    { new: true }
  );
  // If paste does not exist or constraints are exceeded than show Next.js 404 page
  if (!paste) notFound();
  // Render paste content safely inside <pre>
  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: 20 }}>
      {paste.content}
    </pre>
  );
}




