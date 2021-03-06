import puppeteer from 'puppeteer';
import chromePaths from 'chrome-paths';
import { dev, e2e } from '@config/configs';

describe('DefaultExample', () => {
  let browser;
  let page;

  beforeAll(async () => {
    jest.setTimeout(e2e.timeout);
    browser = await puppeteer.launch({
      headless: e2e.headless,
      args: ['--no-sandbox'],
      executablePath: chromePaths.chrome
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(`http://${dev.host}:${dev.port}/dist/#/DefaultExample`, { waitUntil: 'networkidle2' });
  });

  afterEach(() => page.close());

  it('Input text values and query', async () => {
    await page.waitForSelector('a.btn-link', {
      timeout: e2e.pageTimeout
    });
    await page.type('input.ant-input', '10');
    await page.click('button.ant-btn:nth-of-type(1)');
    await page.waitForXPath('//td[contains(., "管理员10")]', {
      timeout: e2e.pageTimeout
    });
    const text = await page.evaluate(() => document.querySelector('#page-wrap').innerHTML);
    expect(text).toContain('管理员10');
  });

  afterAll(() => browser.close());
});
