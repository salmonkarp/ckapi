const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter the customer name"],
    },
    address: {
      type: String,
      default: "",
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "customer",
  }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
