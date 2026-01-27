import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getPurchaseWithMobileService } from '../services/purchaseWithMobile.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateContract = async (req, res) => {

    let browser;

    try {

        const data = await getPurchaseWithMobileService(req.params.purchaseId);

        const formatDate = (isoDate) => {
            const d = new Date(isoDate);
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')
                }/${d.getFullYear()}`;
        };

        // 1️⃣ Read HTML template
        const templatePath = path.resolve(
            __dirname,
            '../utils/bahodari-patra.html'
        );

        let html = fs.readFileSync(templatePath, 'utf8');

        // 2️⃣ Simple placeholder replacement
        html = html
            // basic fields
            .replace(/{{vendorName}}/g, data.vendorName)
            .replace(/{{vendorCity}}/g, data.vendorCity)
            .replace(/{{vendorAdress}}/g, data.vendorAdress)
            .replace(/{{shopName}}/g, data.shopName)
            .replace(/{{purchasePrice}}/g, data.purchasePrice)
            .replace(/{{billNumber}}/g, data.billNumber)
            .replace(/{{mobileNumber}}/g, data.mobileNumber)
            .replace(/{{purchaseDate}}/g, formatDate(Date.now()))

            // mobile nested fields
            .replace(/{{mobile.brand}}/g, data.mobile.brand)
            .replace(/{{mobile.model}}/g, data.mobile.model)
            .replace(/{{mobile.color}}/g, data.mobile.color)
            .replace(/{{mobile.imei}}/g, data.mobile.imei)

            // checkboxes
            .replace(/{{hasBill}}/g, data.hasOriginalBill ? 'checked' : '')
            .replace(/{{hasCharger}}/g, data.mobile.hasCharger ? 'checked' : '')
            .replace(/{{hasHandsFree}}/g, data.mobile.hasHandsFree ? 'checked' : '')
            .replace(/{{hasDataCable}}/g, data.mobile.hasDataCable ? 'checked' : '')
            .replace(/{{hasBox}}/g, data.mobile.hasBox ? 'checked' : '');
            

        // 3️⃣ Generate IMEI boxes
        const imeiBoxes = data.mobile.imei
            .split('')
            .map(() => `<span class="imei-box"></span>`)
            .join('');

        html.replace(
            '<div class="imei-boxes" id="imei-boxes"></div>',
            `<div class="imei-boxes">${imeiBoxes}</div>`
        );


        // 4️⃣ Puppeteer
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
            '../uploads/bahodari-patra.pdf'
        );

        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        res.download(pdfPath, 'bahodari-patra.pdf');

    } catch (err) {
        if (browser) await browser.close();
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'PDF generation failed'
        });
    }
};

export default generateContract;
