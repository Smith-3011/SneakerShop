import connectDB from "./db/connect.js";
import User from "./models/User.js";
import "dotenv/config";
import { dummy_data } from "./utils/dummy_data.js";
import Product from "./models/Product.js";
import Cart from "./models/Cart.js";
import Order from "./models/Order.js";

const startSeeder = async () => {
  try {
    // ✅ Connect to MongoDB once
    await connectDB(process.env.MONGO_URL);

    console.log("✅ MongoDB Connected:", process.env.MONGO_URL);

    // ✅ Delete all previous data
    await User.deleteMany();
    console.log("✅ Users Deleted");

    await Order.deleteMany();
    console.log("✅ Orders Deleted");

    await Cart.deleteMany();
    console.log("✅ Carts Deleted");

    await Product.deleteMany();
    console.log("✅ Products Deleted");

    // ✅ Insert new products
    await Product.insertMany(dummy_data);
    console.log("✅ Products Inserted Successfully!");

    console.log("🎉 Database seeding completed!");
    process.exit(0); // ✅ Exit only after all operations finish
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

// ✅ Run Seeder
startSeeder();
