import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateContract = async (req, res) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new'
    });

    const page = await browser.newPage();

    const htmlPath = path.resolve(
      __dirname,
      '../utils/bahodari-patra.html'
    );

    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0'
    });

    const pdfPath = path.resolve(
      __dirname,
      '../uploads/bahodari-patra.pdf'
    );

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm'
      }
    });

    await browser.close();

    // ⬇️ Send PDF as download
    res.download(pdfPath, 'bahodari-patra.pdf');

  } catch (error) {
    if (browser) await browser.close();
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'PDF generation failed'
    });
  }
};

export default generateContract;
