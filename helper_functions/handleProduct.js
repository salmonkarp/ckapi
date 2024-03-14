function handleProductForm(body){
    productName = body.name;
    productCurrentStock = body.currentStock || 0;
    let i = 1;
    let prices = {}
    while(true){
        if(body[`priceType${i}`] && body[`priceValue${i}`]){
            prices[body[`priceType${i}`]] = parseInt(body[`priceValue${i}`]);
        }
        else{
            break;
        }
        i++;
    }
    return {
        name: productName,
        currentStock: productCurrentStock,
        prices: prices
    }
}

module.exports = handleProductForm;