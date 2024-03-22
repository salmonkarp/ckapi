const fs = require('fs')
const PDFDocument = require('pdfkit');

let data = {
    _id: '65fbe39ba92b01907fd8dd3b',
    customerId: '65ebd3acf1bfc229593941fc',
    deliveryDate: 'Mar 21, 2024',
    productContent: [
      {
        productId: '65ebcbab52d3dbc922330144',
        priceType: 'Umum',
        quantity: 30,
        discount: 5,
        customPrice: 0,
        _id: '65fbed281687168a4d41e294',
        priceValue: 111000,
        name: 'GT - Choco Cheese'
      },
      {
        productId: '65ebcbac52d3dbc922330164',
        priceType: 'Agen',
        quantity: 5.5,
        discount: 7.8,
        customPrice: 195000,
        _id: '65fbed281687168a4d41e295',
        priceValue: 125000,
        name: 'GT - Crunchy Almond'
      }
    ],
    hamperContent: [
      {
        hamperId: '65f705e26a3e3a349fae50bc',
        priceType: 'custom',
        quantity: 0.01,
        discount: 0,
        customPrice: 99000,
        _id: '65fbed281687168a4d41e296',
        priceValue: 99000,
        name: 'Basket Hampers Emerald'
      },
      {
        hamperId: '65f700966a3e3a349fae484d',
        priceType: 'Umum',
        quantity: 200,
        discount: 98.9,
        customPrice: 0,
        _id: '65fbed281687168a4d41e297',
        priceValue: 370000,
        name: 'Premium Big Box B (Luar Kota)'
      }
    ],
    invoiceDiscount: 15,
    details: 'a test invoice2',
    oldProductId: null,
    modified: false,
    createdAt: '2024-03-21T07:36:59.296Z',
    updatedAt: '2024-03-21T08:17:44.238Z',
    __v: 0,
    customerName: 'Patrick',
    customerAddress: 'Raya Wiguna Tengah 46 Surabaya',
    customerNote: 'Not a real customer',
    deliveryDateOld: '2024-03-21T00:00:00.000Z'
  }

const doc = new PDFDocument()
let filename = 'output.pdf'
drawContents(doc, data);
doc.pipe(fs.createWriteStream('./output.pdf'));
doc.end()

async function drawContents(drawContents, data){
    doc.fontSize(11);
    doc.text(data.deliveryDate,425,40);
    doc.text(data.customerName,425,70);
    doc.text(data.customerAddress,425,90);
    doc.text(data.customerNote,425,130);
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
        
        console.log(currentY);
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
        
        console.log(currentY);
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

    doc.text(orderTotal.toLocaleString(), 470, 500);

    
}