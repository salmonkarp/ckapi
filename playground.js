const mongoose = require("mongoose");
const Hamper = require("./models/hamperModel");
const Product = require("./models/productModel");
require("dotenv").config();

const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const OldHamperSchema = new mongoose.Schema(
  {
    name: String,
    prices: mongoose.Schema.Types.Mixed,
    items: [
      {
        product_id: mongoose.Schema.Types.ObjectId,
        quantity: Number,
      },
    ],
  },
  {
    collection: "Hampers",
  }
);

const OldProductSchema = new mongoose.Schema(
  {
    name: String,
    currentStock: Number || 0,
    prices: mongoose.Schema.Types.Mixed,
  },
  {
    collection: "Products",
  }
);
const OldHamper = mongoose.model("Hampers", OldHamperSchema);
const OldProduct = mongoose.model("Products", OldProductSchema);

const uri = "mongodb+srv://" + dbUser + ":" + dbPassword + "@" + dbHost;
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected");
    Hamper.deleteMany({})
      .then(() => {
        console.log("All records deleted successfully");
      })
      .catch((err) => {
        console.error("Error deleting records:", err);
      });
  })
  .catch((error) => {
    console.log(error);
  });

async function transferProducts() {
  try {
    const products = await OldProduct.find({}).exec();
    console.log(products.length);
    // Iterate over each record and create a new document in the "product" collection
    for (const productData of products) {
      const newProduct = new Product({
        name: productData.name,
        prices: productData.prices,
      });

      // Save the new document
      const savedProduct = await newProduct.save();
      console.log("Product saved:", savedProduct);
    }
  } catch (err) {
    console.error("Error fetching or saving products:", err);
  }
}
// Fetch all records from the "Hampers" collection
async function transferHampers() {
  try {
    const hampers = await OldHamper.find({}).exec();
    console.log(hampers.length);
    // Iterate over each record and create a new document in the "hamper" collection
    for (const hamperData of hampers) {
      const newHamper = new Hamper({
        name: hamperData.name,
        prices: hamperData.prices,
        contents: hamperData.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      });

      // Save the new document
      const savedHamper = await newHamper.save();
      console.log("Hamper saved:", savedHamper);
    }
  } catch (err) {
    console.error("Error fetching or saving hampers:", err);
  }
}
