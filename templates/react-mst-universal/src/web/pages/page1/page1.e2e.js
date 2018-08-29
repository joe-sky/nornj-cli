import puppeteer from 'puppeteer';

describe('Page1', () => {
  let browser;
  let page;

  beforeAll(async () => {
    jest.setTimeout(30000);
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:8080/dist/web#page1', { waitUntil: 'networkidle2' });
  });

  afterEach(() => page.close());

  it('Input text values and query', async () => {
    await page.waitForSelector('a.btn-link', {
      timeout: 3000
    });
    await page.type('input.ant-input', '10');
    await page.click('button.ant-btn:nth-of-type(1)');
    await page.waitForXPath('//td[contains(., "管理员10")]', {
      timeout: 3000
    });
    const text = await page.evaluate(() => document.querySelector('#page-wrap').innerHTML);
    expect(text).toContain('管理员10');
  });

  afterAll(() => browser.close());
});
