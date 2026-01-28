// Import mongoose to define MongoDB schemas and models
import mongoose from "mongoose";
// Define schema for Paste collection
const PasteSchema = new mongoose.Schema({
  // Stores the actual paste text content
  content: { type: String, required: true },
  // Timestamp when the paste is created
  // Defaults to current date and time
  createdAt: { type: Date, default: Date.now },
  // Timestamp when the paste should expire
  // Null means no time-based expiry
  expiresAt: { type: Date, default: null },
  // Maximum number of views allowed for this paste Null means unlimited views
  maxViews: { type: Number, default: null },
  // Tracks how many times the paste has been viewed Starts from 0
  views: { type: Number, default: 0 },
});
// Export the Paste model
export default mongoose.models.Paste ||
  mongoose.model("Paste", PasteSchema);


