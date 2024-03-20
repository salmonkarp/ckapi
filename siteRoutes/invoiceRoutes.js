require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const productRoutes = require("./invoiceRoutes_product");
const hamperRoutes = require("./invoiceRoutes_hamper");
const customerRoutes = require("./invoiceRoutes_customer");
const invoiceRoutes = require("./invoiceRoutes_invoice");

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

const headers = {
  "x-api-key": api_key,
};

// Invoice Dashboard
router.get("/", (req, res) => {
  let invoiceArray = [];
  axios
    .get(api_url + "/api/aggregation/invoiceDetail", {
      headers,
    })
    .then((response) => {
      invoiceArray.push(response.data);
      const slicedData = invoiceArray[0];
      res.render("invoiceDashboard", { slicedData });
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
      res.render("invoiceDashboard_products", { slicedData });
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
      res.render("invoiceDashboard_hampers", { slicedData });
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
      res.render("invoiceDashboard_customers", { customers });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.use("/", productRoutes);
router.use("/", hamperRoutes);
router.use("/", customerRoutes);
router.use("/", invoiceRoutes);

module.exports = router;
