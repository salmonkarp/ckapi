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

const invoiceSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Enter the customer id"],
    },
    deliveryDate: {
      type: mongoose.Schema.Types.Date,
      default: "",
    },
    productContent: {
      type: [productRecordSchema],
      required: [true, "Enter a product record array"],
    },
    hamperContent: {
      type: [hamperRecordSchema],
      required: [true, "Enter a hamper record array"],
    },
    invoiceDiscount: {
      type: Number,
      default: 0,
    },
    details: {
      type: String,
      default: "",
    },
    oldProductId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    modified: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "invoice",
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
