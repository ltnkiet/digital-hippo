const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var couponsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    status: {
      type: Number,
      default: 0, // 0: Ẩn, 1: Đang chạy, 2: Hết hạn
    },
  },
  { timestamps: true }
);

couponsSchema.pre("save", function (next) {
  const currentDate = new Date();
  if (this.endDate < currentDate) {
    this.status = 2; // Hết hạn
  } else if (this.startDate <= currentDate) {
    this.status = 1; // Đang chạy
  } else this.status = 0;
  next();
}); 

//Export the model
module.exports = mongoose.model("Coupons", couponsSchema);
