require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require('fs');
const PDFDocument = require('pdfkit');
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

router.get("/printInvoice/:id", (req, res) => {
  let invoiceId = req.params.id;
  axios
    .get(api_url + "/api/aggregation/invoiceDetail/" + invoiceId, {
      headers,
    })
    .then(async (response) => {
      console.log(response.data);
      let invoice = response.data;
      const doc = new PDFDocument()
      let filename = 'output.pdf'
      res.setHeader('Content-disposition', 'inline; filename="' + filename + '"')
      res.setHeader('Content-type', 'application/pdf')
      drawContents(doc, invoice);
      doc.pipe(res)
      doc.end()
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
})

router.get("/archiveInvoice/:id", (req, res) => {
  let invoiceId = req.params.id;
  axios
    .get(api_url + "/api/aggregation/invoiceDetail/" + invoiceId, {
      headers,
    })
    .then((response) => {
      console.log(response.data);
      let invoice = response.data;
      res.render("invoiceDashboard_archiveInvoice", { invoice });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
})

router.post("/archiveInvoice/:id", async (req, res) => {
  let invoiceId = req.params.id;
  let response = await axios.get(api_url + "/api/invoice/" + invoiceId, {headers});
  response.data.isArchived = true;
  axios
    .put(api_url + "/api/invoice/" + invoiceId, response.data, { headers })
    .then((response) => {
      res.redirect("/invoiceDashboard");
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
})

router.get("/statistics", (req,res) => {
  let invoiceArray = [];
  axios
    .get(api_url + "/api/aggregation/invoiceDetail", {
      headers,
    })
    .then((response) => {
      invoiceArray.push(response.data);
      const slicedData = invoiceArray[0].sort((a,b) => a.deliveryDateOld.localeCompare(b.deliveryDateOld));
      res.render("invoiceDashboard_statistics", { slicedData });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
})

async function drawContents(doc, data){
  doc.fontSize(11);
  doc.text(data.deliveryDate,425,40);
  doc.text(data.customerName,425,70);
  doc.text(data.customerAddress,425,90);
  doc.text(data.customerNote,425,130);
  doc.text(data.details,425,150);
  let additionalIndexes = 0;
  let orderTotal = 0;
  data.productContent.forEach((product,i) => {
      let index = i + additionalIndexes;
      let currentX = 90;
      let currentY = 225 + (index * 15);
      doc.text(product.quantity,currentX,currentY);
      doc.text('   x',currentX + 25,currentY);
      doc.text(product.name,currentX + 65,currentY);
      doc.text(product.priceValue + ' (' + product.priceType + ')',currentX + 275, currentY);
      if(product.discount > 0){
          doc.text(Math.ceil(product.priceValue * product.quantity * (1- (product.discount / 100))).toLocaleString(),currentX + 380, currentY);
          currentY += 15;
          doc.text('Discount ('+product.discount+'%)',currentX + 65,currentY);
          doc.text(Math.ceil(-product.priceValue * product.discount / 100).toLocaleString(),currentX + 275, currentY);
          currentY += 15;
          doc.text('='+Math.ceil(product.priceValue * (1 - (product.discount / 100))).toLocaleString(),currentX + 275, currentY);
          additionalIndexes+=2;
          orderTotal += Math.ceil(product.priceValue * product.quantity * (1- (product.discount / 100)));
      }
      else{
          doc.text(Math.ceil(product.priceValue * product.quantity).toLocaleString(),currentX + 380, currentY);
          orderTotal += Math.ceil(product.priceValue * product.quantity);
      }
  
  })
  data.hamperContent.forEach((hamper,i) => {
      let index = i + additionalIndexes + data.productContent.length;
      let currentX = 90;
      let currentY = 225 + (index * 15);
      doc.text(hamper.quantity,currentX,currentY);
      doc.text('   x',currentX + 25,currentY);
      doc.text(hamper.name,currentX + 65,currentY);
      doc.text(hamper.priceValue + ' (' + hamper.priceType + ')',currentX + 275, currentY);
      if(hamper.discount > 0){
          doc.text(Math.ceil(hamper.priceValue * hamper.quantity * (1- (hamper.discount / 100))).toLocaleString(),currentX + 380, currentY);
          currentY += 15;
          doc.text('Discount ('+hamper.discount+'%)',currentX + 65,currentY);
          doc.text(Math.ceil(-hamper.priceValue * hamper.discount / 100).toLocaleString(),currentX + 275, currentY);
          currentY += 15;
          doc.text('='+Math.ceil(hamper.priceValue * (1 - (hamper.discount / 100))).toLocaleString(),currentX + 275, currentY);
          additionalIndexes+=2;
          orderTotal += Math.ceil(hamper.priceValue * hamper.quantity * (1- (hamper.discount / 100)));
      }
      else{
          doc.text(Math.ceil(hamper.priceValue * hamper.quantity).toLocaleString(),currentX + 380, currentY);
          orderTotal += Math.ceil(hamper.priceValue * hamper.quantity);
      }
  })

  doc.text('Total', 365, 500);
  doc.text(orderTotal.toLocaleString(), 470, 500);
  if(data.invoiceDiscount > 0){
    doc.text('Discount (' + data.invoiceDiscount + '%)', 365, 515);
    doc.text(Math.ceil(orderTotal * data.invoiceDiscount / 100).toLocaleString(), 470, 515);
    doc.text('Final Total', 365, 530);
    doc.text(Math.ceil(orderTotal * (1 - (data.invoiceDiscount / 100))).toLocaleString(), 470, 530);
  }
}

module.exports = router;
