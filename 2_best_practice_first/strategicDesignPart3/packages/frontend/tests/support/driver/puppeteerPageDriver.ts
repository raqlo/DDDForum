import puppeteer, { Browser, Page, LaunchOptions } from 'puppeteer';

export class PuppeteerPageDriver {
    constructor(public browser: Browser, public page: Page) {}

    public static async create(_options?: LaunchOptions) {
        const browserInstance = await puppeteer.launch({..._options})
        const page = await browserInstance.newPage();
        return new PuppeteerPageDriver(browserInstance, page);
    }
}