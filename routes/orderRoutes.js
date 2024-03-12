const express = require("express");
const router = express.Router();

const Order = require("../models/orderModel");

// routes - order - get all
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// routes - order - get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - order - insert by id
router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - order - update by id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const { error } = Order.validate(update);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const order = await Order.findByIdAndUpdate(id, update);
    if (!order) {
      return res
        .status(404)
        .json({ message: `cannot find order with ID ${id}` });
    }
    const updatedOrder = await Order.findById(id);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - order - delete by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res
        .status(404)
        .json({ message: `cannot find order with ID ${id}` });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
