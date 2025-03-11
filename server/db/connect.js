import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Ensure .env variables are loaded

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URL;

    if (!MONGO_URI) {
      throw new Error("❌ MONGO_URL is undefined. Check your .env file.");
    }

    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
