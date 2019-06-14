import puppeteer from 'puppeteer';

describe('ChartExample', () => {
  let browser;
  let page;

  beforeAll(async () => {
    jest.setTimeout(30000);
    browser = await puppeteer.launch({
      //headless: false,
      args: ['--no-sandbox']
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:8080/dist/web#ChartExample', { waitUntil: 'networkidle2' });
  });

  afterEach(() => page.close());

  it('It should have some text in modal', async () => {
    await page.waitForXPath('//h2[contains(., "Summary")]', {
      timeout: 3000
    });
    await page.click('div[class^="ant-row chartExample-m__brandCompareItem"]:nth-of-type(1) span.ant-checkbox');
    const text = await page.evaluate(() => document.querySelector('div[class^="chartExample-m__name"]').innerHTML);
    expect(text).toContain('品牌1');
  });

  afterAll(() => browser.close());
});
