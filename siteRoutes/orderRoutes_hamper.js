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

// Edit Hamper
router.get("/editHamper/:id", (req, res) => {
  // querying products to fill in for contents
  let productArray = [];
  let slicedData;
  let hamperId = req.params.id;
  axios
    .get(api_url + "/api/product", {
      headers,
    })
    .then((response) => {
      productArray.push(response.data);
      slicedData = productArray[0];
      slicedData.sort((a, b) => a.name.localeCompare(b.name));

      // Fetch hamper details after products are fetched
      axios
        .get(api_url + "/api/aggregation/hamperDetail/" + hamperId, {
          headers,
        })
        .then((response) => {
          let hamperDetails = response.data.hamperDetail;
          console.log(hamperDetails); // Move console.log here
          res.render("orderDashboard_editHamper", {
            slicedData,
            hamperDetails,
          });
        })
        .catch((error) => {
          console.error(error);
          res.render("error", { error });
        });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
});

// Edit Hamper Handling
router.post("/editHamper/:id", (req, res) => {
  const hamperObject = handleHamperForm(req.body);
  let hamperId = req.params.id;
  axios
    .put(api_url + "/api/hamper/" + hamperId, hamperObject, {
      headers,
    })
    .then((response) => {
      res.redirect("/orderDashboard/hampers");
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
});

// Delete Hamper
router.get("/deleteHamper/:id", (req, res) => {
  let hamperId = req.params.id;
  axios
    .get(api_url + "/api/aggregation/hamperDetail/" + hamperId, {
      headers,
    })
    .then((response) => {
      const hamperData = response.data.hamperDetail;
      console.log(hamperData);
      res.render("orderDashboard_deleteHamper", { hamperId, hamperData });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
});

// Delete Hamper Handling
router.post("/deleteHamper/:id", (req, res) => {
  let hamperId = req.params.id;
  axios
    .delete(api_url + "/api/hamper/" + hamperId, {
      headers,
    })
    .then((response) => {
      res.redirect("/orderDashboard/hampers");
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
});

module.exports = router;
