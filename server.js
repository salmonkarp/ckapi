// requirements
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const authenticateApiKey = require("./helper_functions/authenticationMiddleware");

// environment variables
const port = process.env.PORT || 3000;
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
  })
);
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/public/views"));
const userOrderAuthentication = require("./helper_functions/userOrderAuthentication");
const userInvoiceAuthentication = require("./helper_functions/userInvoiceAuthentication");

// // API Routes
const wrapperRoute = require("./routes/wrapperRoute");
app.use("/api", authenticateApiKey, wrapperRoute);

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
  if (userType === "order" && password === orderPassword) {
    req.session.user = userType;
    res.redirect("/orderDashboard");
  } else if (userType === "invoice" && password === invoicePassword) {
    req.session.user = userType;
    res.redirect("/invoiceDashboard");
  } else {
    res.render("login");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
});

app.get("/error", (req, res) => {
  let error = "";
  res.render("error", { error });
});

// Other Routes
const orderRoutes = require("./siteRoutes/orderRoutes");
const invoiceRoutes = require("./siteRoutes/invoiceRoutes")
app.use("/orderDashboard", userOrderAuthentication, orderRoutes);
app.use("/invoiceDashboard", userInvoiceAuthentication, invoiceRoutes);

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
