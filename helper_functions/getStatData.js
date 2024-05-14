require("dotenv").config();
const axios = require("axios");

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

const headers = {
  "x-api-key": api_key,
};

function calculateOrderTotal(invoice) {
  let total = 0;
  invoice.productContent.forEach(product => {
    let subtotal;
    if(product.discount === 0) {
      subtotal = product.priceValue;
    }
    else {
      let discountValue = parseInt(product.priceValue * product.discount / 100);
      subtotal = product.priceValue - discountValue;
    }
    total += subtotal * product.quantity;
  })
  invoice.hamperContent.forEach(product => {
    let subtotal;
    if(product.discount === 0) {
      subtotal = product.priceValue;
    }
    else {
      let discountValue = parseInt(product.priceValue * product.discount / 100);
      subtotal = product.priceValue - discountValue;
    }
    total += subtotal * product.quantity;
  })
  return total;
}

async function getStatData(objects) {
    let customersList = {};
    let invoiceList = [];
    let productsList = {};
    let itemsList = {};
    let dayList = {};
    let statData;
    // getting initial hamper info
    let hamperInfo;
    return new Promise((resolve, reject) => {
      axios
      .get(api_url + "/api/aggregation/hamperDetail", {
        headers,
      })
      .then((response) => {
        hamperInfo = response.data.modifiedHampers;
        objects.forEach(object => {
          let orderTotal = calculateOrderTotal(object);

          // for ranking based on each invoice
          object.total = orderTotal;
          invoiceList.push(object);

          // for ranking based on each day
          if(dayList.hasOwnProperty(object.deliveryDateOld)){
            dayList[object.deliveryDateOld] += orderTotal;
          }
          else{
            dayList[object.deliveryDateOld] = orderTotal;
          }

          // for ranking based on each customer
          let combinedKey = object.customerId + " @ " + object.customerName;
          if(customersList.hasOwnProperty(combinedKey)){
            // already in records
            customersList[combinedKey] += orderTotal
          }
          else{
            customersList[combinedKey] = orderTotal
          }

          // for ranking based on each product
          object.productContent.forEach(product => {
            let combinedProductKey = product.productId + " @ " + product.name;
            // for the separate list, just add
            if(productsList.hasOwnProperty(combinedProductKey)){
              productsList[combinedProductKey] += product.quantity;
            }
            else{
              productsList[combinedProductKey] = product.quantity;
            }
            // for the merged list, just add
            if(itemsList.hasOwnProperty(combinedProductKey)){
              itemsList[combinedProductKey] += product.quantity;
            }
            else{
              itemsList[combinedProductKey] = product.quantity;
            }
          })
        
          // for ranking based on each hamper
          object.hamperContent.forEach(hamper => {
            let combinedHamperKey = hamper.hamperId + " @ " + hamper.name;
            // for the separated list, just add
            if(itemsList.hasOwnProperty(combinedHamperKey)){
              itemsList[combinedHamperKey] += hamper.quantity;
            }
            else{
              itemsList[combinedHamperKey] = hamper.quantity;
            }
            // for the merged list, need to pick apart
            let completeHamperObject = hamperInfo.find(obj => obj._id === hamper.hamperId);
            completeHamperObject.contents.forEach(content => {
              let specialProductKey = content.productId._id + " @ " + content.productId.name;
              if(productsList.hasOwnProperty(specialProductKey)){
                productsList[specialProductKey] += content.quantity * hamper.quantity;
              }
              else{
                productsList[specialProductKey] = content.quantity * hamper.quantity;
              }
            })
          })
        })
        
        let sortedInvoiceList = (invoiceList).sort((b, a) => a.total - b.total);
        let sortedDayList = Object.entries(dayList).sort((a,b) => a[1] - b[1]);
        let xValues = [], yValues = [];
        sortedDayList.forEach(pair => {
          let date = new Date(pair[0]);
          let readableDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          xValues.push(readableDate);
          yValues.push(pair[1]);
        })
        let sortedCustomersList = Object.entries(customersList).sort((b, a) => a[1] - b[1]);
        let sortedProductsList = Object.entries(productsList).sort((b, a) => a[1] - b[1]);
        let sortedItemsList = Object.entries(itemsList).sort((b, a) => a[1] - b[1]);
        resolve( {
          invoiceList: sortedInvoiceList,
          customersList: sortedCustomersList,
          productsList: sortedProductsList,
          itemsList: sortedItemsList,
          xValues: xValues,
          yValues: yValues
        });
      })
      .catch((error) => {
        reject(error);
      })
    });
    
}

module.exports = getStatData;