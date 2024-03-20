require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

const headers = {
  "x-api-key": api_key,
};

// Add Customer
router.get("/addCustomer", (req, res) => {
  res.render("invoiceDashboard_addCustomer");
});

// Add Customer handling
router.post("/addCustomer", (req, res) => {
  let customerData = req.body;
  console.log(customerData);
  axios
    .post(api_url + "/api/customer", customerData, {
      headers,
    })
    .then((response) => {
      res.redirect("/invoiceDashboard/customers");
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

// Edit Customer
router.get("/editCustomer/:id", (req, res) => {
  let customerId = req.params.id;
  axios
    .get(api_url + "/api/customer/" + customerId, {
      headers,
    })
    .then((response) => {
      let customer = response.data;
      res.render("invoiceDashboard_editCustomer", { customer });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

// Edit Customer handling
router.post("/editCustomer/:id", (req, res) => {
  let customer = req.body;
  let customerId = req.params.id;
  axios
    .put(api_url + "/api/customer/" + customerId, customer, {
      headers,
    })
    .then((repsonse) => {
      res.redirect("/invoiceDashboard/customers");
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

// Delete Customer
router.get("/deleteCustomer/:id", (req, res) => {
  let customerId = req.params.id;
  axios
    .get(api_url + "/api/customer/" + customerId, {
      headers,
    })
    .then((response) => {
      let customer = response.data;
      res.render("invoiceDashboard_deleteCustomer", { customer });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.post("/deleteCustomer/:id", (req, res) => {
  customerId = req.params.id;
  axios
    .delete(api_url + "/api/customer/" + customerId, {
      headers,
    })
    .then((response) => {
      res.redirect("/invoiceDashboard/customers");
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

module.exports = router;
