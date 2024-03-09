const mongoose = require("mongoose");

function validatePrices(prices) {
  if (!prices || typeof prices !== "object") {
    return false;
  }

  // Check if prices object contains at least one string-number key-value pair
  return Object.values(prices).some((value) => typeof value === "number");
}

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter the product name"],
    },
    currentStock: {
      type: Number,
      default: 0,
    },
    prices: {
      type: mongoose.Schema.Types.Mixed,
      validate: {
        validator: validatePrices,
        message: "Prices object must at least have one key-value pair",
      },
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "product",
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
