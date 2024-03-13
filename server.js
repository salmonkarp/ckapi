// requirements
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const functions = require("firebase-functions");
const app = express();
const authenticateApiKey = require("./authenticationMiddleware");

// environment variables
const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;


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
const userAuthentication = require("./userAuthentication");

// // API Routes
app.get('/', (req,res) => {
  res.send('hello');
})

const wrapperRoute = require("./routes/wrapperRoute");
app.use("/api", authenticateApiKey, wrapperRoute);

// connect database first, then listen to requests
const uri = "mongodb+srv://" + dbUser + ":" + dbPassword + "@" + dbHost;
mongoose.connect(uri)
  // .then(() => {
  //   console.log("connected");
  //   const server = app.listen(port, () => {
  //     console.log(`Node API is running on port ${port}.`);
  //   });
  //   server.keepAliveTimeout = 120 * 1000;
  //   server.headersTimeout = 120 * 1000;
  // })
  // .catch((error) => {
  //   console.log(error);
  // });


exports.ckapi = functions.https.onRequest(app);
