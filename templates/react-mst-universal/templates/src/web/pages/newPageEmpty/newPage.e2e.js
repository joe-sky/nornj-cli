import puppeteer from 'puppeteer';

describe('#{pageName | capitalize}#', () => {
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
    await page.goto('http://localhost:8080/dist/web##{pageName | capitalize}#', { waitUntil: 'networkidle2' });
  });

  afterEach(() => page.close());

  it('It should have title text', async () => {
    await page.waitForSelector('.#{pageName}#', {
      timeout: 3000
    });
    const text = await page.evaluate(() => document.querySelector('.#{pageName}#').innerHTML);
    expect(text).toContain('示例页面');
  });

  afterAll(() => browser.close());
});
