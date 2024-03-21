require("dotenv").config();
const axios = require("axios");
const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

const headers = {
  "x-api-key": api_key,
};

async function handleInvoice(body) {
  let returnObject = {};
  returnObject.invoiceDiscount = parseFloat(body.invoiceDiscount) || 0;
  returnObject.details = body.invoiceNote || "";
  returnObject.deliveryDate = body.deliveryDate || Date.now();

  returnObject.productContent = [];
  returnObject.hamperContent = [];

  body.contents.forEach((contentId, index) => {
    let contentType = body[`${contentId}_contentType`];
    let priceType = body[`${contentId}_priceType`];
    let customPrice = parseFloat(body[`${contentId}_customPrice`]) || 0;
    let quantity = parseFloat(body.quantities[index]);
    let discount = parseFloat(body.discounts[index]);

    if (contentType === "product") {
      returnObject.productContent.push({
        productId: contentId,
        priceType: priceType,
        quantity: quantity,
        discount: discount,
        customPrice: customPrice,
      });
    } else {
      returnObject.hamperContent.push({
        hamperId: contentId,
        priceType: priceType,
        quantity: quantity,
        discount: discount,
        customPrice: customPrice,
      });
    }
  });
  let response;
  if(body.invoiceType === 'taken'){
    returnObject.oldProductId = body.chosenOrder;
    returnObject.modified = false;
    response = await axios.get(api_url + "/api/order/" + body.chosenOrder, {headers});
    if(response.data.details !== returnObject.details) {
      returnObject.modified = true
      console.log('details');
    }
    if(response.data.deliveryDate.split('T')[0] !== returnObject.deliveryDate) {
      returnObject.modified = true
      console.log('date');
    }
    if(response.data.orderDiscount !== returnObject.invoiceDiscount) {
      returnObject.modified = true
      console.log('disc', response.data.orderDiscount, returnObject.invoiceDiscount)
    }
    let cleanArr1 = response.data.productContent.map(item => {
      const { _id, ...rest} = item;
      return rest;
    })
    let cleanArr2 = response.data.hamperContent.map(item => {
      const { _id, ...rest} = item;
      return rest;
    })
    let str1 = JSON.stringify(cleanArr1.sort());
    let str2 = JSON.stringify(returnObject.productContent.sort());
    let str3 = JSON.stringify(cleanArr2.sort());
    let str4 = JSON.stringify(returnObject.hamperContent.sort());
    if(str1 !== str2 || str3 !== str4){
      returnObject.modified = true;
      console.log("hmp/prod");
    }

    let modifiedOrder = response.data;
    modifiedOrder.isConverted = true;
    axios.put(api_url + "/api/order/" + body.chosenOrder, modifiedOrder, {headers});
    
  }

  if (body.customerType === "existing" && response) {
    returnObject.customerId = body.existingCustomer;
    if(response.data.customerId !== returnObject.customerId) {
      returnObject.modified = true;
    }
    return returnObject;
  } else if (body.customerType === "existing") {
    returnObject.customerId = body.existingCustomer;
    return returnObject;
  } else {
    returnObject.modified = true;
    let customerObject = {
      name: body.customerName,
      address: body.customerAddress,
      note: body.customerNote,
    };
    console.log("making customer first, with request of", customerObject);
    return new Promise((resolve, reject) => {
      axios
        .post(api_url + "/api/customer", customerObject, { headers })
        .then((response) => {
          console.log(response.data, response.data._id);
          returnObject.customerId = response.data._id;
          resolve(returnObject);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

module.exports = handleInvoice;
