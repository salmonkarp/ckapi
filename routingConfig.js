const express = require("express");
const router = express.Router();

// importing basic routes
const productRoutes = require("./routes/productRoutes");
const hamperRoutes = require("./routes/hamperRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

// importing aggregation routes
const aggregationRoutes = require("./routes/aggregationRoutes");

router.use("/product", productRoutes);
router.use("/hamper", hamperRoutes);
router.use("/customer", customerRoutes);
router.use("/order", orderRoutes);
router.use("/invoice", invoiceRoutes);
router.use("/aggregation", aggregationRoutes);

module.exports = router;
