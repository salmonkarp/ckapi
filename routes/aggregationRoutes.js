const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const Hamper = require("../models/hamperModel");
const Order = require("../models/orderModel");
const Invoice = require("../models/invoiceModel");
const Customer = require("../models/customerModel");

router.get("/", (req, res) => {
  res.send(
    "This is the aggregation root subdomain. Read the docs to find out more."
  );
});

router.get("/hamperDetail", async (req, res) => {
  try {
    const hampers = await Hamper.find({});
    const modifiedHampers = await Promise.all(
      hampers.map(async (hamper) => {
        return await hamper.populate("contents.productId", "name");
      })
    );
    res.status(200).json({ modifiedHampers });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/hamperDetail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const hamperDetail = await Hamper.findById(id).populate(
      "contents.productId",
      "name"
    );
    res.status(200).json({ hamperDetail });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

async function aggregateObject(originalObject) {
  const modifiedObject = { ...originalObject.toJSON() };

  const customer = await Customer.findById(modifiedObject.customerId);
  modifiedObject.customerName = customer.name;
  modifiedObject.customerAddress = customer.address;
  modifiedObject.customerNote = customer.note;

  modifiedObject.deliveryDateOld = modifiedObject.deliveryDate;
  modifiedObject.deliveryDate = new Date(
    modifiedObject.deliveryDate
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  for (const productContent of modifiedObject.productContent) {
    const product = await Product.findById(productContent.productId);
    if (product) {
      if (productContent.priceType === "custom") {
        productContent.priceValue = productContent.customPrice;
      } else {
        productContent.priceValue = product.prices[productContent.priceType];
        // console.log(productContent.name);
      }
      productContent.name = product.name;
    }
  }
  for (const hamperContent of modifiedObject.hamperContent) {
    const hamper = await Hamper.findById(hamperContent.hamperId);
    if (hamper) {
      if (hamperContent.priceType === "custom") {
        hamperContent.priceValue = hamperContent.customPrice;
      } else {
        hamperContent.priceValue = hamper.prices[hamperContent.priceType];
      }
      hamperContent.name = hamper.name;
    }
  }
  // console.log(modifiedObject);
  return modifiedObject;
}

router.get("/orderDetail", async (req, res) => {
  try {
    const orders = await Order.find({});
    const modifiedOrders = await Promise.all(
      orders.map(async (order) => {
        return await aggregateObject(order);
      })
    );
    res.status(200).json(modifiedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/orderDetail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    const modifiedOrder = await aggregateObject(order);
    res.status(200).json(modifiedOrder);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/invoiceDetail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    const modifiedInvoice = await aggregateObject(invoice);
    res.status(200).json(modifiedInvoice);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
