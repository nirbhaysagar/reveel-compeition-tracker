import puppeteer, { Browser, Page } from 'puppeteer';

export class ScraperService {

    //we we only start thebrowser once, cause its so expensive to start and stop it
    private static browser: Browser | null = null;

    //initialize browser
    static async initializeBrowser() {
        //if browser is already initialized, return it
        if(!this.browser) {
            //laumch chrome browser
            this.browser = await puppeteer.launch({
                headless: true,

                //arguments to make browseer work better in production/docker
                args: ['--no-sandbox', 
                       '--disable-setuid-sandbox', 
                       '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--disable-gpu'],

            });

            //log browser initialized
            console.log('Browser initialized');
        }
        return this.browser;
    }

    //close the browser when we are done
    static async closeBrowser() {
        if(this.browser) {
            await this.browser.close();
            this.browser = null;
            console.log('Browser closed');
        }
    }

    //main scrapping function
    /**
     * 
     * @param url
     * @param selector 
     * @returns
     */

    static async ScrapePrice(url: string, selector: string): Promise<number | null> {
        //variable to hold the current page
        let page: Page | null = null;

        try{
            //log what we are doing for debugging
            console.log(`Starting scrape for: ${url}`);
            console.log(`Using selector: ${selector}`);

            //1. get browserinstance if id doesn't exist
            const browser = await this.initializeBrowser();

            //2. open a new tab in browser
            page = await browser.newPage();

            //3. set user agent to look like areal browser
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            );

            //4. set browser window size
            await page.setViewport({ width: 1920, height: 1080});

            //navigate to competitors website
            console.log('Loading page....')
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000,
                });

            //wait for the price element to appear on the screen
            console.log('Waiting for price element....')
                await page.waitForSelector(selector, {
                    timeout: 10000
                });

            //extract the price from price element
                const priceText = await page.$eval(selector, (element: any)=>{
                    return element.textContent || '';
                });
            console.log('Price element found:', priceText);

            //parse the price from text to get a clean number
            const price = this.parsePrice(priceText);

            //log the results
            if(price !== null) {
                console.log('Price scraped successfully:', price);
            } else {
                console.log('Price scraping failed');
            }

            return price;

        }catch(error) {

            //something went wrong - log details for debugging
            if (error instanceof Error) {
                if (error.message.includes('timeout')) {
                    console.error('Timeout: Page took too long to load or selector not found');
                } else if (error.message.includes('waitForSelector')) {
                    console.error('Selector not found on page');
                }
            }
              return null;
        } finally {
            //close the page if it exists
            //this prevents memory leaks
            if(page) {
                await page.close()
                console.log('Page closed');
            }
        }
    }


    /**
     * parse price from the texting
     * @params text
     * @returns
     *  Examples:
     * "$999"        -> 999
     * "€1,299.99"   -> 1299.99
     * "From $799"   -> 799
     * "£499.00"     -> 499
     * "Price: ₹29,999" -> 29999
     */

    static parsePrice(text: string): number | null{
        //check if the text is empty or whitespaces
        if(!text || text.trim() === ''){
            return null;
        }

        //clean the text
        //remove currency, symbols, comms and other
        let cleaned = text
        .replace(/[$€£,\s]/g, '')
        .replace(/[,\s]/g, '')        
        .trim();

        //extract the first number from the cleaned text
        const match = cleaned.match(/\d+\.?\d*/);

        //if no number found, return null
        if(!match) {
            return null;
        }

        //convert the extracted number to a number
        const price = parseFloat(match[0]);

        //validate the price is reasonable
        if(isNaN(price) || price <= 0 || price > 1000000) {
            return null;
        }

        //return the clean validated price
        return price;
    }

    /**
   * Test function to manually test the scraper
   * Useful for debugging and testing with real websites
   * 
   * @param url - Website to test
   * @param selector - CSS selector to test
   * @returns The extracted price or null
   * 
   * Usage:
   * await ScraperService.testScrape(
   *   "https://apple.com/iphone",
   *   ".current-price"
   * );
   */

    static async testScrape(url: string, selector: string) {
        try{
            console.log('\n🧪 Testing Scraper...');
            console.log(`URL: ${url}`);
            console.log(`Selector: ${selector}\n`);

            //run the scrape
            const price = await this.ScrapePrice(url, selector);

            //show results
            if(price !== null){
                console.log(`\n✅ Scraped Price: $${price}`);
            } else {
                console.log('\n❌ Scraping failed');
            }

            await this.closeBrowser();

        }catch(error) {
            console.error('\n❌ Error:', error);
            console.log('Please check the URL and selector');
            return null;
        }
    }

}