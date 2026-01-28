// Import mongoose library to manage MongoDB connections
import mongoose from "mongoose";
// Read MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
// Function to establish a MongoDB connection
export async function connectDB() {
  // Check current mongoose connection state
  // readyState >= 1 means:
  if (mongoose.connection.readyState >= 1) return;
  // Returns a promise that resolves when the connection is successful
  return mongoose.connect(MONGODB_URI);
}

