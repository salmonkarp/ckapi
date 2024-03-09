const mongoose = require("mongoose");

function validatePrices(prices) {
  if (!prices || typeof prices !== "object") {
    return false;
  }
  // Check if prices object contains at least one string-number key-value pair
  return Object.values(prices).some((value) => typeof value === "number");
}

const contentSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    validate: {
      validator: async function (value) {
        const product = await mongoose.model("Product").findById(value);
        return product !== null; // Return true if product exists, false otherwise
      },
      message: "Product does not exist",
    },
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const hamperSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter the hamper name"],
    },
    prices: {
      type: mongoose.Schema.Types.Mixed,
      validate: {
        validator: validatePrices,
        message: "Prices object must at least have one key-value pair",
      },
      required: true,
    },
    contents: {
      type: [contentSchema],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "hamper",
  }
);

const Hamper = mongoose.model("Hamper", hamperSchema);

module.exports = Hamper;
