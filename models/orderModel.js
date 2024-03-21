const mongoose = require("mongoose");

const productRecordSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Enter the product id"],
    validate: {
      validator: async function (value) {
        const product = await mongoose.model("Product").findById(value);
        return product !== null; // Return true if product exists, false otherwise
      },
      message: "Product does not exist",
    },
  },
  priceType: {
    type: String,
    required: [true, "Enter the price type"],
    validate: {
      validator: async function (value) {
        const priceType = await mongoose
          .model("Product")
          .findOne({ [`prices.${value}`]: { $exists: true } });
        return priceType !== null || value === "custom"; // Return true if product exists, false otherwise
      },
      message: "Price type does not exist",
    },
  },
  quantity: {
    type: Number,
    required: [true, "Enter the quantity for each product"],
  },
  discount: {
    type: Number,
    default: 0,
  },
  customPrice: {
    type: Number,
    default: 0,
  },
});

const hamperRecordSchema = mongoose.Schema({
  hamperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hamper",
    required: [true, "Enter the hamper id"],
    validate: {
      validator: async function (value) {
        const hamper = await mongoose.model("Hamper").findById(value);
        return hamper !== null; // Return true if hamper exists, false otherwise
      },
      message: "Hamper does not exist",
    },
  },
  priceType: {
    type: String,
    required: [true, "Enter the price type"],
    validate: {
      validator: async function (value) {
        const priceType = await mongoose
          .model("Hamper")
          .findOne({ [`prices.${value}`]: { $exists: true } });
        return priceType !== null || value === "custom"; // Return true if product exists, false otherwise
      },
      message: "Price type does not exist",
    },
  },
  quantity: {
    type: Number,
    required: [true, "Enter the quantity for each hamper"],
  },
  discount: {
    type: Number,
    default: 0,
  },
  customPrice: {
    type: Number,
    default: 0,
  },
});

const orderSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Enter the customer id"],
      validate: {
        validator: async function (value) {
          const customer = await mongoose.model("Customer").findById(value);
          return customer !== null;
        },
        message: "Customer Id must already exist",
      },
    },
    deliveryDate: {
      type: Date,
      default: Date.now(),
    },
    productContent: {
      type: [productRecordSchema],
      required: false,
    },
    hamperContent: {
      type: [hamperRecordSchema],
      required: false,
    },
    orderDiscount: {
      type: Number,
      default: 0,
    },
    isSent: {
      type: Boolean,
      default: false,
    },
    details: {
      type: String,
      default: "",
    },
    isConverted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    collection: "order",
  }
);

orderSchema.path("productContent").validate(function (value) {
  return (
    (value && value.length > 0) ||
    (this.hamperContent && this.hamperContent.length > 0)
  );
}, "At least one product or one hamper must be included.");

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
