// requirements
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// environment variables
const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// main routes
app.get("/", (req, res) => {
  res.send("Hello World, I am Cookies Kingdom's Order Management Database");
});

// importing basic routes
const productRoutes = require("./routes/productRoutes");
const hamperRoutes = require("./routes/hamperRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

// importing aggregation routes
const aggregationRoutes = require("./routes/aggregationRoutes");

// using routes
app.use("/product", productRoutes);
app.use("/hamper", hamperRoutes);
app.use("/customer", customerRoutes);
app.use("/order", orderRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/aggregation", aggregationRoutes);

// connect database first, then listen to requests
const uri = "mongodb+srv://" + dbUser + ":" + dbPassword + "@" + dbHost;
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected");
    const server = app.listen(port, () => {
      console.log(`Node API is running on port ${port}.`);
    });
    server.keepAliveTimeout = 120 * 1000;
    server.headersTimeout = 120 * 1000;
  })
  .catch((error) => {
    console.log(error);
  });
