import mongoose from "mongoose";

const sizeEnum = [
  3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5,
  12, 12.5,
];

// Review Schema
const reviewSchema = mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Product Schema
const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    size: {
      type: [Number],
      required: true,
      validate: {
        validator: function (sizes) {
          return sizes.every((s) => sizeEnum.includes(s));
        },
        message: "Invalid shoe size",
      },
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    color: {
      type: [String], // Better to explicitly define String inside array
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    rates: {
      type: Number,
      default: 0, // ✅ Fix default value
    },
    numReviews: {
      type: Number,
      default: 0, // ✅ Fix default value
    },
    reviews: [reviewSchema],
    inStock: {
      type: Boolean,
      default: function () {
        return this.size.length > 0; // ✅ Auto-set based on sizes available
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
