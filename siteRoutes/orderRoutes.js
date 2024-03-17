require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const productRoutes = require("./orderRoutes_product");
const hamperRoutes = require("./orderRoutes_hamper");
const customerRoutes = require("./orderRoutes_customer");
const orderRoutes = require("./orderRoutes_order");

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

const headers = {
  "x-api-key": api_key,
};

// Order Dashboard
router.get("/", (req, res) => {
  let orderArray = [];
  axios
    .get(api_url + "/api/aggregation/orderDetail", {
      headers,
    })
    .then((response) => {
      orderArray.push(response.data);
      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = 5;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const slicedData = orderArray[0].slice(startIndex, endIndex);
      const totalPages = Math.ceil(orderArray[0].length / itemsPerPage);
      res.render("orderDashboard", { page, totalPages, slicedData });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
});

// Products Dashboard
router.get("/products", (req, res) => {
  let productArray = [];
  axios
    .get(api_url + "/api/product", {
      headers,
    })
    .then((response) => {
      productArray.push(response.data);
      const slicedData = productArray[0];
      slicedData.sort((a, b) => a.name.localeCompare(b.name));
      res.render("orderDashboard_products", { slicedData });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
});

// Hamper Dashboard
router.get("/hampers", (req, res) => {
  axios
    .get(api_url + "/api/aggregation/hamperDetail", {
      headers,
    })
    .then((response) => {
      const slicedData = response.data.modifiedHampers;
      slicedData.sort((a, b) => a.name.localeCompare(b.name));
      res.render("orderDashboard_hampers", { slicedData });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
});

// Customer Dashboard
router.get("/customers", (req, res) => {
  axios
    .get(api_url + "/api/customer", {
      headers,
    })
    .then((response) => {
      customers = response.data;
      res.render("orderDashboard_customers", { customers });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.use("/", productRoutes);
router.use("/", hamperRoutes);
router.use("/", customerRoutes);
router.use("/", orderRoutes);

module.exports = router;
