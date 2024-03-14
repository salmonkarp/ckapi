require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

// Order Dashboard
router.get("/", (req, res) => {
  const headers = {
    "x-api-key": api_key,
  };
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
  const headers = {
    "x-api-key": api_key,
  };
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


module.exports = router;
