const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
    },
    sold: {
      type: Number,
      default: 0,
    },
    thumb: {
      type: String,
    },
    images: {
      type: Array,
    },
    rating: [
      {
        star: { type: Number },
        postBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        updatedAt: { type: Date },
      },
    ],
    totalRating: {
      type: Number,
      default: 0,
    },
    varriants: [
      {
        color: String,
        price: Number,
        thumb: String,
        images: Array,
        title: String,
        sku: String,
      },
    ],
    description: {
      type: Array,
    },
    status: {
      type: Number,
      default: 1,
      enum: [0, 1], // [Hide, Active]
    },
  },
  {
    timestamps: true,
  }
);
//Export the model
module.exports = mongoose.model("Product", productSchema);
