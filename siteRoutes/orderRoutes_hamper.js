require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const handleHamperForm = require("../helper_functions/handleHamper");

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

const headers = {
  "x-api-key": api_key,
};

// Add Hamper
router.get("/addHamper", (req, res) => {
  // querying products to fill in for contents
  let productArray = [];
  axios
    .get(api_url + "/api/product", {
      headers,
    })
    .then((response) => {
      productArray.push(response.data);
      const slicedData = productArray[0];
      slicedData.sort((a, b) => a.name.localeCompare(b.name));
      res.render("orderDashboard_addHamper", { slicedData });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
});

// Add Hamper Handling
router.post("/addHamper", (req, res) => {
  const hamperObject = handleHamperForm(req.body);
  console.log(hamperObject);
  axios
    .post(api_url + "/api/hamper", hamperObject, {
      headers,
    })
    .then((response) => {
      res.redirect("/orderDashboard/hampers");
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

module.exports = router;
