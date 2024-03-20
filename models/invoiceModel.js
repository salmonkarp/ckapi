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
    ref: "Product",
    required: [true, "Enter the price type"],
    validate: {
      validator: async function (value) {
        const priceType = await mongoose
          .model("Product")
          .findOne({ [value]: { $exists: true } });
        return priceType !== null; // Return true if product exists, false otherwise
      },
      message: "Price type does not exist",
    },
  },
  quantity: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, "Enter the quantity for each product"],
  },
  discount: {
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
    ref: "Hamper",
    required: [true, "Enter the price type"],
    validate: {
      validator: async function (value) {
        const priceType = await mongoose
          .model("Hamper")
          .findOne({ [value]: { $exists: true } });
        return priceType !== null; // Return true if product exists, false otherwise
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
    }
  },
  {
    timestamps: true,
    collection: "invoice",
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
