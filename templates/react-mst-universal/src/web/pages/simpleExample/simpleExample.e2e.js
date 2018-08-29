import puppeteer from 'puppeteer';

describe('SimpleExample', () => {
  let browser;
  let page;

  beforeAll(async () => {
    jest.setTimeout(30000);
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:8080/dist/web#simpleExample', { waitUntil: 'networkidle2' });
  });

  afterEach(() => page.close());

  it('It should have title text', async () => {
    await page.waitForSelector('.simpleExample', {
      timeout: 3000
    });
    const text = await page.evaluate(() => document.querySelector('.simpleExample').innerHTML);
    expect(text).toContain('示例页面');
  });

  afterAll(() => browser.close());
});
