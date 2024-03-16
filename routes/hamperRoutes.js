const express = require("express");
const router = express.Router();

const Hamper = require("../models/hamperModel");

// routes - hamper - get all
router.get("/", async (req, res) => {
  try {
    const hampers = await Hamper.find({});
    res.status(200).json(hampers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - hamper - get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const hampers = await Hamper.findById(id);
    res.status(200).json(hampers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - hamper - insert
router.post("/", async (req, res) => {
  try {
    const hamper = await Hamper.create(req.body);
    res.status(200).json(hamper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - hamper - update by id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const validationResult = await Hamper.validate(update);
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.message });
    }

    // Find and update the hamper by ID
    const hamper = await Hamper.findByIdAndUpdate(id, update, { new: true });
    if (!hamper) {
      return res
        .status(404)
        .json({ message: `Cannot find hamper with ID ${id}` });
    }

    // Fetch the updated hamper and send it in the response
    const updatedHamper = await Hamper.findById(id);
    res.status(200).json(updatedHamper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes - hamper - delete by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const hamper = await Hamper.findByIdAndDelete(id);
    if (!hamper) {
      return res
        .status(404)
        .json({ message: `cannot find hamper with ID ${id}` });
    }
    res.status(200).json(hamper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
