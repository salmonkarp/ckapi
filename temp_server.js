// requirements
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const authenticateApiKey = require("./authenticationMiddleware");

// environment variables
const port = 3000;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const orderPassword = process.env.ORDER_PASSWORD;
const invoicePassword = process.env.INVOICE_PASSWORD;

// middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "randomString",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/public/views"));

// // Core Website / Login Routes

app.get("/", (req, res) => {
  if (req.session.user === "order") {
    res.redirect("/orderDashboard");
  } else if (req.session.user === "invoice") {
    res.redirect("/invoiceDashboard");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { userType, password } = req.body;
  console.log(userType, password);
  console.log(userType, password);
  if (userType === "order" && password === orderPassword) {
    req.session.user = userType;
    res.redirect("/orderDashboard");
  } else if (userType === "invoice" && password === invoicePassword) {
    res.redirect("/invoicePassword");
  } else {
    res.render("login");
  }
});

app.listen(port, () => {
  console.log(`Node API is running on port ${port}.`);
});
