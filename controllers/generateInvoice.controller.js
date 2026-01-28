import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getPurchaseWithMobileAndSaleService } from '../services/purchaseWithMobile.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const shopData = {
  name: "SAMEER MOBILE SHOP",
  address: "3, Under Shakti Cinema, Nr. HDFC Bank",
  city: "Halvad - 363330",
  state: "Gujarat",
  phone: "+91 99785 23288",
  email: "samloadia@gmail.com",
  shopGstin: "24AHZPL1951D1Z7"
}

// {
//   "invoiceNo": "SMSI526",
//   "invoiceDate": "22/01/2026",

//   "vendorName": "Mohsin Baloch",
//   "vendorAddress": "Kalol",
//   "mobileNumber": "9010110101",
//   "shopGstin": "24AHZPL1951D1Z7",

//   "items": [
//     {
//       "srNo": 1,
//       "productName": "APPLE IPHONE 17",
//       "description": "256GB WHITE",
//       "imei": "350453406576709",
//       "hsn": "85171300",
//       "qty": 1,
//       "rate": 70254.24,
//       "gst": 18,
//       "amount": 70254.24
//     }
//   ],

//   "grandTotal": 70254.00,
//   "amountInWords": "Eighty Two Thousand Nine Hundred Only"
// }


const generatePdfInvoice = async (req, res) => {
  let browser;

  try {

    const data = await getPurchaseWithMobileAndSaleService(req.params.purchaseId);

    // Read HTML template
    const templatePath = path.resolve(
      __dirname,
      '../utils/invoice.html'
    );

    let html = fs.readFileSync(templatePath, 'utf8');

    // Basic field replacement
    html = html
      .replace(/{{invoiceNo}}/g, "SMR" + new Date().toLocaleDateString().replaceAll('/', ''))
      .replace(/{{invoiceDate}}/g, new Date().toLocaleDateString())

      .replace(/{{vendorName}}/g, data.vendorName)
      .replace(/{{vendorAddress}}/g, data.vendorAdress)
      .replace(/{{shopGstin}}/g, shopData.shopGstin)
      .replace(/{{mobileNumber}}/g, data.mobileNumber)

      // shop details
      // .replace(/{{shop.name}}/g, shopData.name)
      // .replace(/{{shop.address}}/g, shopData.address)
      // .replace(/{{shop.city}}/g, shopData.city)
      // .replace(/{{shop.state}}/g, shopData.state)
      // .replace(/{{shop.phone}}/g, shopData.phone)
      // .replace(/{{shop.email}}/g, shopData.email)

      // tax summary
      // .replace(/{{taxableAmount}}/g, data.tax.taxableAmount.toFixed(2))
      // .replace(/{{cgstPercent}}/g, data.tax.cgst)
      // .replace(/{{cgstAmount}}/g, data.tax.cgstAmount.toFixed(2))
      // .replace(/{{sgstPercent}}/g, data.tax.sgst)
      // .replace(/{{sgstAmount}}/g, data.tax.sgstAmount.toFixed(2))

      // totals
      .replace(/{{grandTotal}}/g, data.sale.sellingPrice)
      .replace(/{{amountInWords}}/g, data.sale.sellingPrice + " Only");

    const itemsHtml = `
      <tr style="text-align: center;">
        <td>${data?.srNo || 1}</td>
        <td>
          <strong>${data.mobile.brand}</strong><br/>
          ${data.mobile.model} ${data.mobile.storage} ${data.mobile.color}<br/><br/>
          IMEI: ${data.mobile.imei}
        </td>
        <td>${data.mobile.hsn || 85171300}</td>
        <td>${data.mobile.qty || 1}</td>
        <td>${data.sale.sellingPrice}</td>
        <td>${data.sale.sellingPrice}</td>
      </tr>
    `;

    html = html.replace(
      /{{items}}/g,
      itemsHtml
    );

    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    const pdfPath = path.resolve(
      __dirname,
      '../uploads/invoice.pdf'
    );

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm'
      }
    });

    await browser.close();

    return res.download(pdfPath, 'invoice.pdf');

  } catch (error) {
    if (browser) await browser.close();
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Invoice PDF generation failed'
    });
  }
};

export default generatePdfInvoice;
