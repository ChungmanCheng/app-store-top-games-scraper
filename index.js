
// const puppeteer = require("puppeteer");

// const getQuotes = async () => {

//     const browser = await puppeteer.launch({
//         headless: false,
//         defaultViewport: null,
//     });

//     const page = await browser.newPage();

//     await page.goto("https://apps.apple.com/us/story/id1535572612", {
//         waitUntil: "domcontentloaded",
//     });

//     const quotes = await page.evaluate( () => {
        
//         const quoteList = document.querySelectorAll(".we-product-collection__item");

//         return Array.from(quoteList).map( (quote, index) => {
//             const id = index + 1;
//             const name = quote.querySelector(".we-product-collection__item__product-name").innerText;
//             const description = quote.querySelector(".we-product-collection__item__category").innerText;
//             const image = quote.querySelector(".we-artwork--ios-app-icon").querySelector("source").getAttribute("srcset").match(/(https:\/\/[^,\s]+)/)[0];
//             const android_url = quote.querySelector(".we-product-collection__item__button").getAttribute("href");
//             const ios_url = quote.querySelector(".we-product-collection__item__button").getAttribute("href");
//             return { id, name, description, image, android_url, ios_url };
//         } );

//     });

//     console.log(quotes);

//     await browser.close();

// }

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Set up the Chrome options
const chromeOptions = new chrome.Options();
chromeOptions.headless();
chromeOptions.addArguments("--start-maximized");

const getQuotes = async () => {
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();
  
    try {

        await driver.get("https://apps.apple.com/us/story/id1535572612");
        await driver.wait(until.elementLocated(By.css(".we-product-collection__item")), 10000);
    
        const quoteList = await driver.findElements(By.css(".we-product-collection__item"));
    
        const quotes = await Promise.all(quoteList.map(async (quote, index) => {
            const id = index + 1;
            const name = await quote.findElement(By.css(".we-product-collection__item__product-name")).getText();
            const description = await quote.findElement(By.css(".we-product-collection__item__category")).getText();
        
            const imageElement = await quote.findElement(By.css(".we-artwork--ios-app-icon source"));
            const srcsetAttribute = await imageElement.getAttribute("srcset");
        
            // Extract the first URL from the srcset attribute
            const image = srcsetAttribute.match(/(https:\/\/[^,\s]+)/)[0];
        
            const androidButton = await quote.findElement(By.css(".we-product-collection__item__button"));
            const android_url = await androidButton.getAttribute("href");
            const ios_url = await androidButton.getAttribute("href");
        
            return { id, name, description, image, android_url, ios_url };
        }));

        return quotes;

    } finally {
        await driver.quit();
    }

};

async function main(){

    let driver = await new Builder().forBrowser("chrome").build();

    var temp = await getQuotes();

}

main();
