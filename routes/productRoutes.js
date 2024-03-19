const express = require("express");
const router = express.Router();

const Product = require("../models/productModel");
const Hamper = require("../models/hamperModel");
const Order = require("../models/orderModel");

// routes - product - get all
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - product - get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findById(id);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - product - insert by id
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - product - update by id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const validationResult = await Product.validate(update);
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.message });
    }
    // Find and update the product by ID
    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) {
      return res
        .status(404)
        .json({ message: `Cannot find product with ID ${id}` });
    }

    // Fetch the updated product and send it in the response
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - product - delete by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find product with ID ${id}` });
    }

    const hamperWithProduct = await Hamper.findOne({
      "contents.productId": id,
    });
    if (hamperWithProduct) {
      return res.status(400).json({
        message: `Product with ${id} is still in a hamper, cannot be deleted.`,
      });
    }

    const orderWithProduct = await Order.findOne({
      "productContent.productId": id,
    });
    if (orderWithProduct) {
      return res.status(400).json({
        message: `Product with ${id} is still in an order, cannot be deleted.`,
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
