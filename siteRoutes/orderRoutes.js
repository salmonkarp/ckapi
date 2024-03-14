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
      res.render("error", {error});
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
      const slicedData = orderArray[0];
      slicedData.sort((a,b) => a.name.localeCompare(b.name));
      res.render("orderDashboard_products", { slicedData });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", {error});
    });
})

// Add Product
router.get("/addProduct", (req,res) => {
  res.render("orderDashboard_addProduct");
})

// Add Product Handling
router.post("/addProduct", (req,res) => {
  const productObject = handleProductForm(req.body);
  axios
    .post(api_url+'/api/product', productObject, {
      headers,
    })
    .then((response) => {
      res.redirect('/orderDashboard/products')
    })
    .catch((error) => {
      console.error(error);
      res.render("error", {error});
    });
})

// Edit Product
router.get("/editProduct/:id", (req,res) => {
  axios
    .get(api_url+`/api/product/${req.params.id}`, {
      headers,
    })
    .then((response) => {
      const productData = response.data;
      console.log(productData);
      res.render("orderDashboard_editProduct", {productData});
    })
    .catch((error) => {
      console.error(error);
      res.render("error", {error});
    });
})

// Edit Product Handling
router.post("/editProduct/:id", (req,res) => {
  const productObject = handleProductForm(req.body);
  productId = req.params.id;
  axios
    .put(api_url+'/api/product/'+productId, productObject, {
      headers,
    })
    .then((response) => {
      res.redirect('/orderDashboard/products')
    })
    .catch((error) => {
      console.error(error);
      res.render("error", {error});
    });
})

// Delete Product Confirm
router.get("/deleteProduct/:id", (req,res) => {
  const productId = req.params.id;
  axios
    .get(api_url+'/api/product/'+productId, {
      headers,
    })
    .then((response) => {
      const productData = response.data;
      console.log(productData);
      res.render('orderDashboard_deleteProduct', {productId, productData})
    })
    .catch((error) => {
      console.error(error);
      res.render("error", {error});
    });
})

// Delete Product
router.post("/deleteProduct/:id", (req,res) => {
  const productId = req.params.id;
  axios
    .delete(api_url+'/api/product/'+productId, {
      headers,
    })
    .then((response) => {
      res.redirect('/orderDashboard/products')
    })
    .catch((error) => {
      console.error(error);
      res.render("error", {error});
    });
})

module.exports = router;
