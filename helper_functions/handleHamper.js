function handleHamper(body) {
  let contentsArray = [];

  for (let i = 0; i < body.contents.length; i++) {
    contentsArray.push({
      productId: body.contents[i],
      quantity: Number(body.quantities[i]),
    });
  }

  let i = 1;
  let prices = {};
  while (true) {
    if (body[`priceType${i}`] && body[`priceValue${i}`]) {
      prices[body[`priceType${i}`]] = parseInt(body[`priceValue${i}`]);
    } else {
      break;
    }
    i++;
  }

  return {
    name: body.name,
    contents: contentsArray,
    prices: prices,
  };
}

module.exports = handleHamper;
