require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const handleOrder = require("../helper_functions/handleOrder");
const getStatData = require("../helper_functions/getStatData");

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

  return Promise.all(promises)
    .then((responses) => {
      const products = responses[0].data;
      const hampers = responses[1].data;
      const customers = responses[2].data;

      products.sort((a, b) => a.name.localeCompare(b.name));
      hampers.sort((a, b) => a.name.localeCompare(b.name));
      customers.sort((a, b) => a.name.localeCompare(b.name));

      return { products, hampers, customers };
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

function fetchFullFullData(orderId) {
  const promises = [];
  promises.push(axios.get(api_url + "/api/product", { headers }));
  promises.push(axios.get(api_url + "/api/hamper", { headers }));
  promises.push(axios.get(api_url + "/api/customer", { headers }));
  promises.push(
    axios.get(api_url + "/api/aggregation/orderDetail/" + orderId, { headers })
  );

  return Promise.all(promises)
    .then((responses) => {
      const products = responses[0].data;
      const hampers = responses[1].data;
      const customers = responses[2].data;
      const order = responses[3].data;

      products.sort((a, b) => a.name.localeCompare(b.name));
      hampers.sort((a, b) => a.name.localeCompare(b.name));
      customers.sort((a, b) => a.name.localeCompare(b.name));

      return { products, hampers, customers, order };
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

router.get("/addOrder", (req, res) => {
  fetchFullData()
    .then((combinedData) => {
      // console.log(combinedData);
      res.render("orderDashboard_addOrder", {
        products: combinedData.products,
        hampers: combinedData.hampers,
        customers: combinedData.customers,
      });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.post("/addOrder", async (req, res) => {
  console.log(req.body);
  handleOrder(req.body)
    .then((orderObject) => {
      console.log(orderObject);
      axios
        .post(api_url + "/api/order", orderObject, { headers })
        .then((response) => {
          res.redirect("/orderDashboard");
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

router.get("/editOrder/:id", (req, res) => {
  let orderId = req.params.id;
  fetchFullFullData(orderId)
    .then((combinedData) => {
      res.render("orderDashboard_editOrder", {
        products: combinedData.products,
        hampers: combinedData.hampers,
        customers: combinedData.customers,
        orderData: combinedData.order,
      });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.post("/editOrder/:id", (req, res) => {
  console.log(req.body);
  let orderId = req.params.id;
  handleOrder(req.body)
    .then((orderObject) => {
      console.log(orderObject);
      axios
        .put(api_url + "/api/order/" + orderId, orderObject, { headers })
        .then((response) => {
          res.redirect("/orderDashboard");
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

router.get("/deleteOrder/:id", (req, res) => {
  let orderId = req.params.id;
  axios
    .get(api_url + "/api/aggregation/orderDetail/" + orderId, {
      headers,
    })
    .then((response) => {
      console.log(response.data);
      let order = response.data;
      res.render("orderDashboard_deleteOrder", { order });
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
});

router.post("/deleteOrder/:id", (req, res) => {
  let orderId = req.params.id;
  axios
    .delete(api_url + "/api/order/" + orderId, { headers })
    .then((response) => {
      res.redirect("/orderDashboard");
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.get("/sendOrder/:id", (req, res) => {
  let orderId = req.params.id;
  axios
    .get(api_url + "/api/aggregation/orderDetail/" + orderId, {
      headers,
    })
    .then((response) => {
      let order = response.data;
      res.render("orderDashboard_sendOrder", { order });
    })
    .catch((error) => {
      console.log(error);
      res.render("error", { error });
    });
});

router.post("/sendOrder/:id", (req, res) => {
  let orderId = req.params.id;
  axios
    .get(api_url + "/api/order/" + orderId, { headers })
    .then((response) => {
      let orderObject = response.data;
      orderObject.isSent = true;
      axios
        .put(api_url + "/api/order/" + orderId, orderObject, { headers })
        .then((response) => {
          res.redirect("/orderDashboard");
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

router.get("/statistics", async (req,res) => {
  let orderArray = [];
  axios
    .get(api_url + "/api/aggregation/orderDetail", {
      headers,
    })
    .then((response) => {
      orderArray.push(response.data);
      console.log(orderArray);
      orderArray = orderArray[0].sort((a,b) => a.deliveryDateOld.localeCompare(b.deliveryDateOld));
      let sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 2);
      orderArray = orderArray.filter(item => new Date(item.deliveryDateOld) >= sixMonthsAgo && new Date(item.deliveryDateOld) <= new Date());
      getStatData(orderArray).then((statData) => {
        statData.dateStart = sixMonthsAgo;
        statData.dateEnd = new Date();
        statData.isSent = true;
        res.render("orderDashboard_statistics", { statData });
      })
      
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
})

router.post("/statistics", async (req,res) => {
  let invoiceArray = [];
  let endDate, startDate;
  if(req.body.dateEnd){
    endDate = new Date(req.body.dateEnd);
  }
  else{
    endDate = new Date();
  }
  if(req.body.dateStart){
    startDate = new Date(req.body.dateStart);
  }
  else{
    startDate = new Date(endDate);
    startDate.setMonth(endDate.getMonth() - 2);
  }
  let isSent = req.body.isSent;
  
  axios
    .get(api_url + "/api/aggregation/orderDetail", {
      headers,
    })
    .then((response) => {
      invoiceArray.push(response.data);
      invoiceArray = invoiceArray[0].sort((a,b) => a.deliveryDateOld.localeCompare(b.deliveryDateOld));
      console.log("limits", startDate, endDate);
      invoiceArray = invoiceArray.filter(item => new Date(item.deliveryDateOld) >= startDate && new Date(item.deliveryDateOld) <= endDate);
      if(!isSent){invoiceArray = invoiceArray.filter(item => !item.isSent)}
      getStatData(invoiceArray).then((statData) => {
        statData.dateStart = startDate;
        statData.dateEnd = endDate;
        statData.isSent = isSent;
        console.log(startDate, endDate);
        res.render("orderDashboard_statistics", { statData });
      })
      
    })
    .catch((error) => {
      console.error(error);
      res.render("error", { error });
    });
})

module.exports = router;
