const express = require("express");
const router = express.Router();

const Invoice = require("../models/invoiceModel");

// routes - invoice - get all
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find({});
    res.status(200).json(invoices);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// routes - invoice - get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - invoice - insert by id
router.post("/", async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - invoice - update by id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByIdAndUpdate(id, req.body);
    if (!invoice) {
      return res
        .status(404)
        .json({ message: `cannot find invoice with ID ${id}` });
    }
    const updatedInvoice = await Invoice.findById(id);
    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - invoice - delete by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) {
      return res
        .status(404)
        .json({ message: `cannot find invoice with ID ${id}` });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
