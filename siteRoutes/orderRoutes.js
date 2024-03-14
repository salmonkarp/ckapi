require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const handleProductForm = require("../helper_functions/handleProduct");

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

const headers = {
  "x-api-key": api_key,
};

// Order Dashboard
router.get("/", (req, res) => {
  let orderArray = [];
  axios
    .get(api_url+'/api/aggregation/orderDetail', {
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
      res.render("error");
    });
});


// Products Dashboard
router.get("/products", (req, res) => {
  let orderArray = [];
  axios
    .get(api_url+'/api/product', {
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
      res.render("orderProduct", { page, totalPages, slicedData });
    })
    .catch((error) => {
      console.error(error);
      res.render("error");
    });
})

// Add Product
router.get("/addProduct", (req,res) => {
  res.render("productViews/addProduct");
})

// Add Product Handling
router.post("/addProduct", (req,res) => {
  OrderObject = handleProductForm(req.body);
  console.log(OrderObject);
  axios
    .post(api_url+'/api/product', OrderObject, {
      headers,
    })
    .then((response) => {
      res.redirect('/orderDashboard/products')
    })
    .catch((error) => {
      console.error(error);
      res.render("error");
    });
})

// Edit Product
router.get("/editProduct/:id", (req,res) => {
  axios
    .get(api_url+`/api/product/${req.params.id}`, {
      headers,
    })
    .then((response) => {
      res.render("editProduct", {response});
    })
    .catch((error) => {
      console.error(error);
      res.render("error");
    });
})


module.exports = router;
