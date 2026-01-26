import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generatePdfInvoice = async (req, res) => {
  let browser;

  try {
    const data = req.body;

    // Read HTML template
    const templatePath = path.resolve(
      __dirname,
      '../utils/invoice.html'
    );

    let html = fs.readFileSync(templatePath, 'utf8');

    // Basic field replacement
    html = html
      .replace(/{{invoiceNo}}/g, data.invoiceNo)
      .replace(/{{invoiceDate}}/g, new Date().toLocaleDateString())
    
      .replace(/{{vendorName}}/g, data.vendorName)
      .replace(/{{vendorAddress}}/g, data.vendorAddress)
      .replace(/{{shopGstin}}/g, data.shopGstin)
      .replace(/{{mobileNumber}}/g, data.mobileNumber)

      // shop details
      .replace(/{{shop.name}}/g, data.shop.name)
      .replace(/{{shop.address}}/g, data.shop.address)
      .replace(/{{shop.city}}/g, data.shop.city)
      .replace(/{{shop.state}}/g, data.shop.state)
      .replace(/{{shop.phone}}/g, data.shop.phone)
      .replace(/{{shop.email}}/g, data.shop.email)

      // tax summary
      .replace(/{{taxableAmount}}/g, data.tax.taxableAmount.toFixed(2))
      .replace(/{{cgstPercent}}/g, data.tax.cgst)
      .replace(/{{cgstAmount}}/g, data.tax.cgstAmount.toFixed(2))
      .replace(/{{sgstPercent}}/g, data.tax.sgst)
      .replace(/{{sgstAmount}}/g, data.tax.sgstAmount.toFixed(2))

      // totals
      .replace(/{{grandTotal}}/g, data.grandTotal.toFixed(2))
      .replace(/{{amountInWords}}/g, data.amountInWords);

    const itemsHtml = data.items.map(item => `
      <tr style="text-align: center;">
        <td>${item.srNo}</td>
        <td>
          <strong>${item.productName}</strong><br/>
          ${item.description}<br/><br/>
          IMEI: ${item.imei}
        </td>
        <td>${item.hsn}</td>
        <td>${item.qty}</td>
        <td>${item.rate.toFixed(2)}</td>
        <td>${item.amount.toFixed(2)}</td>
      </tr>
    `).join('');

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
