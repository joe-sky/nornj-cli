import puppeteer from 'puppeteer';
import { dev, e2e } from '@config/configs';

describe('FormExample', () => {
  let browser;
  let page;

  beforeAll(async () => {
    jest.setTimeout(e2e.timeout);
    browser = await puppeteer.launch({
      //headless: false,
      args: ['--no-sandbox']
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(`http://${dev.host}:${dev.port}/dist/#/FormExample`, { waitUntil: 'networkidle2' });
  });

  afterEach(() => page.close());

  it('It should have title text', async () => {
    await page.waitForXPath('//h2[contains(., "Ant Design 表单控件示例")]', {
      timeout: e2e.pageTimeout
    });
    await page.type('div[class^="formEls"]:nth-of-type(1) input', '输入测试数据');
    const text = await page.evaluate(() => document.querySelector('div[class^="formEls"]:nth-of-type(1) i').innerHTML);
    expect(text).toContain('输入测试数据');
  });

  afterAll(() => browser.close());
});
