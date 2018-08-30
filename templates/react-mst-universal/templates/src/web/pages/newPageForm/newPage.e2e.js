import puppeteer from 'puppeteer';

describe('#{pageName | pascal}#', () => {
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
    await page.goto('http://localhost:8080/dist/web##{pageName | pascal}#', { waitUntil: 'networkidle2' });
  });

  afterEach(() => page.close());

  it('It should have title text', async () => {
    await page.waitForXPath('//h2[contains(., "Ant Design 表单控件示例")]', {
      timeout: 3000
    });
    await page.type('div[class^="#{pageName}#-m__formEls"]:nth-of-type(1) input', '输入测试数据');
    const text = await page.evaluate(() => document.querySelector('div[class^="#{pageName}#-m__formEls"]:nth-of-type(1) i').innerHTML);
    expect(text).toContain('输入测试数据');
  });

  afterAll(() => browser.close());
});
