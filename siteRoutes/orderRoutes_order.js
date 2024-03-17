require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

const headers = {
  "x-api-key": api_key,
};

router.get("/addOrder", (req, res) => {
  res.render("orderDashboard_addOrder");
});

module.exports = router;
