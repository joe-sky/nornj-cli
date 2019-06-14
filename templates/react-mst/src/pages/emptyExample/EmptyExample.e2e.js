import puppeteer from 'puppeteer';

describe('EmptyExample', () => {
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
    await page.goto('http://localhost:8080/dist/web#EmptyExample', { waitUntil: 'networkidle2' });
  });

  afterEach(() => page.close());

  it('It should have title text', async () => {
    await page.waitForSelector('.emptyExample', {
      timeout: 3000
    });
    const text = await page.evaluate(() => document.querySelector('.emptyExample').innerHTML);
    expect(text).toContain('示例页面');
  });

  afterAll(() => browser.close());
});
