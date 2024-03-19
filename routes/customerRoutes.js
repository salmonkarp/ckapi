const express = require("express");
const router = express.Router();

const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");

// routes - customer - get all
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json(customers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// routes - customer - get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - customer - insert by id
router.post("/", async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - customer - update by id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndUpdate(id, req.body);
    if (!customer) {
      return res
        .status(404)
        .json({ message: `cannot find customer with ID ${id}` });
    }
    const updatedCustomer = await Customer.findById(id);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - customer - delete by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res
        .status(404)
        .json({ message: `cannot find customer with ID ${id}` });
    }
    const orderWithCustomer = await Order.findOne({
      customerId: id,
    });
    if (orderWithCustomer) {
      return res.status(400).json({
        message: `Customer with ${id} is still in an order, cannot be deleted.`,
      });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
