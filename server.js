// requirements
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authenticateApiKey = require("./authenticationMiddleware");

// environment variables
const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// main route
app.get("/", (req, res) => {
  res.send("Hello World, I am Cookies Kingdom's Order Management Database");
});

// helper router to authenticate everything
const routingConfig = require("./routingConfig");

// using authentication route
app.use("/", authenticateApiKey, routingConfig);

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
