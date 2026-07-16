import mongoose from "mongoose";

export async function dbConnect() {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to database");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");
  } catch (e) {
    console.log("Error connecting to database", e);
    process.exit(1);
  }
}
