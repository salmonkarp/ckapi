require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const handleOrder = require("../helper_functions/handleOrder");
const handleInvoice = require("../helper_functions/handleInvoice");

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

const headers = {
  "x-api-key": api_key,
};

function fetchFullData() {
  const promises = [];
  promises.push(axios.get(api_url + "/api/product", { headers }));
  promises.push(axios.get(api_url + "/api/hamper", { headers }));
  promises.push(axios.get(api_url + "/api/customer", { headers }));
  promises.push(axios.get(api_url + "/api/aggregation/orderDetail", { headers }));

  return Promise.all(promises)
    .then((responses) => {
      const products = responses[0].data;
      const hampers = responses[1].data;
      const customers = responses[2].data;
      const orders = responses[3].data;

      products.sort((a, b) => a.name.localeCompare(b.name));
      hampers.sort((a, b) => a.name.localeCompare(b.name));
      customers.sort((a, b) => a.name.localeCompare(b.name));
      const filteredOrders = orders.filter(obj => obj.isSent === true);
      filteredOrders.sort((a,b) => a.deliveryDateOld.localeCompare(b.deliveryDateOld));

      return { products, hampers, customers, filteredOrders };
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

function fetchFullFullData(invoiceId) {
  const promises = [];
  promises.push(axios.get(api_url + "/api/product", { headers }));
  promises.push(axios.get(api_url + "/api/hamper", { headers }));
  promises.push(axios.get(api_url + "/api/customer", { headers }));
  promises.push(
    axios.get(api_url + "/api/aggregation/invoiceDetail/" + invoiceId, { headers })
  );
  promises.push(axios.get(api_url + "/api/aggregation/orderDetail", { headers }));

  return Promise.all(promises)
    .then((responses) => {
      const products = responses[0].data;
      const hampers = responses[1].data;
      const customers = responses[2].data;
      const invoice = responses[3].data;
      const orders = responses[4].data;

      products.sort((a, b) => a.name.localeCompare(b.name));
      hampers.sort((a, b) => a.name.localeCompare(b.name));
      customers.sort((a, b) => a.name.localeCompare(b.name));
      const filteredOrders = orders.filter(obj => obj.isSent === true);
      filteredOrders.sort((a,b) => a.deliveryDateOld.localeCompare(b.deliveryDateOld));

      return { products, hampers, customers, invoice, filteredOrders };
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

router.get("/addInvoice", (req, res) => {
  fetchFullData()
    .then((combinedData) => {
      let realFiltered = combinedData.filteredOrders.filter(obj => obj.isConverted === false);
      res.render("invoiceDashboard_addInvoice", {
        products: combinedData.products,
        hampers: combinedData.hampers,
        customers: combinedData.customers,
        orders: realFiltered,
      });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.post("/addInvoice", async (req, res) => {
  console.log(req.body);
  handleInvoice(req.body)
    .then((invoiceObject) => {
      console.log(invoiceObject);
      axios
        .post(api_url + "/api/invoice", invoiceObject, { headers })
        .then((response) => {
          res.redirect("/invoiceDashboard");
        })
        .catch((error) => {
          console.log(error);
          res.render("error", { error });
        });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.get("/editInvoice/:id", (req, res) => {
  let invoiceId = req.params.id;
  fetchFullFullData(invoiceId)
    .then((combinedData) => {
      let realFiltered = combinedData.filteredOrders;
      res.render("invoiceDashboard_editInvoice", {
        products: combinedData.products,
        hampers: combinedData.hampers,
        customers: combinedData.customers,
        invoiceData: combinedData.invoice,
        orders: realFiltered,
      });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.post("/editInvoice/:id", (req, res) => {
  console.log(req.body);
  let invoiceId = req.params.id;
  handleInvoice(req.body)
    .then((invoiceObject) => {
      console.log(invoiceObject);
      axios
        .put(api_url + "/api/invoice/" + invoiceId, invoiceObject, { headers })
        .then((response) => {
          res.redirect("/invoiceDashboard");
        })
        .catch((error) => {
          console.log(error);
          res.render("error", { error });
        });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.get("/deleteInvoice/:id", (req, res) => {
  let invoiceId = req.params.id;
  axios
    .get(api_url + "/api/aggregation/invoiceDetail/" + invoiceId, {
      headers,
    })
    .then((response) => {
      console.log(response.data);
      let invoice = response.data;
      res.render("invoiceDashboard_deleteInvoice", { invoice });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
});

router.get("/deleteDangerous/:id", (req, res) => {
  let invoiceId = req.params.id;
  axios
    .delete(api_url + "/api/invoice/" + invoiceId, { headers })
    .then((response) => {
      res.redirect("/invoiceDashboard");
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.post("/deleteInvoice/:id", async (req, res) => {
  let invoiceId = req.params.id;
  let chosenOrder = req.body.chosenOrder;
  if(chosenOrder){
    let response = await axios.get(api_url + "/api/order/" + chosenOrder, {headers});
    response.data.isConverted = false;
    console.log(response.data);
    await axios.put(api_url + "/api/order/" + chosenOrder, response.data, {headers});
  }
  

  axios
    .delete(api_url + "/api/invoice/" + invoiceId, { headers })
    .then((response) => {
      res.redirect("/invoiceDashboard");
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});


module.exports = router;
