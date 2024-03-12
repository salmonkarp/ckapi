const express = require("express");
const router = express.Router();

// importing basic routes
const productRoutes = require("./productRoutes");
const hamperRoutes = require("./hamperRoutes");
const customerRoutes = require("./customerRoutes");
const orderRoutes = require("./orderRoutes");
const invoiceRoutes = require("./invoiceRoutes");

// importing aggregation routes
const aggregationRoutes = require("./aggregationRoutes");

router.get("/", (req, res) => {
  res.send(
    "Welcome to CK's Data Management API. Read the documentation to find out more."
  );
});

router.use("/product", productRoutes);
router.use("/hamper", hamperRoutes);
router.use("/customer", customerRoutes);
router.use("/order", orderRoutes);
router.use("/invoice", invoiceRoutes);
router.use("/aggregation", aggregationRoutes);

module.exports = router;
