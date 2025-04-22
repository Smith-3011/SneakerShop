import connectDB from "./db/connect.js";
import "dotenv/config";
import Product from "./models/Product.js";

const removeNikeSBDunkLow = async () => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected:", process.env.MONGO_URL);

    // Find and delete Nike SB Dunk Low products
    const result = await Product.deleteMany({ 
      title: { $regex: "Nike SB Dunk Low", $options: "i" } 
    });

    console.log(`✅ Removed ${result.deletedCount} Nike SB Dunk Low products from the database`);
    
    // Verify no Nike SB Dunk Low products remain
    const remainingProducts = await Product.find({ 
      title: { $regex: "Nike SB Dunk Low", $options: "i" } 
    });
    
    if (remainingProducts.length === 0) {
      console.log("✅ Verification successful: No Nike SB Dunk Low products remain in the database");
    } else {
      console.log(`⚠️ Warning: ${remainingProducts.length} Nike SB Dunk Low products still exist`);
    }

    console.log("🎉 Operation completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during Nike SB Dunk Low removal:", error);
    process.exit(1);
  }
};

// Run the removal script
removeNikeSBDunkLow(); 