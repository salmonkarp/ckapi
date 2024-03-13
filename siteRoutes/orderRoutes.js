const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  const headers = {
    "x-api-key": "ckapi1610",
  };
  let orderArray = [];
  axios
    .get("https://ckapi-gph0.onrender.com/api/order", {
      headers,
    })
    .then((response) => {
      orderArray.push(response.data);
      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = 5;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const slicedData = orderArray.slice(startIndex, endIndex)[0];
      const totalPages = Math.ceil(orderArray.length / itemsPerPage);
      slicedData.forEach((order) => {
        console.log(order);
      });
      res.render("orderDashboard", { page, totalPages, slicedData });
    })
    .catch((error) => {
      console.error(error);
      res.render("error");
    });
});

module.exports = router;
