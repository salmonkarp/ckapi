require("dotenv").config();
const axios = require("axios");
const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

const headers = {
  "x-api-key": api_key,
};

async function handleOrder(body) {
  let returnObject = {};
  returnObject.invoiceDiscount = parseFloat(body.orderDiscount) || 0;
  returnObject.details = body.invoiceNote || "";
  returnObject.deliveryDate = body.deliveryDate || Date.now();
  returnObject.oldProductId = body.oldProductId || null;

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

  if (body.customerType === "existing") {
    returnObject.customerId = body.existingCustomer;
    return returnObject;
  } else {
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

module.exports = handleOrder;
