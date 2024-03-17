require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

const headers = {
  "x-api-key": api_key,
};

function fetchFullData() {
  const promises = [];
  promises.push(axios.get(api_url + "/api/product", { headers }));
  promises.push(axios.get(api_url + "/api/hamper", { headers }));
  promises.push(axios.get(api_url + "/api/customer", { headers }));

  return Promise.all(promises)
    .then((responses) => {
      const products = responses[0].data;
      const hampers = responses[1].data;
      const customers = responses[2].data;

      return { products, hampers, customers };
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

router.get("/addOrder", (req, res) => {
  fetchFullData()
    .then((combinedData) => {
      // console.log(combinedData);
      res.render("orderDashboard_addOrder", {
        products: combinedData.products,
        hampers: combinedData.hampers,
        customers: combinedData.customers,
      });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

module.exports = router;
